// /pages/api/save-image.ts
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import type { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' })
  }

  const { imageUrl, prompt, shirtColor, size } = req.body
  if (!imageUrl || !prompt || !shirtColor || !size) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) {
      const text = await imageRes.text()
      return res.status(500).json({ error: `Failed to fetch image: ${text}` })
    }

    const buffer = await imageRes.arrayBuffer()
    const fileName = `${uuidv4()}.png`

    const { error: storageError } = await supabase.storage
      .from('shirt-gallery')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (storageError) {
      return res.status(500).json({ error: `Storage upload failed: ${storageError.message}` })
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shirt-gallery/${fileName}`

    const { error: insertError } = await supabase.from('shirt_images').insert([
      {
        id: uuidv4(),
        url: publicUrl,
        prompt,
        shirt_color: shirtColor,
        size,
      },
    ])

    if (insertError) {
      return res.status(500).json({ error: `Database insert failed: ${insertError.message}` })
    }

    return res.status(200).json({ url: publicUrl })
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return res.status(500).json({ error: 'Unexpected error occurred' })
  }
}

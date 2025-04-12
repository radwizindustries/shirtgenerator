'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [designs, setDesigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchDesigns()
    }
  }, [user])

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('shirt_designs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDesigns(data)
    } catch (error) {
      console.error('Error fetching designs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading || isLoading) {
    return <div className="text-center text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Designs</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <div key={design.id} className="bg-white/10 rounded-lg p-4">
              <img
                src={design.image_url}
                alt={design.prompt}
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="mt-2 text-sm truncate" title={design.prompt}>
                {design.prompt}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(design.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {designs.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            You haven't created any designs yet.
          </div>
        )}
      </div>
    </div>
  )
} 
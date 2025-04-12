'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      alert('Check your email for the confirmation link!')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome</h2>
          <p className="mt-2 text-purple-200">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-black rounded"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-black rounded"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Sign in'}
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
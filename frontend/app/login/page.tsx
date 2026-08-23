'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    try {
      await login(username, password)
      router.push('/')
    } catch {
      setError('Invalid username or password')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-200 p-8"
      >
        <h1 className="mb-6 text-xl font-semibold">Log in</h1>

        <label className="mb-1 block text-sm font-medium">Username</label>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mb-4 w-full rounded border border-gray-300 px-3 py-2"
        />

        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-4 w-full rounded border border-gray-300 px-3 py-2"
        />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded bg-black py-2 text-white"
        >
          Log in
        </button>
      </form>
    </main>
  )
}

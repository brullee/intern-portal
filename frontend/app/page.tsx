'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import RequireAuth from '@/components/RequireAuth'

export default function Home() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  return (
    <RequireAuth>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold">Welcome, {user?.username}</h1>
        <p className="text-gray-600">Role: {user?.roleName}</p>
        <button
          onClick={handleLogout}
          className="rounded border border-gray-300 px-4 py-2"
        >
          Log out
        </button>
      </main>
    </RequireAuth>
  )
}

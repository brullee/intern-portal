'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser, useAuthActions } from '@/app/store/authStore'
import RequireAuth from '@/app/components/RequireAuth'

export default function Home() {
  const router = useRouter()
  const user = useUser()
  const { logout } = useAuthActions()

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  return (
    <RequireAuth>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold">Welcome, {user?.username}</h1>
        <p className="text-gray-600">Role: {user?.roleName}</p>
        <div className="flex gap-4">
          <Link href="/admin/universities" className="text-sm underline">
            Universities
          </Link>
          <Link href="/admin/doctors" className="text-sm underline">
            Doctors
          </Link>
          <Link href="/admin/mentors" className="text-sm underline">
            Mentors
          </Link>
          <Link href="/admin/interns" className="text-sm underline">
            Interns
          </Link>
        </div>
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

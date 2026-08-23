'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter()
  const status = useAuthStore((state) => state.status)
  const checkSession = useAuthStore((state) => state.checkSession)

  useEffect(() => {
    if (status === 'idle') {
      checkSession()
    }
  }, [status, checkSession])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'idle' || status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return <>{children}</>
}

import { create } from 'zustand'

export interface User {
  id: number
  username: string
  roleId: number
  roleName: string
}

type Status = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: User | null
  status: Status
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  login: async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      set({ user: null, status: 'unauthenticated' })
      throw new Error('Invalid username or password')
    }

    const data = await res.json()
    set({ user: data.user, status: 'authenticated' })
  },

  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    set({ user: null, status: 'unauthenticated' })
  },

  checkSession: async () => {
    set({ status: 'loading' })
    const res = await fetch('/api/auth/me')

    if (!res.ok) {
      set({ user: null, status: 'unauthenticated' })
      return
    }

    const data = await res.json()
    set({ user: data.user, status: 'authenticated' })
  },
}))

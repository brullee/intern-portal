import { create } from 'zustand'
import axios from 'axios'

export interface User {
  id: number
  username: string
  roleId: number
  roleName: string
}

type Status = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

interface AuthActions {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

interface AuthState {
  user: User | null
  status: Status
  actions: AuthActions
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  actions: {
    login: async (username, password) => {
      try {
        const response = await axios.post('/api/auth/login', {
          username,
          password,
        })
        set({ user: response.data.user, status: 'authenticated' })
      } catch {
        set({ user: null, status: 'unauthenticated' })
        throw new Error('Invalid username or password')
      }
    },

    logout: async () => {
      await axios.post('/api/auth/logout')
      set({ user: null, status: 'unauthenticated' })
    },

    checkSession: async () => {
      set({ status: 'loading' })
      try {
        const response = await axios.get('/api/auth/me')
        set({ user: response.data.user, status: 'authenticated' })
      } catch {
        set({ user: null, status: 'unauthenticated' })
      }
    },
  },
}))

export const useUser = () => useAuthStore((state) => state.user)
export const useAuthStatus = () => useAuthStore((state) => state.status)
export const useAuthActions = () => useAuthStore((state) => state.actions)

import { create } from 'zustand'
import authService, { type User } from '../services/authService'

export type { User }

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
        const user = await authService.login(username, password)
        set({ user, status: 'authenticated' })
      } catch {
        set({ user: null, status: 'unauthenticated' })
        throw new Error('Invalid username or password')
      }
    },

    logout: async () => {
      await authService.logout()
      set({ user: null, status: 'unauthenticated' })
    },

    checkSession: async () => {
      set({ status: 'loading' })
      try {
        const user = await authService.getSession()
        set({ user, status: 'authenticated' })
      } catch {
        set({ user: null, status: 'unauthenticated' })
      }
    },
  },
}))

export const useUser = () => useAuthStore((state) => state.user)
export const useAuthStatus = () => useAuthStore((state) => state.status)
export const useAuthActions = () => useAuthStore((state) => state.actions)

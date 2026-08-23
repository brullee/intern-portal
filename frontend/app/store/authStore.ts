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
  permissions: string[]
  status: Status
  actions: AuthActions
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  permissions: [],
  status: 'idle',

  actions: {
    login: async (username, password) => {
      try {
        await authService.login(username, password)
        const { user, permissions } = await authService.getSession()
        set({ user, permissions, status: 'authenticated' })
      } catch {
        set({ user: null, permissions: [], status: 'unauthenticated' })
        throw new Error('Invalid username or password')
      }
    },

    logout: async () => {
      await authService.logout()
      set({ user: null, permissions: [], status: 'unauthenticated' })
    },

    checkSession: async () => {
      set({ status: 'loading' })
      try {
        const { user, permissions } = await authService.getSession()
        set({ user, permissions, status: 'authenticated' })
      } catch {
        set({ user: null, permissions: [], status: 'unauthenticated' })
      }
    },
  },
}))

export const useUser = () => useAuthStore((state) => state.user)
export const useAuthStatus = () => useAuthStore((state) => state.status)
export const useAuthActions = () => useAuthStore((state) => state.actions)
export const usePermissions = () => useAuthStore((state) => state.permissions)
export const useHasPermission = (key: string) =>
  useAuthStore((state) => state.permissions.includes(key))

import axios from 'axios'

export interface User {
  id: number
  username: string
  roleId: number
  roleName: string
}

async function login(username: string, password: string): Promise<User> {
  const response = await axios.post('/api/auth/login', { username, password })
  return response.data.user
}

async function logout(): Promise<void> {
  await axios.post('/api/auth/logout')
}

export interface Session {
  user: User
  permissions: string[]
}

async function getSession(): Promise<Session> {
  const response = await axios.get('/api/auth/me')
  return { user: response.data.user, permissions: response.data.permissions }
}

const authService = { login, logout, getSession }

export default authService

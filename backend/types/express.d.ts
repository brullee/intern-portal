export interface AuthenticatedUser {
  id: number
  username: string
  roleId: number
  roleName: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

export {}

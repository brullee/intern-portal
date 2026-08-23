import type { Response } from 'express'

const isProduction = process.env.NODE_ENV === 'production'

const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

function setAccessCookie(res: Response, accessToken: string): void {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    path: '/',
  })
}

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  setAccessCookie(res, accessToken)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    path: '/',
  })
}

function clearAuthCookies(res: Response): void {
  res.clearCookie('access_token', { path: '/' })
  res.clearCookie('refresh_token', { path: '/' })
}

export { setAccessCookie, setAuthCookies, clearAuthCookies }

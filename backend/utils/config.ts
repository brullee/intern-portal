import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const PORT = process.env.PORT || 3001

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

const JWT_SECRET = requireEnv('JWT_SECRET')
const JWT_REFRESH_SECRET = requireEnv('JWT_REFRESH_SECRET')

export { PORT, JWT_SECRET, JWT_REFRESH_SECRET }

import type { Knex } from 'knex'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
}

export default config

import type { Knex } from 'knex'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './database/migrations',
  },
  seeds: {
    directory: './database/seeds',
  },
}

export default config

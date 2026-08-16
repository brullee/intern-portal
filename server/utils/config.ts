import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const PORT = process.env.PORT || 3001

export { PORT }

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes'
import universityRoutes from './routes/universityRoutes'
import doctorRoutes from './routes/doctorRoutes'
import doctorPortalRoutes from './routes/doctorPortalRoutes'
import mentorRoutes from './routes/mentorRoutes'
import internRoutes from './routes/internRoutes'
import projectRoutes from './routes/projectRoutes'
import taskRoutes from './routes/taskRoutes'
import taskSubmissionRoutes from './routes/taskSubmissionRoutes'
import planRoutes from './routes/planRoutes'
import meRoutes from './routes/meRoutes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' })
})

app.use('/api/auth', authRoutes)
app.use('/api/universities', universityRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/doctor', doctorPortalRoutes)
app.use('/api/mentors', mentorRoutes)
app.use('/api/interns', internRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/task-submissions', taskSubmissionRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/me', meRoutes)

app.use(errorHandler)

export default app

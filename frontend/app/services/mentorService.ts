import axios from 'axios'

export interface Mentor {
  user_id: number
  department: string | null
  title: string | null
  full_name: string
  username: string
  email: string | null
  is_active: boolean
}

export interface NewMentor {
  full_name: string
  username: string
  password: string
  department?: string
  title?: string
}

export interface MentorUpdate {
  department?: string
  title?: string
}

async function list(): Promise<Mentor[]> {
  const response = await axios.get('/api/mentors')
  return response.data.mentors
}

async function create(data: NewMentor): Promise<Mentor> {
  const response = await axios.post('/api/mentors', data)
  return response.data.mentor
}

async function update(userId: number, data: MentorUpdate): Promise<Mentor> {
  const response = await axios.put(`/api/mentors/${userId}`, data)
  return response.data.mentor
}

async function remove(userId: number): Promise<void> {
  await axios.delete(`/api/mentors/${userId}`)
}

const mentorService = { list, create, update, remove }

export default mentorService

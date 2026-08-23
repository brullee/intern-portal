import axios from 'axios'

export type InternType = 'student' | 'graduate' | 'other'
export type InternStatus =
  | 'applied'
  | 'active'
  | 'completed'
  | 'terminated'
  | 'on_leave'

export interface Intern {
  user_id: number
  university_id: number | null
  doctor_id: number | null
  student_id: string | null
  major: string | null
  intern_type: InternType
  cohort: string | null
  start_date: string
  end_date: string | null
  status: InternStatus
  full_name: string
  username: string
  email: string | null
  is_active: boolean
}

export interface NewIntern {
  full_name: string
  username: string
  password: string
  start_date: string
  university_id?: number
  doctor_id?: number
  student_id?: string
  major?: string
  intern_type?: InternType
  cohort?: string
}

export interface InternUpdate {
  university_id?: number | null
  doctor_id?: number | null
  student_id?: string
  major?: string
  intern_type?: InternType
  cohort?: string
  end_date?: string
  status?: InternStatus
}

async function list(): Promise<Intern[]> {
  const response = await axios.get('/api/interns')
  return response.data.interns
}

async function create(data: NewIntern): Promise<Intern> {
  const response = await axios.post('/api/interns', data)
  return response.data.intern
}

async function update(userId: number, data: InternUpdate): Promise<Intern> {
  const response = await axios.put(`/api/interns/${userId}`, data)
  return response.data.intern
}

async function remove(userId: number): Promise<void> {
  await axios.delete(`/api/interns/${userId}`)
}

const internService = { list, create, update, remove }

export default internService

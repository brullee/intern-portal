import axios from 'axios'

export interface Doctor {
  user_id: number
  university_id: number
  department: string | null
  title: string | null
  full_name: string
  username: string
  email: string | null
  is_active: boolean
}

export interface NewDoctor {
  full_name: string
  username: string
  password: string
  university_id: number
  department?: string
  title?: string
}

export interface DoctorUpdate {
  university_id?: number
  department?: string
  title?: string
}

async function list(): Promise<Doctor[]> {
  const response = await axios.get('/api/doctors')
  return response.data.doctors
}

async function create(data: NewDoctor): Promise<Doctor> {
  const response = await axios.post('/api/doctors', data)
  return response.data.doctor
}

async function update(userId: number, data: DoctorUpdate): Promise<Doctor> {
  const response = await axios.put(`/api/doctors/${userId}`, data)
  return response.data.doctor
}

async function remove(userId: number): Promise<void> {
  await axios.delete(`/api/doctors/${userId}`)
}

const doctorService = { list, create, update, remove }

export default doctorService

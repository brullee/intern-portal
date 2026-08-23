import axios from 'axios'

export interface University {
  id: number
  name: string
  country: string | null
  created_at: string
  updated_at: string
}

export interface NewUniversity {
  name: string
  country?: string
}

async function list(): Promise<University[]> {
  const response = await axios.get('/api/universities')
  return response.data.universities
}

async function create(data: NewUniversity): Promise<University> {
  const response = await axios.post('/api/universities', data)
  return response.data.university
}

async function update(
  id: number,
  data: Partial<NewUniversity>
): Promise<University> {
  const response = await axios.put(`/api/universities/${id}`, data)
  return response.data.university
}

async function remove(id: number): Promise<void> {
  await axios.delete(`/api/universities/${id}`)
}

const universityService = { list, create, update, remove }

export default universityService

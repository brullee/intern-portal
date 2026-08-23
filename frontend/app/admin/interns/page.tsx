'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import RequireAuth from '@/app/components/RequireAuth'
import { useHasPermission } from '@/app/store/authStore'
import { useField } from '@/app/hooks/useField'
import internService, {
  type Intern,
  type InternType,
  type InternStatus,
} from '@/app/services/internService'
import universityService, {
  type University,
} from '@/app/services/universityService'
import doctorService, { type Doctor } from '@/app/services/doctorService'

const INTERN_TYPES: InternType[] = ['student', 'graduate', 'other']
const INTERN_STATUSES: InternStatus[] = [
  'applied',
  'active',
  'completed',
  'terminated',
  'on_leave',
]

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.error === 'string') {
    return err.response.data.error
  }
  return fallback
}

function InternsPage() {
  const canManage = useHasPermission('manage_users')

  const [interns, setInterns] = useState<Intern[] | null>(null)
  const [universities, setUniversities] = useState<University[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [error, setError] = useState('')

  const fullName = useField('text')
  const username = useField('text')
  const password = useField('password')
  const startDate = useField('date')
  const studentId = useField('text')
  const major = useField('text')
  const cohort = useField('text')
  const internType = useField('text')
  const universityId = useField('text')
  const doctorId = useField('text')
  // reset() isn't a valid DOM input prop, so it's stripped before spreading
  const { reset: resetFullName, ...fullNameInput } = fullName
  const { reset: resetUsername, ...usernameInput } = username
  const { reset: resetPassword, ...passwordInput } = password
  const { reset: resetStartDate, ...startDateInput } = startDate
  const { reset: resetStudentId, ...studentIdInput } = studentId
  const { reset: resetMajor, ...majorInput } = major
  const { reset: resetCohort, ...cohortInput } = cohort
  const { reset: resetInternType, ...internTypeInput } = internType
  const { reset: resetUniversityId, ...universityIdInput } = universityId
  const { reset: resetDoctorId, ...doctorIdInput } = doctorId

  const isStudent = internType.value === '' || internType.value === 'student'

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editInternType, setEditInternType] = useState<InternType>('student')
  const [editUniversityId, setEditUniversityId] = useState('')
  const [editDoctorId, setEditDoctorId] = useState('')
  const [editStudentId, setEditStudentId] = useState('')
  const [editMajor, setEditMajor] = useState('')
  const [editCohort, setEditCohort] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [editStatus, setEditStatus] = useState<InternStatus>('applied')

  async function loadAll() {
    try {
      const [internList, universityList, doctorList] = await Promise.all([
        internService.list(),
        universityService.list(),
        doctorService.list(),
      ])
      setInterns(internList)
      setUniversities(universityList)
      setDoctors(doctorList)
    } catch {
      setError('Failed to load interns')
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; setState only runs after the awaited requests resolve, not synchronously
    loadAll()
  }, [])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    try {
      await internService.create({
        full_name: fullName.value,
        username: username.value,
        password: password.value,
        start_date: startDate.value,
        intern_type: (internType.value || 'student') as InternType,
        university_id: isStudent && universityId.value
          ? Number(universityId.value)
          : undefined,
        doctor_id: isStudent && doctorId.value
          ? Number(doctorId.value)
          : undefined,
        student_id: studentId.value.trim() || undefined,
        major: major.value.trim() || undefined,
        cohort: cohort.value.trim() || undefined,
      })
      resetFullName()
      resetUsername()
      resetPassword()
      resetStartDate()
      resetStudentId()
      resetMajor()
      resetCohort()
      resetInternType()
      resetUniversityId()
      resetDoctorId()
      await loadAll()
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create intern'))
    }
  }

  function startEdit(intern: Intern) {
    setEditingId(intern.user_id)
    setEditInternType(intern.intern_type)
    setEditUniversityId(intern.university_id ? String(intern.university_id) : '')
    setEditDoctorId(intern.doctor_id ? String(intern.doctor_id) : '')
    setEditStudentId(intern.student_id ?? '')
    setEditMajor(intern.major ?? '')
    setEditCohort(intern.cohort ?? '')
    setEditEndDate(intern.end_date ?? '')
    setEditStatus(intern.status)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleSaveEdit(userId: number) {
    setError('')
    const editIsStudent = editInternType === 'student'
    try {
      await internService.update(userId, {
        intern_type: editInternType,
        university_id: editIsStudent && editUniversityId
          ? Number(editUniversityId)
          : null,
        doctor_id: editIsStudent && editDoctorId ? Number(editDoctorId) : null,
        student_id: editStudentId.trim() || undefined,
        major: editMajor.trim() || undefined,
        cohort: editCohort.trim() || undefined,
        end_date: editEndDate || undefined,
        status: editStatus,
      })
      setEditingId(null)
      await loadAll()
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update intern'))
    }
  }

  async function handleDelete(userId: number) {
    setError('')
    try {
      await internService.remove(userId)
      await loadAll()
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete intern'))
    }
  }

  function universityName(id: number | null): string {
    if (!id) return ''
    return universities.find((u) => u.id === id)?.name ?? `#${id}`
  }

  function doctorName(id: number | null): string {
    if (!id) return ''
    return doctors.find((d) => d.user_id === id)?.full_name ?? `#${id}`
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Interns</h1>
        <Link href="/" className="text-sm text-gray-600 underline">
          Back home
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {canManage && (
        <form
          onSubmit={handleCreate}
          className="mb-8 flex flex-col gap-3 rounded border border-gray-200 p-4"
        >
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">
                Full name
              </label>
              <input
                {...fullNameInput}
                required
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">
                Username
              </label>
              <input
                {...usernameInput}
                required
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">
                Password
              </label>
              <input
                {...passwordInput}
                required
                minLength={8}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">
                Start date
              </label>
              <input
                {...startDateInput}
                required
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">
                Intern type
              </label>
              <select
                {...internTypeInput}
                className="w-full rounded border border-gray-300 px-3 py-2"
              >
                {INTERN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">
                Cohort
              </label>
              <input
                {...cohortInput}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          {isStudent && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium">
                  University
                </label>
                <select
                  {...universityIdInput}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                >
                  <option value="">No university</option>
                  {universities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium">
                  Doctor
                </label>
                <select
                  {...doctorIdInput}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                >
                  <option value="">No doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.user_id} value={doctor.user_id}>
                      {doctor.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium">
                  Student ID
                </label>
                <input
                  {...studentIdInput}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          )}

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Major</label>
            <input
              {...majorInput}
              className="w-full max-w-xs rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="self-start rounded bg-black px-4 py-2 text-white"
          >
            Add intern
          </button>
        </form>
      )}

      {interns === null && <p className="text-gray-600">Loading...</p>}

      {interns?.length === 0 && (
        <p className="text-gray-600">No interns yet.</p>
      )}

      <ul className="flex flex-col gap-2">
        {interns?.map((intern) => (
          <li key={intern.user_id} className="rounded border border-gray-200 p-4">
            {editingId === intern.user_id ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">
                      Intern type
                    </label>
                    <select
                      value={editInternType}
                      onChange={(event) =>
                        setEditInternType(event.target.value as InternType)
                      }
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      {INTERN_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">
                      Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(event) =>
                        setEditStatus(event.target.value as InternStatus)
                      }
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      {INTERN_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">
                      End date
                    </label>
                    <input
                      type="date"
                      value={editEndDate}
                      onChange={(event) => setEditEndDate(event.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                {editInternType === 'student' && (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="mb-1 block text-sm font-medium">
                        University
                      </label>
                      <select
                        value={editUniversityId}
                        onChange={(event) =>
                          setEditUniversityId(event.target.value)
                        }
                        className="w-full rounded border border-gray-300 px-3 py-2"
                      >
                        <option value="">No university</option>
                        {universities.map((university) => (
                          <option key={university.id} value={university.id}>
                            {university.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-sm font-medium">
                        Doctor
                      </label>
                      <select
                        value={editDoctorId}
                        onChange={(event) =>
                          setEditDoctorId(event.target.value)
                        }
                        className="w-full rounded border border-gray-300 px-3 py-2"
                      >
                        <option value="">No doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.user_id} value={doctor.user_id}>
                            {doctor.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-sm font-medium">
                        Student ID
                      </label>
                      <input
                        type="text"
                        value={editStudentId}
                        onChange={(event) =>
                          setEditStudentId(event.target.value)
                        }
                        className="w-full rounded border border-gray-300 px-3 py-2"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">
                      Major
                    </label>
                    <input
                      type="text"
                      value={editMajor}
                      onChange={(event) => setEditMajor(event.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">
                      Cohort
                    </label>
                    <input
                      type="text"
                      value={editCohort}
                      onChange={(event) => setEditCohort(event.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(intern.user_id)}
                    className="rounded bg-black px-3 py-2 text-sm text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{intern.full_name}</p>
                  <p className="text-sm text-gray-600">
                    @{intern.username} · {intern.intern_type} · {intern.status}
                    {intern.major ? ` · ${intern.major}` : ''}
                    {intern.cohort ? ` · ${intern.cohort}` : ''}
                    {universityName(intern.university_id)
                      ? ` · ${universityName(intern.university_id)}`
                      : ''}
                    {doctorName(intern.doctor_id)
                      ? ` · Dr. ${doctorName(intern.doctor_id)}`
                      : ''}
                  </p>
                </div>
                {canManage && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(intern)}
                      className="rounded border border-gray-300 px-3 py-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(intern.user_id)}
                      className="rounded border border-red-300 px-3 py-2 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default function Page() {
  return (
    <RequireAuth>
      <InternsPage />
    </RequireAuth>
  )
}

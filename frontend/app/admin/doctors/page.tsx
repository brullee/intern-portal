'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import RequireAuth from '@/app/components/RequireAuth'
import { useHasPermission } from '@/app/store/authStore'
import { useField } from '@/app/hooks/useField'
import doctorService, { type Doctor } from '@/app/services/doctorService'
import universityService, {
  type University,
} from '@/app/services/universityService'

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.error === 'string') {
    return err.response.data.error
  }
  return fallback
}

function DoctorsPage() {
  const canManage = useHasPermission('manage_users')

  const [doctors, setDoctors] = useState<Doctor[] | null>(null)
  const [universities, setUniversities] = useState<University[]>([])
  const [error, setError] = useState('')

  const fullName = useField('text')
  const username = useField('text')
  const password = useField('password')
  const universityId = useField('text')
  const department = useField('text')
  const title = useField('text')
  // reset() isn't a valid DOM input prop, so it's stripped before spreading
  const { reset: resetFullName, ...fullNameInput } = fullName
  const { reset: resetUsername, ...usernameInput } = username
  const { reset: resetPassword, ...passwordInput } = password
  const { reset: resetUniversityId, ...universityIdInput } = universityId
  const { reset: resetDepartment, ...departmentInput } = department
  const { reset: resetTitle, ...titleInput } = title

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editUniversityId, setEditUniversityId] = useState('')
  const [editDepartment, setEditDepartment] = useState('')
  const [editTitle, setEditTitle] = useState('')

  async function loadAll() {
    try {
      const [doctorList, universityList] = await Promise.all([
        doctorService.list(),
        universityService.list(),
      ])
      setDoctors(doctorList)
      setUniversities(universityList)
    } catch {
      setError('Failed to load doctors')
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
      await doctorService.create({
        full_name: fullName.value,
        username: username.value,
        password: password.value,
        university_id: Number(universityId.value),
        department: department.value.trim() || undefined,
        title: title.value.trim() || undefined,
      })
      resetFullName()
      resetUsername()
      resetPassword()
      resetUniversityId()
      resetDepartment()
      resetTitle()
      await loadAll()
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create doctor'))
    }
  }

  function startEdit(doctor: Doctor) {
    setEditingId(doctor.user_id)
    setEditUniversityId(String(doctor.university_id))
    setEditDepartment(doctor.department ?? '')
    setEditTitle(doctor.title ?? '')
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleSaveEdit(userId: number) {
    setError('')
    try {
      await doctorService.update(userId, {
        university_id: Number(editUniversityId),
        department: editDepartment.trim() || undefined,
        title: editTitle.trim() || undefined,
      })
      setEditingId(null)
      await loadAll()
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update doctor'))
    }
  }

  async function handleDelete(userId: number) {
    setError('')
    try {
      await doctorService.remove(userId)
      await loadAll()
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete doctor'))
    }
  }

  function universityName(id: number): string {
    return universities.find((u) => u.id === id)?.name ?? `#${id}`
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Doctors</h1>
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
                University
              </label>
              <select
                {...universityIdInput}
                required
                className="w-full rounded border border-gray-300 px-3 py-2"
              >
                <option value="" disabled>
                  Select a university
                </option>
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">
                Department
              </label>
              <input
                {...departmentInput}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input
                {...titleInput}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="self-start rounded bg-black px-4 py-2 text-white"
          >
            Add doctor
          </button>
        </form>
      )}

      {doctors === null && <p className="text-gray-600">Loading...</p>}

      {doctors?.length === 0 && (
        <p className="text-gray-600">No doctors yet.</p>
      )}

      <ul className="flex flex-col gap-2">
        {doctors?.map((doctor) => (
          <li key={doctor.user_id} className="rounded border border-gray-200 p-4">
            {editingId === doctor.user_id ? (
              <div className="flex flex-col gap-2">
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
                      {universities.map((university) => (
                        <option key={university.id} value={university.id}>
                          {university.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">
                      Department
                    </label>
                    <input
                      type="text"
                      value={editDepartment}
                      onChange={(event) =>
                        setEditDepartment(event.target.value)
                      }
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(doctor.user_id)}
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
                  <p className="font-medium">{doctor.full_name}</p>
                  <p className="text-sm text-gray-600">
                    @{doctor.username} · {universityName(doctor.university_id)}
                    {doctor.department ? ` · ${doctor.department}` : ''}
                    {doctor.title ? ` · ${doctor.title}` : ''}
                  </p>
                </div>
                {canManage && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(doctor)}
                      className="rounded border border-gray-300 px-3 py-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.user_id)}
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
      <DoctorsPage />
    </RequireAuth>
  )
}

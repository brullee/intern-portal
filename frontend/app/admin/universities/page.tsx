'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import RequireAuth from '@/app/components/RequireAuth'
import { useHasPermission } from '@/app/store/authStore'
import { useField } from '@/app/hooks/useField'
import universityService, {
  type University,
} from '@/app/services/universityService'

function UniversitiesPage() {
  const canManage = useHasPermission('manage_users')

  const [universities, setUniversities] = useState<University[] | null>(null)
  const [error, setError] = useState('')

  const name = useField('text')
  const country = useField('text')
  // reset() isn't a valid DOM input prop, so it's stripped before spreading
  const { reset: resetName, ...nameInput } = name
  const { reset: resetCountry, ...countryInput } = country

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editCountry, setEditCountry] = useState('')

  async function loadUniversities() {
    try {
      setUniversities(await universityService.list())
    } catch {
      setError('Failed to load universities')
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; setState only runs after the awaited request resolves, not synchronously
    loadUniversities()
  }, [])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    try {
      await universityService.create({
        name: name.value,
        country: country.value.trim() || undefined,
      })
      resetName()
      resetCountry()
      await loadUniversities()
    } catch {
      setError('Failed to create university')
    }
  }

  function startEdit(university: University) {
    setEditingId(university.id)
    setEditName(university.name)
    setEditCountry(university.country ?? '')
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleSaveEdit(id: number) {
    setError('')
    try {
      await universityService.update(id, {
        name: editName,
        country: editCountry.trim() || undefined,
      })
      setEditingId(null)
      await loadUniversities()
    } catch {
      setError('Failed to update university')
    }
  }

  async function handleDelete(id: number) {
    setError('')
    try {
      await universityService.remove(id)
      await loadUniversities()
    } catch {
      setError('Failed to delete university')
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Universities</h1>
        <Link href="/" className="text-sm text-gray-600 underline">
          Back home
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {canManage && (
        <form
          onSubmit={handleCreate}
          className="mb-8 flex items-end gap-2 rounded border border-gray-200 p-4"
        >
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              {...nameInput}
              required
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Country</label>
            <input
              {...countryInput}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Add
          </button>
        </form>
      )}

      {universities === null && <p className="text-gray-600">Loading...</p>}

      {universities?.length === 0 && (
        <p className="text-gray-600">No universities yet.</p>
      )}

      <ul className="flex flex-col gap-2">
        {universities?.map((university) => (
          <li
            key={university.id}
            className="rounded border border-gray-200 p-4"
          >
            {editingId === university.id ? (
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(event) => setEditCountry(event.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <button
                  onClick={() => handleSaveEdit(university.id)}
                  className="rounded bg-black px-3 py-2 text-white"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="rounded border border-gray-300 px-3 py-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{university.name}</p>
                  <p className="text-sm text-gray-600">
                    {university.country ?? 'No country set'}
                  </p>
                </div>
                {canManage && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(university)}
                      className="rounded border border-gray-300 px-3 py-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(university.id)}
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
      <UniversitiesPage />
    </RequireAuth>
  )
}

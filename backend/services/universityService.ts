import universitiesModel, { type University } from '../models/universities'

export class ValidationError extends Error {}

export interface UniversityInput {
  name: string
  country?: string
}

function assertValidName(name: string): void {
  if (!name || !name.trim()) {
    throw new ValidationError('name is required')
  }
}

function listUniversities(): Promise<University[]> {
  return universitiesModel.findAll()
}

function getUniversity(id: number): Promise<University | undefined> {
  return universitiesModel.findById(id)
}

function createUniversity(input: UniversityInput): Promise<University> {
  assertValidName(input.name)
  return universitiesModel.create({
    name: input.name.trim(),
    country: input.country?.trim(),
  })
}

function updateUniversity(
  id: number,
  input: Partial<UniversityInput>
): Promise<University | undefined> {
  if (input.name !== undefined) assertValidName(input.name)
  return universitiesModel.update(id, input)
}

async function deleteUniversity(id: number): Promise<boolean> {
  const deletedCount = await universitiesModel.remove(id)
  return deletedCount > 0
}

export default {
  listUniversities,
  getUniversity,
  createUniversity,
  updateUniversity,
  deleteUniversity,
}

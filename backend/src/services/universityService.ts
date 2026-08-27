import universitiesModel, { type University } from '../models/universities'
import { PaginationParams, paginatedResponse } from '../utils/pagination'
import type {
  CreateUniversityBody,
  UpdateUniversityBody,
} from '../schemas/universitySchemas'

export async function listUniversities(
  pagination: PaginationParams,
  filters: { includeInactive?: boolean } = {}
) {
  const { rows, total } = await universitiesModel.list(pagination, filters)
  return paginatedResponse(rows, total, pagination)
}

function getUniversity(id: number): Promise<University | undefined> {
  return universitiesModel.findById(id)
}

function createUniversity(input: CreateUniversityBody): Promise<University> {
  return universitiesModel.create({
    name: input.name,
    country: input.country,
  })
}

function updateUniversity(
  id: number,
  input: UpdateUniversityBody
): Promise<University | undefined> {
  return universitiesModel.update(id, input)
}

async function deactivateUniversity(id: number): Promise<boolean> {
  const updatedCount = await universitiesModel.setActive(id, false)
  return updatedCount > 0
}

export default {
  listUniversities,
  getUniversity,
  createUniversity,
  updateUniversity,
  deactivateUniversity,
}

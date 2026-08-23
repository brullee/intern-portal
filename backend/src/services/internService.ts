import bcrypt from 'bcrypt'
import knex from '../../db'
import internsModel, {
  type InternWithUser,
  type NewIntern,
  DuplicateUsernameError,
} from '../models/interns'

export { DuplicateUsernameError }

const SALT_ROUNDS = 10

export class ValidationError extends Error {}

export interface InternInput {
  full_name: string
  username: string
  password: string
  start_date: string
  university_id?: number
  doctor_id?: number
  student_id?: string
  major?: string
  intern_type?: 'student' | 'graduate' | 'other'
  cohort?: string
  end_date?: string
  status?: 'applied' | 'active' | 'completed' | 'terminated' | 'on_leave'
}

// Mirrors the DB's chk_interns_non_student_no_academic_link CHECK constraint —
// caught here so the UI/caller gets a clean 400 instead of a raw DB error.
function assertAcademicLinkAllowed(
  internType: string,
  universityId?: number | null,
  doctorId?: number | null
): void {
  if (internType !== 'student' && (universityId || doctorId)) {
    throw new ValidationError(
      'university_id and doctor_id can only be set when intern_type is "student"'
    )
  }
}

function assertValid(input: InternInput): void {
  if (!input.full_name?.trim()) {
    throw new ValidationError('full_name is required')
  }
  if (!input.username?.trim()) {
    throw new ValidationError('username is required')
  }
  if (!input.password || input.password.length < 8) {
    throw new ValidationError('password must be at least 8 characters')
  }
  if (!input.start_date) {
    throw new ValidationError('start_date is required')
  }
  assertAcademicLinkAllowed(
    input.intern_type ?? 'student',
    input.university_id,
    input.doctor_id
  )
}

async function getInternRoleId(): Promise<number> {
  const role = await knex('roles').where({ name: 'intern' }).first()
  if (!role) throw new Error('intern role not seeded')
  return role.id
}

function listInterns(): Promise<InternWithUser[]> {
  return internsModel.findAll()
}

function getIntern(userId: number): Promise<InternWithUser | undefined> {
  return internsModel.findById(userId)
}

async function createIntern(input: InternInput): Promise<InternWithUser> {
  assertValid(input)
  const role_id = await getInternRoleId()
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS)

  const data: NewIntern = {
    full_name: input.full_name.trim(),
    username: input.username.trim(),
    password_hash,
    role_id,
    university_id: input.university_id,
    doctor_id: input.doctor_id,
    student_id: input.student_id?.trim(),
    major: input.major?.trim(),
    intern_type: input.intern_type,
    cohort: input.cohort?.trim(),
    start_date: input.start_date,
    end_date: input.end_date,
    status: input.status,
  }

  return internsModel.create(data)
}

async function updateIntern(
  userId: number,
  input: Partial<
    Pick<
      InternInput,
      | 'university_id'
      | 'doctor_id'
      | 'student_id'
      | 'major'
      | 'intern_type'
      | 'cohort'
      | 'end_date'
      | 'status'
    >
  >
): Promise<InternWithUser | undefined> {
  if (
    input.intern_type !== undefined ||
    input.university_id !== undefined ||
    input.doctor_id !== undefined
  ) {
    const current = await internsModel.findById(userId)
    if (!current) return undefined

    const effectiveType = input.intern_type ?? current.intern_type
    const effectiveUniversityId =
      input.university_id !== undefined
        ? input.university_id
        : current.university_id
    const effectiveDoctorId =
      input.doctor_id !== undefined ? input.doctor_id : current.doctor_id

    assertAcademicLinkAllowed(
      effectiveType,
      effectiveUniversityId,
      effectiveDoctorId
    )
  }

  const updatedCount = await internsModel.update(userId, input)
  if (updatedCount === 0) return undefined
  return internsModel.findById(userId)
}

async function deleteIntern(userId: number): Promise<boolean> {
  const deletedCount = await internsModel.remove(userId)
  return deletedCount > 0
}

export default {
  listInterns,
  getIntern,
  createIntern,
  updateIntern,
  deleteIntern,
}

import doctorModel from '../models/doctors'
import internModel from '../models/interns'
import taskAssignmentModel from '../models/taskAssignments'
import * as planService from './planService'
import * as attendanceService from './attendanceService'
import { PaginationParams, paginatedResponse } from '../utils/pagination'
import { InternNotInScopeError } from '../errors/doctorScopeErrors'

async function verifyInScope(doctorUserId: number, internUserId: number) {
  const doctor = await doctorModel.findById(doctorUserId)
  const intern = await internModel.findById(internUserId)
  if (
    !doctor ||
    !intern ||
    intern.intern_type !== 'student' ||
    intern.university_id !== doctor.university_id
  ) {
    throw new InternNotInScopeError()
  }
  return intern
}

export async function listInterns(
  doctorUserId: number,
  pagination: PaginationParams
) {
  const doctor = await doctorModel.findById(doctorUserId)
  if (!doctor) {
    return paginatedResponse([], 0, pagination)
  }
  const { rows, total } = await internModel.list(pagination, {
    universityId: doctor.university_id,
    internType: 'student',
  })
  return paginatedResponse(rows, total, pagination)
}

export async function getInternProfile(
  doctorUserId: number,
  internUserId: number
) {
  return verifyInScope(doctorUserId, internUserId)
}

export async function listInternTasks(
  doctorUserId: number,
  internUserId: number,
  pagination: PaginationParams
) {
  await verifyInScope(doctorUserId, internUserId)
  const { rows, total } = await taskAssignmentModel.listTasksForIntern(
    internUserId,
    pagination
  )
  return paginatedResponse(rows, total, pagination)
}

export async function listInternPlans(
  doctorUserId: number,
  internUserId: number,
  pagination: PaginationParams
) {
  await verifyInScope(doctorUserId, internUserId)
  return planService.listPlansForIntern(internUserId, pagination)
}

export async function listInternAttendance(
  doctorUserId: number,
  internUserId: number,
  pagination: PaginationParams
) {
  await verifyInScope(doctorUserId, internUserId)
  return attendanceService.listSessions(pagination, { internId: internUserId })
}

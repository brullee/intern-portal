import { Request, Response } from 'express'
import * as doctorScopeService from '../services/doctorScopeService'
import { parsePagination } from '../utils/pagination'

export async function listInterns(req: Request, res: Response) {
  const pagination = parsePagination(req)
  const result = await doctorScopeService.listInterns(req.user!.id, pagination)
  return res.json(result)
}

export async function getInternProfile(req: Request, res: Response) {
  const id = Number(req.params.id)
  const intern = await doctorScopeService.getInternProfile(req.user!.id, id)
  return res.json({ intern })
}

export async function listInternTasks(req: Request, res: Response) {
  const id = Number(req.params.id)
  const pagination = parsePagination(req)
  const result = await doctorScopeService.listInternTasks(
    req.user!.id,
    id,
    pagination
  )
  return res.json(result)
}

export async function listInternPlans(req: Request, res: Response) {
  const id = Number(req.params.id)
  const pagination = parsePagination(req)
  const result = await doctorScopeService.listInternPlans(
    req.user!.id,
    id,
    pagination
  )
  return res.json(result)
}

export async function listInternAttendance(req: Request, res: Response) {
  const id = Number(req.params.id)
  const pagination = parsePagination(req)
  const result = await doctorScopeService.listInternAttendance(
    req.user!.id,
    id,
    pagination
  )
  return res.json(result)
}

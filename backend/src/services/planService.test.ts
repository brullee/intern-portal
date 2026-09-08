import { test, before, after } from 'node:test'
import assert from 'node:assert'
import bcrypt from 'bcrypt'
import supertest from 'supertest'
import app from '../app'
import knex from '../../db'

const adminApi = supertest.agent(app)

const USERNAME = 'plan-test-intern'

let internId: number
let planId: number
const milestoneIds: number[] = []

async function cleanup() {
  const existing = await knex('users').where({ username: USERNAME }).first()
  if (existing) {
    await knex('plans').where({ intern_id: existing.id }).del()
    await knex('users').where({ id: existing.id }).del()
  }
}

after(async () => {
  await cleanup()
  await knex.destroy()
})

before(async () => {
  await cleanup()

  const internRole = await knex('roles').where({ name: 'intern' }).first()
  const [user] = await knex('users')
    .insert({
      full_name: 'Plan Test Intern',
      username: USERNAME,
      password_hash: await bcrypt.hash('password', 10),
      role_id: internRole.id,
      is_active: true,
    })
    .returning('*')
  internId = user.id
  await knex('interns').insert({
    user_id: internId,
    intern_type: 'graduate',
    start_date: '2026-01-01',
    status: 'active',
  })

  await adminApi
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password' })
    .expect(200)

  const planRes = await adminApi
    .post('/api/plans')
    .send({ intern_id: internId, title: 'Plan Test Plan' })
    .expect(201)
  planId = planRes.body.plan.id

  for (const title of ['M1', 'M2', 'M3', 'M4']) {
    const res = await adminApi
      .post(`/api/plans/${planId}/milestones`)
      .send({ title })
      .expect(201)
    milestoneIds.push(res.body.milestone.id)
  }
})

test('a plan with no completed milestones reports 0% progress', async () => {
  const res = await adminApi.get(`/api/plans/${planId}`).expect(200)
  assert.equal(res.body.plan.progress, 0)
})

test('progress is completed milestones as a rounded percentage', async () => {
  await adminApi
    .patch(`/api/plans/${planId}/milestones/${milestoneIds[0]}`)
    .send({ status: 'completed' })
    .expect(200)

  const res = await adminApi.get(`/api/plans/${planId}`).expect(200)
  assert.equal(res.body.plan.progress, 25)
})

test('progress reaches 100 once every milestone is completed', async () => {
  for (const id of milestoneIds) {
    await adminApi
      .patch(`/api/plans/${planId}/milestones/${id}`)
      .send({ status: 'completed' })
      .expect(200)
  }

  const res = await adminApi.get(`/api/plans/${planId}`).expect(200)
  assert.equal(res.body.plan.progress, 100)
})

test('the plans list carries progress for each plan', async () => {
  const res = await adminApi.get(`/api/plans?intern_id=${internId}`).expect(200)
  const plan = res.body.plans.find((p: { id: number }) => p.id === planId)
  assert.equal(plan.progress, 100)
})

test('GET document is 404 with PLAN_NOT_FOUND for an unknown plan', async () => {
  const res = await adminApi.get('/api/plans/99999999/document').expect(404)
  assert.equal(res.body.code, 'PLAN_NOT_FOUND')
})

test('GET document is 404 with PLAN_DOCUMENT_NOT_FOUND when the plan has none', async () => {
  const res = await adminApi.get(`/api/plans/${planId}/document`).expect(404)
  assert.equal(res.body.code, 'PLAN_DOCUMENT_NOT_FOUND')
})

test('the progress report lists every plan with its derived progress', async () => {
  const res = await adminApi.get('/api/plans/progress-report').expect(200)
  const row = res.body.data.find(
    (r: { plan_id: number }) => r.plan_id === planId
  )
  assert.equal(row.progress, 100)
  assert.equal(row.title, 'Plan Test Plan')
})

test('a milestone cannot be reached through the wrong plan id', async () => {
  const other = await adminApi
    .post('/api/plans')
    .send({ intern_id: internId, title: 'Other Plan' })
    .expect(201)

  const res = await adminApi
    .patch(`/api/plans/${other.body.plan.id}/milestones/${milestoneIds[0]}`)
    .send({ status: 'in_progress' })
    .expect(404)
  assert.equal(res.body.code, 'MILESTONE_NOT_FOUND')
})

test('a plan can be reassigned to a different intern', async () => {
  const otherIntern = await knex('interns')
    .whereNot({ user_id: internId })
    .first()

  const res = await adminApi
    .patch(`/api/plans/${planId}`)
    .send({ intern_id: otherIntern.user_id })
    .expect(200)
  assert.equal(res.body.plan.intern_id, otherIntern.user_id)

  await adminApi
    .patch(`/api/plans/${planId}`)
    .send({ intern_id: internId })
    .expect(200)
})

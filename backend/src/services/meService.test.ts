import { test, before, after } from 'node:test'
import assert from 'node:assert'
import bcrypt from 'bcrypt'
import supertest from 'supertest'
import app from '../app'
import knex from '../../db'

const api = supertest.agent(app)
const adminApi = supertest.agent(app)

const USERNAME = 'me-test-intern'

let internId: number
let projectId: number
let taskId: number
let planId: number

async function cleanup() {
  const existing = await knex('users').where({ username: USERNAME }).first()
  if (existing) {
    // projects/plans don't cascade from the user, so clear them explicitly;
    // interns + join rows + submissions go via ON DELETE CASCADE.
    await knex('projects')
      .whereIn(
        'id',
        knex('project_interns')
          .select('project_id')
          .where('intern_id', existing.id)
      )
      .del()
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
      full_name: 'Me Test Intern',
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

  const [project] = await knex('projects')
    .insert({ name: 'Me Test Project' })
    .returning('*')
  projectId = project.id
  await knex('project_interns').insert({
    project_id: projectId,
    intern_id: internId,
  })

  const [task] = await knex('tasks')
    .insert({ project_id: projectId, title: 'Me Test Task' })
    .returning('*')
  taskId = task.id
  await knex('task_assignments').insert({
    task_id: taskId,
    intern_id: internId,
  })
  await knex('task_submissions').insert({
    task_id: taskId,
    intern_id: internId,
    note: 'first pass',
    file_url: null,
  })

  const [plan] = await knex('plans')
    .insert({ intern_id: internId, title: 'Me Test Plan' })
    .returning('*')
  planId = plan.id
  await knex('plan_milestones').insert({
    plan_id: planId,
    title: 'Milestone one',
  })

  await api
    .post('/api/auth/login')
    .send({ username: USERNAME, password: 'password' })
    .expect(200)
  await adminApi
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password' })
    .expect(200)
})

test('GET /api/me returns the caller’s own intern profile', async () => {
  const res = await api.get('/api/me').expect(200)
  assert.equal(res.body.profile.user_id, internId)
  assert.equal(res.body.profile.full_name, 'Me Test Intern')
  assert.equal(res.body.profile.intern_type, 'graduate')
})

test('GET /api/me/projects lists only the interns assigned projects', async () => {
  const res = await api.get('/api/me/projects').expect(200)
  assert.equal(res.body.projects.length, 1)
  assert.equal(res.body.projects[0].id, projectId)
})

test('GET /api/me/tasks returns a paginated list of assigned tasks', async () => {
  const res = await api.get('/api/me/tasks').expect(200)
  assert.equal(res.body.total, 1)
  assert.equal(res.body.data[0].id, taskId)
  assert.equal(res.body.page, 1)
})

test('GET /api/me/submissions returns the interns submissions', async () => {
  const res = await api.get('/api/me/submissions').expect(200)
  assert.equal(res.body.submissions.length, 1)
  assert.equal(res.body.submissions[0].note, 'first pass')
})

test('GET /api/me/plans returns plans with their milestones nested', async () => {
  const res = await api.get('/api/me/plans').expect(200)
  assert.equal(res.body.plans.length, 1)
  assert.equal(res.body.plans[0].id, planId)
  assert.equal(res.body.plans[0].milestones.length, 1)
  assert.equal(res.body.plans[0].milestones[0].title, 'Milestone one')
})

test('GET /api/me is forbidden for a non-intern role', async () => {
  await adminApi.get('/api/me').expect(403)
})

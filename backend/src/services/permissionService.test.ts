import { test, before, after } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app'
import knex from '../../db'

const api = supertest.agent(app)

after(() => knex.destroy())

before(async () => {
  await api
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password' })
    .expect(200)
})

test('admin gets all 15 seeded permissions by default', async () => {
  const response = await api.get('/api/auth/me').expect(200)

  assert.equal(response.body.permissions.length, 15)
  assert.ok(response.body.permissions.includes('manage_projects'))
})

test('a revoke override removes a permission the role would otherwise have', async () => {
  const admin = await knex('users').where({ username: 'admin' }).first()
  const permission = await knex('permissions')
    .where({ key: 'manage_projects' })
    .first()

  await knex('user_permission_overrides').insert({
    user_id: admin.id,
    permission_id: permission.id,
    effect: 'revoke',
  })

  try {
    const response = await api.get('/api/auth/me').expect(200)
    assert.ok(!response.body.permissions.includes('manage_projects'))
  } finally {
    await knex('user_permission_overrides')
      .where({ user_id: admin.id, permission_id: permission.id })
      .del()
  }
})

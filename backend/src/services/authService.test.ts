import { test, after } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app'
import knex from '../../db'

const api = supertest.agent(app)

after(() => knex.destroy())

test('login succeeds with the correct password', async () => {
  const response = await api
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password' })
    .expect(200)

  assert.equal(response.body.user.username, 'admin')
  assert.equal(response.body.user.roleName, 'admin')
  assert.ok(response.headers['set-cookie'])
})

test('login rejects with the wrong password', async () => {
  const response = await supertest(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'wrong-password' })
    .expect(401)

  assert.ok(response.body.error)
})

test('login rejects for a username that does not exist', async () => {
  await supertest(app)
    .post('/api/auth/login')
    .send({ username: 'does-not-exist', password: 'password' })
    .expect(401)
})

test('GET /api/auth/me works with a valid session, rejects a bad one', async () => {
  const me = await api.get('/api/auth/me').expect(200)
  assert.equal(me.body.user.username, 'admin')

  const badSession = supertest(app)
  await badSession
    .get('/api/auth/me')
    .set('Cookie', 'access_token=not-a-real-token')
    .expect(401)
})

test('POST /api/auth/refresh issues a new session from the refresh cookie', async () => {
  const response = await api.post('/api/auth/refresh').expect(200)
  assert.equal(response.body.user.username, 'admin')
})

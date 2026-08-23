import { test, after } from 'node:test'
import assert from 'node:assert'
import authService, { InvalidCredentialsError } from './authService'
import knex from '../db'

after(() => knex.destroy())

test('login succeeds with the correct password', async () => {
  const result = await authService.login('admin', 'password')

  assert.equal(result.user.username, 'admin')
  assert.equal(result.user.role_name, 'admin')
  assert.ok(result.accessToken)
  assert.ok(result.refreshToken)
})

test('login rejects with the wrong password', async () => {
  await assert.rejects(
    () => authService.login('admin', 'wrong-password'),
    InvalidCredentialsError
  )
})

test('login rejects for a username that does not exist', async () => {
  await assert.rejects(
    () => authService.login('does-not-exist', 'password'),
    InvalidCredentialsError
  )
})

test('verifyAccessToken accepts a token signed by login, rejects a made-up one', async () => {
  const { accessToken } = await authService.login('admin', 'password')

  const payload = authService.verifyAccessToken(accessToken)
  assert.equal(payload.username, 'admin')

  assert.throws(() => authService.verifyAccessToken('not-a-real-token'))
})

test('refreshAccessToken issues a new access token from a valid refresh token', async () => {
  const { refreshToken } = await authService.login('admin', 'password')

  const result = await authService.refreshAccessToken(refreshToken)
  assert.equal(result.user.username, 'admin')
  assert.ok(result.accessToken)
})

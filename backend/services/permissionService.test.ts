import { test, after } from 'node:test'
import assert from 'node:assert'
import knex from '../db'
import permissionService from './permissionService'

after(() => knex.destroy())

async function getAdmin() {
  const admin = await knex('users')
    .join('roles', 'roles.id', 'users.role_id')
    .where({ username: 'admin' })
    .select('users.id', 'users.role_id')
    .first()
  if (!admin) throw new Error('admin user not seeded — run seeds first')
  return admin
}

test('admin gets all 15 seeded permissions by default', async () => {
  const admin = await getAdmin()

  const permissions = await permissionService.resolveEffectivePermissions(
    admin.id,
    admin.role_id
  )

  assert.equal(permissions.length, 15)
  assert.ok(permissions.includes('manage_projects'))
})

test('a revoke override removes a permission the role would otherwise have', async () => {
  const admin = await getAdmin()
  const permission = await knex('permissions')
    .where({ key: 'manage_projects' })
    .first()

  await knex('user_permission_overrides').insert({
    user_id: admin.id,
    permission_id: permission.id,
    effect: 'revoke',
  })

  try {
    const permissions = await permissionService.resolveEffectivePermissions(
      admin.id,
      admin.role_id
    )
    assert.ok(!permissions.includes('manage_projects'))
  } finally {
    await knex('user_permission_overrides')
      .where({ user_id: admin.id, permission_id: permission.id })
      .del()
  }
})

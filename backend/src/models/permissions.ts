import knex from '../../db'

export interface PermissionOverride {
  key: string
  effect: 'grant' | 'revoke'
}

export interface Permission {
  id: number
  key: string
  description: string | null
}

function findAll(): Promise<Permission[]> {
  return knex('permissions').select('id', 'key', 'description').orderBy('key')
}

function findByKey(key: string): Promise<Permission | undefined> {
  return knex('permissions').where({ key }).first()
}

async function upsertOverride(
  userId: number,
  permissionId: number,
  effect: 'grant' | 'revoke',
  grantedBy: number
): Promise<void> {
  const existing = await knex('user_permission_overrides')
    .where({ user_id: userId, permission_id: permissionId })
    .first()

  if (existing) {
    await knex('user_permission_overrides')
      .where({ user_id: userId, permission_id: permissionId })
      .update({ effect, granted_by: grantedBy })
  } else {
    await knex('user_permission_overrides').insert({
      user_id: userId,
      permission_id: permissionId,
      effect,
      granted_by: grantedBy,
    })
  }
}

function deleteOverride(
  userId: number,
  permissionId: number
): Promise<number> {
  return knex('user_permission_overrides')
    .where({ user_id: userId, permission_id: permissionId })
    .del()
}

function getRoleDefaultKeys(roleId: number): Promise<string[]> {
  return knex('role_permissions')
    .join('permissions', 'permissions.id', 'role_permissions.permission_id')
    .where('role_permissions.role_id', roleId)
    .pluck('permissions.key')
}

function getUserOverrides(userId: number): Promise<PermissionOverride[]> {
  return knex('user_permission_overrides')
    .join(
      'permissions',
      'permissions.id',
      'user_permission_overrides.permission_id'
    )
    .where('user_permission_overrides.user_id', userId)
    .select('permissions.key', 'user_permission_overrides.effect')
}

export default {
  getRoleDefaultKeys,
  getUserOverrides,
  findAll,
  findByKey,
  upsertOverride,
  deleteOverride,
}

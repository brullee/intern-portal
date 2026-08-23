import knex from '../db'

export interface PermissionOverride {
  key: string
  effect: 'grant' | 'revoke'
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

export default { getRoleDefaultKeys, getUserOverrides }

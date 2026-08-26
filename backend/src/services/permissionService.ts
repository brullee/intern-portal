import permissionsModel from '../models/permissions'

// Effective permissions = role defaults, with per-user overrides applied on
// top ('grant' adds a key even if the role doesn't have it, 'revoke' removes
// one even if the role does).
export async function resolveEffectivePermissions(
  userId: number,
  roleId: number
): Promise<string[]> {
  const [defaults, overrides] = await Promise.all([
    permissionsModel.getRoleDefaultKeys(roleId),
    permissionsModel.getUserOverrides(userId),
  ])

  const effective = new Set(defaults)

  for (const { key, effect } of overrides) {
    if (effect === 'grant') {
      effective.add(key)
    } else {
      effective.delete(key)
    }
  }

  return Array.from(effective)
}

export async function userHasPermission(
  userId: number,
  roleId: number,
  key: string
): Promise<boolean> {
  const effective = await resolveEffectivePermissions(userId, roleId)
  return effective.includes(key)
}

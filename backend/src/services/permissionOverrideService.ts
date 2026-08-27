import permissionsModel from '../models/permissions'
import * as permissionService from './permissionService'
import { AppError } from '../errors/AppError'
import { ErrorCode } from '../errors/errorCodes'

export class UnknownPermissionKeyError extends AppError {
  constructor(key: string) {
    super(400, ErrorCode.VALIDATION_ERROR, `Unknown permission key: ${key}`)
  }
}

export interface PermissionState {
  key: string
  description: string | null
  effective: boolean
  override: 'grant' | 'revoke' | null
}

export async function getPermissionState(
  userId: number,
  roleId: number
): Promise<PermissionState[]> {
  const [allPermissions, effective, overrides] = await Promise.all([
    permissionsModel.findAll(),
    permissionService.resolveEffectivePermissions(userId, roleId),
    permissionsModel.getUserOverrides(userId),
  ])

  const effectiveSet = new Set(effective)
  const overrideMap = new Map(overrides.map((o) => [o.key, o.effect]))

  return allPermissions.map((p) => ({
    key: p.key,
    description: p.description,
    effective: effectiveSet.has(p.key),
    override: overrideMap.get(p.key) ?? null,
  }))
}

export interface OverrideInput {
  key: string
  effect: 'grant' | 'revoke' | null
}

export async function setOverrides(
  userId: number,
  inputs: OverrideInput[],
  grantedBy: number
): Promise<void> {
  for (const input of inputs) {
    const permission = await permissionsModel.findByKey(input.key)
    if (!permission) throw new UnknownPermissionKeyError(input.key)

    if (input.effect === null) {
      await permissionsModel.deleteOverride(userId, permission.id)
    } else {
      await permissionsModel.upsertOverride(
        userId,
        permission.id,
        input.effect,
        grantedBy
      )
    }
  }
}

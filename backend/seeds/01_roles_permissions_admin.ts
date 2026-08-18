import type { Knex } from 'knex'
import bcrypt from 'bcrypt'

const PERMISSIONS = [
  {
    key: 'view_interns',
    description: 'View intern profiles, projects, tasks, plans, and hours',
  },
  { key: 'view_projects', description: 'View projects and their details' },
  { key: 'view_tasks', description: 'View tasks and their details' },
  { key: 'view_plans', description: 'View intern plans and milestones' },
  { key: 'view_hours', description: 'View attendance and hours records' },
  { key: 'view_activity_log', description: 'View per-intern activity logs' },
  {
    key: 'manage_users',
    description:
      'Create, edit, and delete interns, doctors, mentors, and universities',
  },
  { key: 'manage_projects', description: 'Create, edit, and delete projects' },
  { key: 'manage_tasks', description: 'Create, edit, and delete tasks' },
  { key: 'approve_tasks', description: 'Approve or reject task submissions' },
  {
    key: 'manage_plans',
    description: 'Create, edit, and delete plans and milestones',
  },
  {
    key: 'manage_hours',
    description: 'Log hours manually and adjust auto-tracked hours',
  },
  {
    key: 'manage_permissions',
    description: 'Grant or revoke permissions for individual mentors',
  },
  { key: 'view_audit_log', description: 'View the full admin action log' },
  {
    key: 'export_reports',
    description: 'Export hours and progress reports as CSV/Excel',
  },
]

// Mentor's role-level default is read-only, per the spec — write/approve access
// is granted per-mentor later via user_permission_overrides, not here.
const MENTOR_DEFAULT_PERMISSIONS = [
  'view_interns',
  'view_projects',
  'view_tasks',
  'view_plans',
  'view_hours',
  'view_activity_log',
]

export async function seed(knex: Knex): Promise<void> {
  await knex('roles')
    .insert([
      { name: 'admin' },
      { name: 'mentor' },
      { name: 'doctor' },
      { name: 'intern' },
    ])
    .onConflict('name')
    .ignore()

  await knex('permissions').insert(PERMISSIONS).onConflict('key').ignore()

  const roles = await knex('roles').select('id', 'name')
  const roleIdByName = Object.fromEntries(roles.map((r) => [r.name, r.id]))

  const permissions = await knex('permissions').select('id', 'key')
  const permissionIdByKey = Object.fromEntries(
    permissions.map((p) => [p.key, p.id])
  )

  const adminRolePermissions = permissions.map((p) => ({
    role_id: roleIdByName.admin,
    permission_id: p.id,
  }))

  const mentorRolePermissions = MENTOR_DEFAULT_PERMISSIONS.map((key) => ({
    role_id: roleIdByName.mentor,
    permission_id: permissionIdByKey[key],
  }))

  // doctor and intern get no role_permissions rows — their access is scoped by
  // role + relation (university_id / own user_id), not the permission table.
  await knex('role_permissions')
    .insert([...adminRolePermissions, ...mentorRolePermissions])
    .onConflict(['role_id', 'permission_id'])
    .ignore()

  const passwordHash = await bcrypt.hash('changeme123', 10)

  await knex('users')
    .insert({
      full_name: 'Admin',
      username: 'admin',
      password_hash: passwordHash,
      role_id: roleIdByName.admin,
    })
    .onConflict('username')
    .ignore()
}

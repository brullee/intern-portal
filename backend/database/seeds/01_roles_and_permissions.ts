import type { Knex } from 'knex'

const PERMISSIONS = [
  {
    key: 'view_interns',
    description: 'View intern profiles, projects, tasks, plans, and hours',
    mentorDefault: true,
  },
  {
    key: 'view_projects',
    description: 'View projects and their details',
    mentorDefault: true,
  },
  {
    key: 'view_tasks',
    description: 'View tasks and their details',
    mentorDefault: true,
  },
  {
    key: 'view_plans',
    description: 'View intern plans and milestones',
    mentorDefault: true,
  },
  {
    key: 'view_hours',
    description: 'View attendance and hours records',
    mentorDefault: true,
  },
  {
    key: 'view_activity_log',
    description: 'View per-intern activity logs',
    mentorDefault: true,
  },
  {
    key: 'manage_users',
    description:
      'Create, edit, and delete interns, doctors, mentors, and universities',
    mentorDefault: false,
  },
  {
    key: 'manage_projects',
    description: 'Create, edit, and delete projects',
    mentorDefault: false,
  },
  {
    key: 'manage_tasks',
    description: 'Create, edit, and delete tasks',
    mentorDefault: false,
  },
  {
    key: 'approve_tasks',
    description: 'Approve or reject task submissions',
    mentorDefault: false,
  },
  {
    key: 'manage_plans',
    description: 'Create, edit, and delete plans and milestones',
    mentorDefault: false,
  },
  {
    key: 'manage_hours',
    description: 'Log hours manually and adjust auto-tracked hours',
    mentorDefault: false,
  },
  {
    key: 'manage_permissions',
    description: 'Grant or revoke permissions for individual mentors',
    mentorDefault: false,
  },
  {
    key: 'view_audit_log',
    description: 'View the full admin action log',
    mentorDefault: false,
  },
  {
    key: 'export_reports',
    description: 'Export hours and progress reports as CSV/Excel',
    mentorDefault: false,
  },
]

const MENTOR_DEFAULT_PERMISSIONS = PERMISSIONS.filter(
  (p) => p.mentorDefault
).map((p) => p.key)

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del()
  await knex('role_permissions').del()
  await knex('permissions').del()
  await knex('roles').del()

  await knex('roles').insert([
    { name: 'admin' },
    { name: 'mentor' },
    { name: 'doctor' },
    { name: 'intern' },
  ])

  await knex('permissions').insert(
    PERMISSIONS.map(({ key, description }) => ({ key, description }))
  )

  const roles = await knex('roles').select('id', 'name')
  const roleIdByName = Object.fromEntries(roles.map((r) => [r.name, r.id]))

  const permissions = await knex('permissions').select('id', 'key')

  const adminRolePermissions = permissions.map((p) => ({
    role_id: roleIdByName.admin,
    permission_id: p.id,
  }))

  const mentorRolePermissions = permissions
    .filter((p) => MENTOR_DEFAULT_PERMISSIONS.includes(p.key))
    .map((p) => ({
      role_id: roleIdByName.mentor,
      permission_id: p.id,
    }))

  // doctor and intern get no role_permissions rows — their access is scoped by
  // role + relation (university_id / own user_id), not the permission table.
  await knex('role_permissions').insert([
    ...adminRolePermissions,
    ...mentorRolePermissions,
  ])
}

import type { Knex } from 'knex'

const PERMISSIONS = [
  {
    key: 'manage_users',
    description: 'Create, edit, and delete user accounts',
  },
  {
    key: 'manage_universities',
    description: 'Create, edit, and delete universities',
  },
  { key: 'manage_projects', description: 'Create, edit, and delete projects' },
  { key: 'manage_tasks', description: 'Create, edit, and delete tasks' },
  {
    key: 'assign_interns',
    description:
      'Assign or reassign interns to projects, tasks, doctors, and mentors',
  },
  {
    key: 'approve_submissions',
    description: 'Approve or reject task submissions',
  },
  {
    key: 'manage_plans',
    description: 'Create, edit, and delete plans and milestones',
  },
  {
    key: 'edit_hours',
    description: 'Manually edit or correct attendance/hours records',
  },
  { key: 'view_audit_log', description: 'View the admin action audit log' },
  {
    key: 'manage_permissions',
    description: 'Grant or revoke permissions for other mentors',
  },
]

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

  await knex('role_permissions').insert(
    permissions.map((p) => ({
      role_id: roleIdByName.admin,
      permission_id: p.id,
    }))
  )
}

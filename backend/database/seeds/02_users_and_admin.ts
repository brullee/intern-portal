import type { Knex } from 'knex'
import bcrypt from 'bcrypt'

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del()

  const adminRole = await knex('roles').where({ name: 'admin' }).first()

  if (!adminRole) {
    throw new Error(
      'Admin role not found: run the roles/permissions seed first.'
    )
  }

  const password_hash = await bcrypt.hash('password', 10)

  await knex('users').insert({
    full_name: 'Admin',
    username: 'admin',
    password_hash,
    role_id: adminRole.id,
  })
}

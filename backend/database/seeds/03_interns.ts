import type { Knex } from 'knex'
import bcrypt from 'bcrypt'

// Graduate interns only, so they need no university/doctor link — that keeps
// the seed self-contained and satisfies the interns CHECK constraint
// (non-student rows must have university_id and doctor_id NULL).
const INTERNS = [
  {
    full_name: 'Lina Haddad',
    username: 'intern',
    major: 'Computer Science',
    cohort: '2026-spring',
    start_date: '2026-01-05',
    end_date: null,
    status: 'active',
  },
  {
    full_name: 'Omar Khalil',
    username: 'intern2',
    major: 'Software Engineering',
    cohort: '2026-spring',
    start_date: '2026-01-05',
    end_date: null,
    status: 'active',
  },
  {
    full_name: 'Sara Nassar',
    username: 'intern3',
    major: 'Data Science',
    cohort: '2025-fall',
    start_date: '2025-09-01',
    end_date: '2026-02-28',
    status: 'completed',
  },
] as const

export async function seed(knex: Knex): Promise<void> {
  const internRole = await knex('roles').where({ name: 'intern' }).first()
  if (!internRole) {
    throw new Error(
      'Intern role not found: run the roles/permissions seed first.'
    )
  }

  const usernames = INTERNS.map((i) => i.username)

  // Re-runnable: drop the users we own (interns rows cascade with them).
  await knex('users').whereIn('username', usernames).del()

  const password_hash = await bcrypt.hash('password', 10)

  for (const intern of INTERNS) {
    const [user] = await knex('users')
      .insert({
        full_name: intern.full_name,
        username: intern.username,
        email: `${intern.username}@example.com`,
        password_hash,
        role_id: internRole.id,
        is_active: true,
      })
      .returning('id')

    await knex('interns').insert({
      user_id: user.id,
      intern_type: 'graduate',
      major: intern.major,
      cohort: intern.cohort,
      start_date: intern.start_date,
      end_date: intern.end_date,
      status: intern.status,
    })
  }
}

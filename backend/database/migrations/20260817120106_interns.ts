import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('interns', (table) => {
    table
      .integer('user_id')
      .primary()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.integer('university_id').references('id').inTable('universities')
    table.integer('doctor_id').references('user_id').inTable('doctors')
    table.string('student_id', 50)
    table.string('major', 150)
    table
      .enum('intern_type', ['student', 'graduate', 'other'])
      .notNullable()
      .defaultTo('student')
    table.string('cohort', 50)
    table.date('start_date').notNullable()
    table.date('end_date')
    table
      .enum('status', [
        'applied',
        'active',
        'completed',
        'terminated',
        'on_leave',
      ])
      .notNullable()
      .defaultTo('applied')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.check(
      "intern_type = 'student' OR (university_id IS NULL AND doctor_id IS NULL)",
      [],
      'chk_interns_non_student_no_academic_link'
    )
    table.index('university_id', 'idx_interns_university_id')
    table.index('doctor_id', 'idx_interns_doctor_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('interns')
}

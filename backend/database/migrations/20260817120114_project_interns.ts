import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('project_interns', (table) => {
    // CREATE TABLE project_interns (
    //  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    //  intern_id INTEGER NOT NULL REFERENCES interns(user_id) ON DELETE CASCADE,
    //  assigned_at TIMESTAMP NOT NULL DEFAULT now
    table
      .integer('project_id')
      .notNullable()
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE')
    table
      .integer('intern_id')
      .notNullable()
      .references('user_id')
      .inTable('interns')
      .onDelete('CASCADE')
    table.timestamp('assigned_at').notNullable().defaultTo(knex.fn.now())
    table.primary(['project_id', 'intern_id'])
    table.index('intern_id', 'idx_project_interns_intern_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('project_interns')
}

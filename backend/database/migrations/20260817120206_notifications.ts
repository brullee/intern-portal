import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable('notifications', (table) => {
    table.increments('id')
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.string('type', 50).notNullable()
    table.jsonb('payload')
    table.boolean('is_read').notNullable().defaultTo(false)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index('user_id', 'idx_notifications_user_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable('notifications')
}

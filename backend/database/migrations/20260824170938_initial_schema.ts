import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return await knex.schema
    .createTable('roles', (table) => {
      table.increments('id')
      table.string('name', 30).notNullable().unique()
    })

    .createTable('permissions', (table) => {
      table.increments('id')
      table.string('key', 60).notNullable().unique()
      table.string('description', 255)
    })

    .createTable('role_permissions', (table) => {
      table
        .integer('role_id')
        .notNullable()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
      table
        .integer('permission_id')
        .notNullable()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')
      table.primary(['role_id', 'permission_id'])
    })

    .createTable('universities', (table) => {
      table.increments('id')
      table.string('name', 150).notNullable()
      table.string('country', 100)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    })

    .createTable('users', (table) => {
      table.increments('id')
      table.string('full_name', 150).notNullable()
      table.string('username', 50).notNullable().unique()
      table.string('email', 150).unique()
      table.string('password_hash', 255).notNullable()
      table.integer('role_id').notNullable().references('id').inTable('roles')
      table.string('phone', 30)
      table.string('avatar_url', 255)
      table.boolean('is_active').notNullable().defaultTo(true)
      table
        .integer('created_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.index('role_id', 'idx_users_role_id')
    })

    .createTable('user_permission_overrides', (table) => {
      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('permission_id')
        .notNullable()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')
      table.enum('effect', ['grant', 'revoke']).notNullable()
      table
        .integer('granted_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.primary(['user_id', 'permission_id'])
    })

    .createTable('doctors', (table) => {
      table
        .integer('user_id')
        .primary()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('university_id')
        .notNullable()
        .references('id')
        .inTable('universities')
      table.string('department', 150)
      table.string('title', 100)
      table.index('university_id', 'idx_doctors_university_id')
    })

    .createTable('interns', (table) => {
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

    .createTable('mentors', (table) => {
      table
        .integer('user_id')
        .primary()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('department', 150)
      table.string('title', 100)
    })

    .createTable('projects', (table) => {
      table.increments('id')
      table.string('name', 150).notNullable()
      table.text('description')
      table.date('start_date')
      table.date('end_date')
      table
        .enum('status', ['active', 'on_hold', 'completed', 'cancelled'])
        .notNullable()
        .defaultTo('active')
      table
        .integer('created_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    })

    .createTable('project_interns', (table) => {
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

    .createTable('tasks', (table) => {
      table.increments('id')
      table
        .integer('project_id')
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table.string('title', 200).notNullable()
      table.text('description')
      table.enum('priority', ['low', 'medium', 'high']).defaultTo('medium')
      table.date('due_date')
      table
        .enum('status', [
          'not_started',
          'in_progress',
          'submitted',
          'approved',
          'rejected',
        ])
        .notNullable()
        .defaultTo('not_started')
      table
        .integer('created_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
      table.index('project_id', 'idx_tasks_project_id')
    })

    .createTable('task_assignments', (table) => {
      table
        .integer('task_id')
        .notNullable()
        .references('id')
        .inTable('tasks')
        .onDelete('CASCADE')
      table
        .integer('intern_id')
        .notNullable()
        .references('user_id')
        .inTable('interns')
        .onDelete('CASCADE')
      table.timestamp('assigned_at').notNullable().defaultTo(knex.fn.now())
      table.primary(['task_id', 'intern_id'])
      table.index('intern_id', 'idx_task_assignments_intern_id')
    })

    .createTable('task_submissions', (table) => {
      table.increments('id')
      table
        .integer('task_id')
        .notNullable()
        .references('id')
        .inTable('tasks')
        .onDelete('CASCADE')
      table
        .integer('intern_id')
        .notNullable()
        .references('user_id')
        .inTable('interns')
      table.text('note')
      table.string('file_url', 255)
      table.timestamp('submitted_at').notNullable().defaultTo(knex.fn.now())
      table
        .integer('reviewed_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table
        .enum('review_status', ['pending', 'approved', 'rejected'])
        .defaultTo('pending')
      table.text('review_comment')
      table.timestamp('reviewed_at')
      table.index('task_id', 'idx_task_submissions_task_id')
    })

    .createTable('plans', (table) => {
      table.increments('id')
      table
        .integer('intern_id')
        .notNullable()
        .references('user_id')
        .inTable('interns')
        .onDelete('CASCADE')
      table.string('title', 150).notNullable()
      table.text('description')
      table.date('start_date')
      table.date('end_date')
      table
        .integer('created_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.string('document_url', 255)
      table.string('document_name', 255)
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.index('intern_id', 'idx_plans_intern_id')
    })

    .createTable('plan_milestones', (table) => {
      table.increments('id')
      table
        .integer('plan_id')
        .notNullable()
        .references('id')
        .inTable('plans')
        .onDelete('CASCADE')
      table.string('title', 200).notNullable()
      table.date('due_date')
      table
        .enum('status', ['not_started', 'in_progress', 'completed'])
        .notNullable()
        .defaultTo('not_started')
      table.integer('sort_order').defaultTo(0)
      table.index('plan_id', 'idx_plan_milestones_plan_id')
    })

    .createTable('attendance_sessions', (table) => {
      table.increments('id')
      table
        .integer('intern_id')
        .notNullable()
        .references('user_id')
        .inTable('interns')
        .onDelete('CASCADE')
      table.timestamp('clock_in').notNullable()
      table.timestamp('clock_out')
      table.boolean('auto_closed').notNullable().defaultTo(false)
      table.text('notes')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.index('intern_id', 'idx_attendance_sessions_intern_id')
    })

    .createTable('activity_logs', (table) => {
      table.increments('id')
      table
        .integer('intern_id')
        .references('user_id')
        .inTable('interns')
        .onDelete('CASCADE')
      table
        .integer('actor_id')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.string('action_type', 50).notNullable()
      table.string('entity_type', 50)
      table.integer('entity_id')
      table.jsonb('details')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.index('intern_id', 'idx_activity_logs_intern_id')
      table.index('created_at', 'idx_activity_logs_created_at')
    })

    .createTable('leave_requests', (table) => {
      table.increments('id')
      table
        .integer('intern_id')
        .notNullable()
        .references('user_id')
        .inTable('interns')
        .onDelete('CASCADE')
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.text('reason')
      table
        .enum('status', ['pending', 'approved', 'rejected'])
        .notNullable()
        .defaultTo('pending')
      table
        .integer('reviewed_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    })

    .createTable('conversations', (table) => {
      table.increments('id')
      table.enum('type', ['direct', 'group']).notNullable().defaultTo('direct')
      table.string('name', 100)
      table.integer('created_by').references('id').inTable('users')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    })

    .createTable('conversation_participants', (table) => {
      table
        .integer('conversation_id')
        .notNullable()
        .references('id')
        .inTable('conversations')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamp('joined_at').notNullable().defaultTo(knex.fn.now())
      table.primary(['conversation_id', 'user_id'])
      table.boolean('is_admin').notNullable().defaultTo(false)
      table.timestamp('hidden_at')
      table.index('user_id', 'idx_conversation_participants_uid')
    })

    .createTable('messages', (table) => {
      table.increments('id')
      table
        .integer('conversation_id')
        .notNullable()
        .references('id')
        .inTable('conversations')
        .onDelete('CASCADE')
      table.integer('sender_id').notNullable().references('id').inTable('users')
      table.text('body')
      table.string('attachment_url', 255)
      table.timestamp('sent_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('deleted_at')
      table.index('conversation_id', 'idx_messages_conversation_id')
    })

    .createTable('message_reads', (table) => {
      table
        .integer('message_id')
        .notNullable()
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamp('read_at').notNullable().defaultTo(knex.fn.now())
      table.primary(['message_id', 'user_id'])
    })

    .createTable('notifications', (table) => {
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

    .createTable('audit_logs', (table) => {
      table.increments('id')
      table
        .integer('actor_id')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.string('action', 50).notNullable()
      table.string('entity_type', 50).notNullable()
      table.integer('entity_id')
      table.jsonb('diff')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.index('created_at', 'idx_audit_logs_created_at')
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('audit_logs')
    .dropTableIfExists('notifications')
    .dropTableIfExists('message_reads')
    .dropTableIfExists('messages')
    .dropTableIfExists('conversation_participants')
    .dropTableIfExists('conversations')
    .dropTableIfExists('leave_requests')
    .dropTableIfExists('activity_logs')
    .dropTableIfExists('attendance_sessions')
    .dropTableIfExists('plan_milestones')
    .dropTableIfExists('plans')
    .dropTableIfExists('task_submissions')
    .dropTableIfExists('task_assignments')
    .dropTableIfExists('tasks')
    .dropTableIfExists('project_interns')
    .dropTableIfExists('projects')
    .dropTableIfExists('mentors')
    .dropTableIfExists('interns')
    .dropTableIfExists('doctors')
    .dropTableIfExists('user_permission_overrides')
    .dropTableIfExists('users')
    .dropTableIfExists('universities')
    .dropTableIfExists('role_permissions')
    .dropTableIfExists('permissions')
    .dropTableIfExists('roles')
}

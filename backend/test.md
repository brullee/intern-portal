This file is a merged representation of the entire codebase, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
database/
  migrations/
    20260824170938_initial_schema.ts
  seeds/
    01_roles_and_permissions.ts
    02_users_and_admin.ts
    03_interns.ts
src/
  config/
    s3.ts
  controllers/
    attendanceController.ts
    authController.ts
    chatController.ts
    doctorController.ts
    doctorScopeController.ts
    internController.ts
    logsController.ts
    meController.ts
    mentorController.ts
    notificationController.ts
    planController.ts
    projectController.ts
    taskController.ts
    taskSubmissionController.ts
    universityController.ts
    userController.ts
  errors/
    AppError.ts
    assignmentErrors.ts
    attendanceErrors.ts
    chatErrors.ts
    doctorScopeErrors.ts
    errorCodes.ts
    planErrors.ts
    submissionErrors.ts
  middleware/
    authMiddleware.ts
    errorHandler.ts
    permissionMiddleware.ts
    rateLimiter.ts
    roleMiddleware.ts
    upload.ts
    validate.ts
  models/
    activityLogs.ts
    attendanceSessions.ts
    auditLogs.ts
    conversations.ts
    doctors.ts
    interns.ts
    mentors.ts
    messages.ts
    notifications.ts
    permissions.ts
    planMilestones.ts
    plans.ts
    projectInterns.ts
    projects.ts
    taskAssignments.ts
    tasks.ts
    taskSubmissions.ts
    universities.ts
    users.ts
  routes/
    attendanceRoutes.ts
    authRoutes.ts
    chatRoutes.ts
    doctorPortalRoutes.ts
    doctorRoutes.ts
    internRoutes.ts
    logsRoutes.ts
    mentorRoutes.ts
    meRoutes.ts
    notificationRoutes.ts
    planRoutes.ts
    projectRoutes.ts
    taskRoutes.ts
    taskSubmissionRoutes.ts
    universityRoutes.ts
    userRoutes.ts
  schemas/
    attendanceSchemas.ts
    chatSchemas.ts
    doctorSchemas.ts
    doctorScopeSchemas.ts
    internSchemas.ts
    logsSchemas.ts
    mentorSchemas.ts
    notificationSchemas.ts
    planSchemas.ts
    projectSchemas.ts
    taskSchemas.ts
    taskSubmissionSchemas.ts
    universitySchemas.ts
  services/
    attendanceService.ts
    auditService.ts
    authService.test.ts
    authService.ts
    chatService.ts
    doctorScopeService.ts
    doctorService.ts
    internService.ts
    logsService.ts
    mentorService.ts
    meService.test.ts
    meService.ts
    notificationService.ts
    permissionOverrideService.ts
    permissionService.test.ts
    permissionService.ts
    planService.ts
    projectService.ts
    storageService.ts
    taskService.ts
    taskSubmissionService.ts
    universityService.ts
    userService.ts
  socket/
    io.ts
  types/
    express.d.ts
  utils/
    config.ts
    cookies.ts
    filenames.ts
    pagination.ts
  app.ts
  server.ts
.env.example
.gitignore
db.ts
eslint.config.mjs
knexfile.ts
package.json
tsconfig.json
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="database/migrations/20260824170938_initial_schema.ts">
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

   .createTable('attendance', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.date('date').notNullable();
    table.timestamp('first_seen_at').nullable();
    table.timestamp('last_active_at').nullable();
    table.integer('active_minutes').defaultTo(0); 
    table.enum('status', ['PRESENT', 'ABSENT', 'PENDING']).defaultTo('PENDING');
    table.string('absence_reason').nullable();
    table.timestamps(true, true);

    table.unique(['user_id', 'date']);
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
    .dropTableIfExists('attendance')
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
</file>

<file path="database/seeds/01_roles_and_permissions.ts">
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
</file>

<file path="database/seeds/02_users_and_admin.ts">
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
    is_active: true,
  })
}
</file>

<file path="database/seeds/03_interns.ts">
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
</file>

<file path="src/config/s3.ts">
import dotenv from 'dotenv';
import {S3Client} from '@aws-sdk/client-s3'
dotenv.config()
const endpoint= process.env.IDRIVE_E2_ENDPOINT
const  region = process.env.IDRIVE_E2_REGION
const key_id =  process.env.IDRIVE_E2_KEY_ID
const SecretAccessKey = process.env.IDRIVE_E2_SECRET_ACCESS_KEY
const key_id_second = process.env.IDRIVE_E2_KEY_ID_SECOND 
const  SecretAccessKey_second = process.env.IDRIVE_E2_SECRET_ACCESS_KEY_SECOND

export const s3Client_First = new S3Client({
endpoint,
region,
key_id,
SecretAccessKey
}as any);

export const s3Client_Second = new S3Client({
endpoint,
region,
key_id_second,
SecretAccessKey_second
}as any);
</file>

<file path="src/controllers/attendanceController.ts">
// controllers/attendanceController.ts
import { Request, Response, NextFunction } from 'express';
import { findTodayRecord , recordActivity , listAttendanceSessions} from '../models/attendanceSessions';
import { UserWithRole } from '../models/users';
export const sendHeartbeat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as unknown as UserWithRole).id;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const startWindow = 9 * 60 + 30; 
    const endWindow = 17 * 60;        
    
    
    if (currentTimeInMinutes < startWindow || currentTimeInMinutes > endWindow) {
      return res.status(200).json({ message: 'خارج نطاق فترة التقييم (9:30 - 5:00)' });
    }

    
    await recordActivity(String(userId), todayStr, now);

    return res.status(200).json({ status: 'ok', timestamp: now });
  } catch (error) {
    next(error);
  }
};
</file>

<file path="src/controllers/authController.ts">
import type { Request, Response } from 'express'
import authService, {
  InvalidCredentialsError,
  AccountInactiveError,
} from '../services/authService'
import * as permissionService from '../services/permissionService'
import {
  setAuthCookies,
  setAccessCookie,
  clearAuthCookies,
} from '../utils/cookies'
import type { UserWithRole } from '../models/users'

function toPublicUser(user: UserWithRole) {
  return {
    id: user.id,
    fullName: user.full_name,
    username: user.username,
    roleId: user.role_id,
    roleName: user.role_name,
  }
}

async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body ?? {}

  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Username and password are required' })
    return
  }

  try {
    const { accessToken, refreshToken, user } = await authService.login(
      username,
      password
    )
    setAuthCookies(res, accessToken, refreshToken)
    res.json({ user: toPublicUser(user) })
  } catch (err) {
    if (
      err instanceof InvalidCredentialsError ||
      err instanceof AccountInactiveError
    ) {
      res.status(401).json({ error: 'Invalid username or password' })
      return
    }
    throw err
  }
}

async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refresh_token
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  try {
    const { accessToken, user } = await authService.refreshAccessToken(token)
    setAccessCookie(res, accessToken)
    res.json({ user: toPublicUser(user) })
  } catch {
    clearAuthCookies(res)
    res.status(401).json({ error: 'Session expired, please log in again' })
  }
}

function logout(_req: Request, res: Response): void {
  clearAuthCookies(res)
  res.status(204).send()
}

async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  const permissions = await permissionService.resolveEffectivePermissions(
    req.user.id,
    req.user.roleId
  )
  res.json({ user: req.user, permissions })
}

export default { login, refresh, logout, me }
</file>

<file path="src/controllers/chatController.ts">
export default {}
</file>

<file path="src/controllers/doctorController.ts">
import type { Request, Response } from 'express'
import doctorService, {
  ValidationError,
  DuplicateUsernameError,
} from '../services/doctorService'

async function list(req: Request, res: Response): Promise<void> {
  const doctors = await doctorService.listDoctors()
  res.json({ doctors })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const doctor = await doctorService.getDoctor(userId)
  if (!doctor) {
    res.status(404).json({ error: 'Doctor not found' })
    return
  }
  res.json({ doctor })
}

async function create(req: Request, res: Response): Promise<void> {
  try {
    const doctor = await doctorService.createDoctor(req.body ?? {})
    res.status(201).json({ doctor })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    if (err instanceof DuplicateUsernameError) {
      res.status(409).json({ error: 'Username is already taken' })
      return
    }
    throw err
  }
}

async function update(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const updatedCount = await doctorService.updateDoctor(
    userId,
    req.body ?? {}
  )
  if (updatedCount === 0) {
    res.status(404).json({ error: 'Doctor not found' })
    return
  }
  const doctor = await doctorService.getDoctor(userId)
  res.json({ doctor })
}

async function deactivate(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const deactivated = await doctorService.deactivateDoctor(userId)
  if (!deactivated) {
    res.status(404).json({ error: 'Doctor not found' })
    return
  }
  res.status(204).send()
}

export default { list, getOne, create, update, deactivate }
</file>

<file path="src/controllers/doctorScopeController.ts">
import { Request, Response } from 'express'
import * as doctorScopeService from '../services/doctorScopeService'
import { parsePagination } from '../utils/pagination'

export async function listInterns(req: Request, res: Response) {
  const pagination = parsePagination(req)
  const result = await doctorScopeService.listInterns(req.user!.id, pagination)
  return res.json(result)
}

export async function getInternProfile(req: Request, res: Response) {
  const id = Number(req.params.id)
  const intern = await doctorScopeService.getInternProfile(req.user!.id, id)
  return res.json({ intern })
}

export async function listInternTasks(req: Request, res: Response) {
  const id = Number(req.params.id)
  const pagination = parsePagination(req)
  const result = await doctorScopeService.listInternTasks(
    req.user!.id,
    id,
    pagination
  )
  return res.json(result)
}

export async function listInternPlans(req: Request, res: Response) {
  const id = Number(req.params.id)
  const pagination = parsePagination(req)
  const result = await doctorScopeService.listInternPlans(
    req.user!.id,
    id,
    pagination
  )
  return res.json(result)
}

export async function listInternAttendance(req: Request, res: Response) {
  const id = Number(req.params.id)
  const pagination = parsePagination(req)
  const result = await doctorScopeService.listInternAttendance(
    req.user!.id,
    id,
    pagination
  )
  return res.json(result)
}
</file>

<file path="src/controllers/internController.ts">
import type { Request, Response } from 'express'
import internService, {
  ValidationError,
  DuplicateUsernameError,
} from '../services/internService'

async function list(req: Request, res: Response): Promise<void> {
  const interns = await internService.listInterns()
  res.json({ interns })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const intern = await internService.getIntern(userId)
  if (!intern) {
    res.status(404).json({ error: 'Intern not found' })
    return
  }
  res.json({ intern })
}

async function create(req: Request, res: Response): Promise<void> {
  try {
    const intern = await internService.createIntern(req.body ?? {})
    res.status(201).json({ intern })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    if (err instanceof DuplicateUsernameError) {
      res.status(409).json({ error: 'Username is already taken' })
      return
    }
    throw err
  }
}

async function update(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  try {
    const intern = await internService.updateIntern(userId, req.body ?? {})
    if (!intern) {
      res.status(404).json({ error: 'Intern not found' })
      return
    }
    res.json({ intern })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function deactivate(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const deactivated = await internService.deactivateIntern(userId)
  if (!deactivated) {
    res.status(404).json({ error: 'Intern not found' })
    return
  }
  res.status(204).send()
}

async function updateAssignment(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  try {
    const intern = await internService.updateAssignment(
      userId,
      req.body ?? {}
    )
    if (!intern) {
      res.status(404).json({ error: 'Intern not found' })
      return
    }
    res.json({ intern })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

export default { list, getOne, create, update, deactivate, updateAssignment }
</file>

<file path="src/controllers/logsController.ts">
export default {}
</file>

<file path="src/controllers/meController.ts">
import type { Request, Response } from 'express'
import meService from '../services/meService'
import { parsePagination } from '../utils/pagination'

async function getProfile(req: Request, res: Response): Promise<void> {
  const profile = await meService.getProfile(req.user!.id)
  if (!profile) {
    res.status(404).json({ error: 'Intern profile not found' })
    return
  }
  res.json({ profile })
}

async function listProjects(req: Request, res: Response): Promise<void> {
  const projects = await meService.listProjects(req.user!.id)
  res.json({ projects })
}

async function listTasks(req: Request, res: Response): Promise<void> {
  const result = await meService.listTasks(req.user!.id, parsePagination(req))
  res.json(result)
}

async function listSubmissions(req: Request, res: Response): Promise<void> {
  const submissions = await meService.listSubmissions(req.user!.id)
  res.json({ submissions })
}

async function listPlans(req: Request, res: Response): Promise<void> {
  const plans = await meService.listPlans(req.user!.id)
  res.json({ plans })
}

export default {
  getProfile,
  listProjects,
  listTasks,
  listSubmissions,
  listPlans,
}
</file>

<file path="src/controllers/mentorController.ts">
import type { Request, Response } from 'express'
import mentorService, {
  ValidationError,
  DuplicateUsernameError,
} from '../services/mentorService'
import usersModel from '../models/users'
import * as permissionOverrideService from '../services/permissionOverrideService'

async function list(req: Request, res: Response): Promise<void> {
  const mentors = await mentorService.listMentors()
  res.json({ mentors })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const mentor = await mentorService.getMentor(userId)
  if (!mentor) {
    res.status(404).json({ error: 'Mentor not found' })
    return
  }
  res.json({ mentor })
}

async function create(req: Request, res: Response): Promise<void> {
  try {
    const mentor = await mentorService.createMentor(req.body ?? {})
    res.status(201).json({ mentor })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    if (err instanceof DuplicateUsernameError) {
      res.status(409).json({ error: 'Username is already taken' })
      return
    }
    throw err
  }
}

async function update(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const updatedCount = await mentorService.updateMentor(userId, req.body ?? {})
  if (updatedCount === 0) {
    res.status(404).json({ error: 'Mentor not found' })
    return
  }
  const mentor = await mentorService.getMentor(userId)
  res.json({ mentor })
}

async function deactivate(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const deactivated = await mentorService.deactivateMentor(userId)
  if (!deactivated) {
    res.status(404).json({ error: 'Mentor not found' })
    return
  }
  res.status(204).send()
}

async function getPermissions(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.userId)
  const user = await usersModel.findById(userId)
  if (!user) {
    res.status(404).json({ error: 'Mentor not found' })
    return
  }
  const permissions = await permissionOverrideService.getPermissionState(
    userId,
    user.role_id
  )
  res.json({ permissions })
}

async function updatePermissions(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  const userId = Number(req.params.userId)
  const user = await usersModel.findById(userId)
  if (!user) {
    res.status(404).json({ error: 'Mentor not found' })
    return
  }

  const { overrides } = req.body ?? {}
  if (!Array.isArray(overrides)) {
    res.status(400).json({ error: 'overrides must be an array' })
    return
  }

  await permissionOverrideService.setOverrides(
    userId,
    overrides,
    req.user.id
  )
  const permissions = await permissionOverrideService.getPermissionState(
    userId,
    user.role_id
  )
  res.json({ permissions })
}

export default {
  list,
  getOne,
  create,
  update,
  deactivate,
  getPermissions,
  updatePermissions,
}
</file>

<file path="src/controllers/notificationController.ts">
export default {}
</file>

<file path="src/controllers/planController.ts">
import type { Request, Response } from 'express'
import planService, { ValidationError } from '../services/planService'

async function list(req: Request, res: Response): Promise<void> {
  const internId = req.query.intern_id ? Number(req.query.intern_id) : undefined
  const plans = await planService.listPlans(internId)
  res.json({ plans })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const plan = await planService.getPlan(id)
  if (!plan) {
    res.status(404).json({ error: 'Plan not found' })
    return
  }
  res.json({ plan })
}

async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  try {
    const plan = await planService.createPlan(req.body ?? {}, req.user.id)
    res.status(201).json({ plan })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  try {
    const plan = await planService.updatePlan(id, req.body ?? {})
    if (!plan) {
      res.status(404).json({ error: 'Plan not found' })
      return
    }
    res.json({ plan })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const deleted = await planService.deletePlan(id)
  if (!deleted) {
    res.status(404).json({ error: 'Plan not found' })
    return
  }
  res.status(204).send()
}

async function listMilestones(req: Request, res: Response): Promise<void> {
  const planId = Number(req.params.id)
  const milestones = await planService.listMilestones(planId)
  res.json({ milestones })
}

async function createMilestone(req: Request, res: Response): Promise<void> {
  const planId = Number(req.params.id)
  try {
    const milestone = await planService.createMilestone(
      planId,
      req.body ?? {}
    )
    res.status(201).json({ milestone })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function updateMilestone(req: Request, res: Response): Promise<void> {
  const milestoneId = Number(req.params.milestoneId)
  try {
    const milestone = await planService.updateMilestone(
      milestoneId,
      req.body ?? {}
    )
    if (!milestone) {
      res.status(404).json({ error: 'Milestone not found' })
      return
    }
    res.json({ milestone })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function removeMilestone(req: Request, res: Response): Promise<void> {
  const milestoneId = Number(req.params.milestoneId)
  const deleted = await planService.deleteMilestone(milestoneId)
  if (!deleted) {
    res.status(404).json({ error: 'Milestone not found' })
    return
  }
  res.status(204).send()
}

export default {
  list,
  getOne,
  create,
  update,
  remove,
  listMilestones,
  createMilestone,
  updateMilestone,
  removeMilestone,
}
</file>

<file path="src/controllers/projectController.ts">
import type { Request, Response } from 'express'
import projectService, {
  ValidationError,
  DuplicateAssignmentError,
  InvalidReferenceError,
} from '../services/projectService'

async function list(req: Request, res: Response): Promise<void> {
  const projects = await projectService.listProjects()
  res.json({ projects })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const project = await projectService.getProject(id)
  if (!project) {
    res.status(404).json({ error: 'Project not found' })
    return
  }
  res.json({ project })
}

async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  try {
    const project = await projectService.createProject(
      req.body ?? {},
      req.user.id
    )
    res.status(201).json({ project })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  try {
    const project = await projectService.updateProject(id, req.body ?? {})
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }
    res.json({ project })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const deleted = await projectService.deleteProject(id)
  if (!deleted) {
    res.status(404).json({ error: 'Project not found' })
    return
  }
  res.status(204).send()
}

async function listInterns(req: Request, res: Response): Promise<void> {
  const projectId = Number(req.params.id)
  res.json({ interns: await projectService.listInterns(projectId) })
}

async function assignIntern(req: Request, res: Response): Promise<void> {
  const projectId = Number(req.params.id)
  const { intern_id } = req.body ?? {}
  if (!intern_id) {
    res.status(400).json({ error: 'intern_id is required' })
    return
  }

  try {
    const assignment = await projectService.assignIntern(
      projectId,
      Number(intern_id)
    )
    res.status(201).json({ assignment })
  } catch (err) {
    if (err instanceof DuplicateAssignmentError) {
      res
        .status(409)
        .json({ error: 'Intern is already assigned to this project' })
      return
    }
    if (err instanceof InvalidReferenceError) {
      res.status(400).json({ error: 'project_id or intern_id does not exist' })
      return
    }
    throw err
  }
}

async function removeIntern(req: Request, res: Response): Promise<void> {
  const projectId = Number(req.params.id)
  const internId = Number(req.params.internId)

  const deleted = await projectService.removeIntern(projectId, internId)
  if (!deleted) {
    res.status(404).json({ error: 'Assignment not found' })
    return
  }
  res.status(204).send()
}

export default {
  list,
  getOne,
  create,
  update,
  remove,
  listInterns,
  assignIntern,
  removeIntern,
}
</file>

<file path="src/controllers/taskController.ts">
import type { Request, Response } from 'express'
import taskService, {
  ValidationError,
  DuplicateAssignmentError,
  InvalidReferenceError,
} from '../services/taskService'

async function list(req: Request, res: Response): Promise<void> {
  const tasks = await taskService.listTasks()
  res.json({ tasks })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const task = await taskService.getTask(id)
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.json({ task })
}

async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  try {
    const task = await taskService.createTask(req.body ?? {}, req.user.id)
    res.status(201).json({ task })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  try {
    const task = await taskService.updateTask(id, req.body ?? {})
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    res.json({ task })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const deleted = await taskService.deleteTask(id)
  if (!deleted) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.status(204).send()
}

async function listAssignments(req: Request, res: Response): Promise<void> {
  const taskId = Number(req.params.id)
  res.json({ interns: await taskService.listAssignments(taskId) })
}

async function assignIntern(req: Request, res: Response): Promise<void> {
  const taskId = Number(req.params.id)
  const { intern_id } = req.body ?? {}
  if (!intern_id) {
    res.status(400).json({ error: 'intern_id is required' })
    return
  }

  try {
    const assignment = await taskService.assignIntern(
      taskId,
      Number(intern_id)
    )
    res.status(201).json({ assignment })
  } catch (err) {
    if (err instanceof DuplicateAssignmentError) {
      res.status(409).json({ error: 'Intern is already assigned to this task' })
      return
    }
    if (err instanceof InvalidReferenceError) {
      res.status(400).json({ error: 'task_id or intern_id does not exist' })
      return
    }
    throw err
  }
}

async function removeIntern(req: Request, res: Response): Promise<void> {
  const taskId = Number(req.params.id)
  const internId = Number(req.params.internId)

  const deleted = await taskService.removeIntern(taskId, internId)
  if (!deleted) {
    res.status(404).json({ error: 'Assignment not found' })
    return
  }
  res.status(204).send()
}

export default {
  list,
  getOne,
  create,
  update,
  remove,
  listAssignments,
  assignIntern,
  removeIntern,
}
</file>

<file path="src/controllers/taskSubmissionController.ts">
import type { Request, Response } from 'express'
import taskSubmissionService, {
  ValidationError,
  InvalidReviewStateError,
} from '../services/taskSubmissionService'

async function listByTask(req: Request, res: Response): Promise<void> {
  const taskId = Number(req.query.task_id)
  if (!taskId) {
    res.status(400).json({ error: 'task_id query param is required' })
    return
  }
  const submissions = await taskSubmissionService.listByTask(taskId)
  res.json({ submissions })
}

async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const submission = await taskSubmissionService.getSubmission(id)
  if (!submission) {
    res.status(404).json({ error: 'Submission not found' })
    return
  }
  res.json({ submission })
}

// Submits on behalf of the logged-in user — intern_id always comes from the
// session, never the request body, so an intern can only submit as themself.
async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  const files = (req.files as Express.Multer.File[] | undefined) ?? []
  try {
    const submission = await taskSubmissionService.createSubmission(
      {
        task_id: Number(req.body?.task_id),
        note: req.body?.note,
        files,
      },
      req.user.id
    )
    res.status(201).json({ submission })
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message })
      return
    }
    throw err
  }
}

async function review(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }
  const id = Number(req.params.id)
  const { status, comment } = req.body ?? {}
  if (status !== 'approved' && status !== 'rejected') {
    res.status(400).json({ error: 'status must be "approved" or "rejected"' })
    return
  }
  try {
    const submission = await taskSubmissionService.reviewSubmission(
      id,
      status,
      comment,
      req.user.id
    )
    if (!submission) {
      res.status(404).json({ error: 'Submission not found' })
      return
    }
    res.json({ submission })
  } catch (err) {
    if (err instanceof InvalidReviewStateError) {
      res.status(409).json({ error: err.message })
      return
    }
    throw err
  }
}

export default { listByTask, getOne, create, review }
</file>

<file path="src/controllers/universityController.ts">
import type { Request, Response } from 'express'
import universityService from '../services/universityService'
import { parsePagination } from '../utils/pagination'
import type {
  CreateUniversityBody,
  UpdateUniversityBody,
  ListUniversitiesQuery,
} from '../schemas/universitySchemas'

async function list(req: Request, res: Response): Promise<void> {
  const pagination = parsePagination(req)
  const { includeInactive } = req.validatedQuery as ListUniversitiesQuery
  const result = await universityService.listUniversities(pagination, {
    includeInactive,
  })
  res.json(result)
}

async function getOne(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const university = await universityService.getUniversity(id)
  if (!university) {
    res.status(404).json({ error: 'University not found' })
    return
  }
  res.json({ university })
}

async function create(req: Request, res: Response): Promise<void> {
  const body = req.body as CreateUniversityBody
  const university = await universityService.createUniversity(body)
  res.status(201).json({ university })
}

async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const body = req.body as UpdateUniversityBody
  const university = await universityService.updateUniversity(id, body)
  if (!university) {
    res.status(404).json({ error: 'University not found' })
    return
  }
  res.json({ university })
}

async function deactivate(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)
  const deactivated = await universityService.deactivateUniversity(id)
  if (!deactivated) {
    res.status(404).json({ error: 'University not found' })
    return
  }
  res.status(204).send()
}

export default { list, getOne, create, update, deactivate }
</file>

<file path="src/controllers/userController.ts">
export default {}
</file>

<file path="src/errors/AppError.ts">
import { ErrorCode } from './errorCodes'

export class AppError extends Error {
  statusCode: number
  code: string

  constructor(statusCode: number, code: string, message: string) {
    super(message)
    this.name = new.target.name
    this.statusCode = statusCode
    this.code = code
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, ErrorCode.VALIDATION_ERROR, message)
  }
}
</file>

<file path="src/errors/assignmentErrors.ts">
import { AppError } from './AppError'
import { ErrorCode } from './errorCodes'

export class InternNotOnProjectError extends AppError {
  constructor() {
    super(
      400,
      ErrorCode.INTERN_NOT_ON_PROJECT,
      "Intern must be assigned to the task's project first"
    )
  }
}
</file>

<file path="src/errors/attendanceErrors.ts">
export {}
</file>

<file path="src/errors/chatErrors.ts">
export {}
</file>

<file path="src/errors/doctorScopeErrors.ts">
import { AppError } from './AppError'
import { ErrorCode } from './errorCodes'

export class InternNotInScopeError extends AppError {
  constructor() {
    super(403, ErrorCode.INTERN_NOT_IN_SCOPE, 'This intern is not in your scope')
  }
}
</file>

<file path="src/errors/errorCodes.ts">
export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
  INVALID_SESSION: 'INVALID_SESSION',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INTERN_NOT_IN_SCOPE: 'INTERN_NOT_IN_SCOPE',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  TASK_NOT_ASSIGNED: 'TASK_NOT_ASSIGNED',
  SUBMISSION_NOT_ALLOWED: 'SUBMISSION_NOT_ALLOWED',
  INTERN_NOT_ON_PROJECT: 'INTERN_NOT_ON_PROJECT',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
} as const
</file>

<file path="src/errors/planErrors.ts">
export {}
</file>

<file path="src/errors/submissionErrors.ts">
import { AppError } from './AppError'
import { ErrorCode } from './errorCodes'

export class TaskNotAssignedError extends AppError {
  constructor() {
    super(
      403,
      ErrorCode.TASK_NOT_ASSIGNED,
      'You are not assigned to this task'
    )
  }
}

export class SubmissionNotAllowedError extends AppError {
  constructor() {
    super(
      400,
      ErrorCode.SUBMISSION_NOT_ALLOWED,
      'A pending or approved submission already exists for this task'
    )
  }
}

export class InvalidFileTypeError extends AppError {
  constructor(mimetype: string) {
    super(
      400,
      ErrorCode.INVALID_FILE_TYPE,
      `File type "${mimetype}" is not allowed`
    )
  }
}
</file>

<file path="src/middleware/authMiddleware.ts">
import type { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.access_token
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  try {
    const payload = authService.verifyAccessToken(token)
    req.user = {
      id: payload.sub,
      username: payload.username,
      roleId: payload.roleId,
      roleName: payload.roleName,
    }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' })
  }
}


export { requireAuth }
</file>

<file path="src/middleware/errorHandler.ts">
import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { MulterError } from 'multer'
import { AppError } from '../errors/AppError'
import { ErrorCode } from '../errors/errorCodes'

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ error: err.message, code: err.code })
  }
  if (err instanceof MulterError) {
    return res.status(400).json({
      error: err.message,
      code: ErrorCode.FILE_UPLOAD_ERROR,
    })
  }
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      code: ErrorCode.VALIDATION_ERROR,
      details: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    })
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
</file>

<file path="src/middleware/permissionMiddleware.ts">
import type { Request, Response, NextFunction } from 'express'
import * as permissionService from '../services/permissionService'

function requirePermission(key: string) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const permissions = await permissionService.resolveEffectivePermissions(
      req.user.id,
      req.user.roleId
    )

    if (!permissions.includes(key)) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    next()
  }
}

export { requirePermission }
</file>

<file path="src/middleware/rateLimiter.ts">
export default {}
</file>

<file path="src/middleware/roleMiddleware.ts">
import { Request, Response, NextFunction } from 'express'
import { ErrorCode } from '../errors/errorCodes'

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: 'Not authenticated', code: ErrorCode.NOT_AUTHENTICATED })
    }

    if (!roles.includes(req.user.roleName)) {
      return res
        .status(403)
        .json({
          error: 'Insufficient permissions',
          code: ErrorCode.INSUFFICIENT_PERMISSIONS,
        })
    }

    next()
  }
}
</file>

<file path="src/middleware/upload.ts">
import multer from 'multer'
import { InvalidFileTypeError } from '../errors/submissionErrors'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_FILES = 5

// What an intern is allowed to attach to a task submission.
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
])

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true)
      return
    }
    cb(new InvalidFileTypeError(file.mimetype))
  },
})

export const uploadSubmissionFiles = upload.array('files', MAX_FILES)

export default uploadSubmissionFiles
</file>

<file path="src/middleware/validate.ts">
import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

interface ValidationTargets {
  body?: ZodType
  params?: ZodType
  query?: ZodType
}

export function validate(targets: ValidationTargets) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (targets.body) req.body = targets.body.parse(req.body)
      if (targets.params)
        req.params = targets.params.parse(req.params) as typeof req.params
      if (targets.query)
        req.validatedQuery = targets.query.parse(req.query) as Record<
          string,
          unknown
        >
      next()
    } catch (err) {
      next(err)
    }
  }
}
</file>

<file path="src/models/activityLogs.ts">
import type { Knex } from 'knex'
import knex from '../../db'

export interface NewActivityLog {
  intern_id: number
  actor_id?: number
  action_type: string
  entity_type?: string
  entity_id?: number
  details?: Record<string, unknown>
}

function create(data: NewActivityLog, trx: Knex = knex): Promise<void> {
  return trx('activity_logs')
    .insert(data)
    .then(() => undefined)
}

export default { create }
</file>

<file path="src/models/attendanceSessions.ts">
import db from '../../db';
import { PaginationParams } from '../utils/pagination';

export const findTodayRecord = async (userId: string, dateStr: string) => {
  return db('attendance').where({ user_id: userId, date: dateStr }).first();
};

export const recordActivity = async (userId: string, dateStr: string, now: Date) => {
  const existing = await findTodayRecord(userId, dateStr);

  if (!existing) {
    return db('attendance').insert({
      user_id: userId,
      date: dateStr,
      first_seen_at: now,
      last_active_at: now,
      active_minutes: 1,
      status: 'PENDING',
    });
  }

  const lastActive = new Date(existing.last_active_at).getTime();
  const diffInSeconds = Math.floor((now.getTime() - lastActive) / 1000);

  if (diffInSeconds > 3600) {
    return db('attendance')
      .where({ id: existing.id })
      .update({
        status: 'ABSENT',
        absence_reason: 'Exceeded 60 minutes of inactivity between 9:30 AM and 1:00 PM',
      });
  }

  const minutesToAdd = diffInSeconds >= 60 ? Math.floor(diffInSeconds / 60) : 0;

  return db('attendance')
    .where({ id: existing.id })
    .update({
      last_active_at: now,
      active_minutes: db.raw('active_minutes + ?', [minutesToAdd]),
    });
};

export const listAttendanceSessions = async (
  pagination: PaginationParams,
  filters: { internId?: number } = {}
) => {
  const query = db('attendance');

  if (filters.internId) {
    query.where('user_id', filters.internId);
  }


  const [{ count }] = await query.clone().count('* as count');
  const total = Number(count);


  const rows = await query
    .select('*')
    .limit(pagination.limit)
    .offset(pagination.offset)
    .orderBy('date', 'desc');

  return { rows, total };
};
</file>

<file path="src/models/auditLogs.ts">
export default {}
</file>

<file path="src/models/conversations.ts">
export default {}
</file>

<file path="src/models/doctors.ts">
import knex from '../../db'

export class DuplicateUsernameError extends Error {}

export interface DoctorWithUser {
  user_id: number
  university_id: number
  department: string | null
  title: string | null
  full_name: string
  username: string
  email: string | null
  is_active: boolean
}

const DOCTOR_COLUMNS = [
  'doctors.user_id',
  'doctors.university_id',
  'doctors.department',
  'doctors.title',
  'users.full_name',
  'users.username',
  'users.email',
  'users.is_active',
]

function findAll(): Promise<DoctorWithUser[]> {
  return knex('doctors')
    .join('users', 'users.id', 'doctors.user_id')
    .select(DOCTOR_COLUMNS)
    .orderBy('users.full_name')
}

function findById(userId: number): Promise<DoctorWithUser | undefined> {
  return knex('doctors')
    .join('users', 'users.id', 'doctors.user_id')
    .where('doctors.user_id', userId)
    .select(DOCTOR_COLUMNS)
    .first()
}

export interface NewDoctor {
  full_name: string
  username: string
  password_hash: string
  role_id: number
  university_id: number
  department?: string
  title?: string
}

async function create(data: NewDoctor): Promise<DoctorWithUser> {
  try {
    return await knex.transaction(async (trx) => {
      const [user] = await trx('users')
        .insert({
          full_name: data.full_name,
          username: data.username,
          password_hash: data.password_hash,
          role_id: data.role_id,
        })
        .returning('*')

      await trx('doctors').insert({
        user_id: user.id,
        university_id: data.university_id,
        department: data.department,
        title: data.title,
      })

      return {
        user_id: user.id,
        university_id: data.university_id,
        department: data.department ?? null,
        title: data.title ?? null,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        is_active: user.is_active,
      }
    })
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === '23505') {
      throw new DuplicateUsernameError()
    }
    throw err
  }
}

interface DoctorUpdate {
  university_id?: number
  department?: string
  title?: string
}

function update(userId: number, data: DoctorUpdate): Promise<number> {
  return knex('doctors').where({ user_id: userId }).update(data)
}

export default { findAll, findById, create, update }
</file>

<file path="src/models/interns.ts">
import knex from '../../db'
import type { PaginationParams } from '../utils/pagination'

export class DuplicateUsernameError extends Error {}

export interface InternWithUser {
  user_id: number
  university_id: number | null
  doctor_id: number | null
  student_id: string | null
  major: string | null
  intern_type: 'student' | 'graduate' | 'other'
  cohort: string | null
  start_date: string
  end_date: string | null
  status: 'applied' | 'active' | 'completed' | 'terminated' | 'on_leave'
  full_name: string
  username: string
  email: string | null
  is_active: boolean
}

const INTERN_COLUMNS = [
  'interns.user_id',
  'interns.university_id',
  'interns.doctor_id',
  'interns.student_id',
  'interns.major',
  'interns.intern_type',
  'interns.cohort',
  'interns.start_date',
  'interns.end_date',
  'interns.status',
  'users.full_name',
  'users.username',
  'users.email',
  'users.is_active',
]

function findAll(): Promise<InternWithUser[]> {
  return knex('interns')
    .join('users', 'users.id', 'interns.user_id')
    .select(INTERN_COLUMNS)
    .orderBy('users.full_name')
}

function findById(userId: number): Promise<InternWithUser | undefined> {
  return knex('interns')
    .join('users', 'users.id', 'interns.user_id')
    .where('interns.user_id', userId)
    .select(INTERN_COLUMNS)
    .first()
}

async function list(
  pagination: PaginationParams,
  filters: {
    universityId?: number
    internType?: InternWithUser['intern_type']
  } = {}
): Promise<{ rows: InternWithUser[]; total: number }> {
  const base = knex('interns').join('users', 'users.id', 'interns.user_id')
  if (filters.universityId !== undefined) {
    base.where('interns.university_id', filters.universityId)
  }
  if (filters.internType !== undefined) {
    base.where('interns.intern_type', filters.internType)
  }

  const countQuery = base.clone()
  const rows = await base
    .select(INTERN_COLUMNS)
    .orderBy('users.full_name')
    .limit(pagination.limit)
    .offset(pagination.offset)
  const [{ count }] = await countQuery.count<{ count: string }[]>('* as count')
  return { rows, total: Number(count) }
}

export interface NewIntern {
  full_name: string
  username: string
  password_hash: string
  role_id: number
  university_id?: number
  doctor_id?: number
  student_id?: string
  major?: string
  intern_type?: 'student' | 'graduate' | 'other'
  cohort?: string
  start_date: string
  end_date?: string
  status?: 'applied' | 'active' | 'completed' | 'terminated' | 'on_leave'
}

async function create(data: NewIntern): Promise<InternWithUser> {
  try {
    return await knex.transaction(async (trx) => {
      const [user] = await trx('users')
        .insert({
          full_name: data.full_name,
          username: data.username,
          password_hash: data.password_hash,
          role_id: data.role_id,
        })
        .returning('*')

      const [intern] = await trx('interns')
        .insert({
          user_id: user.id,
          university_id: data.university_id,
          doctor_id: data.doctor_id,
          student_id: data.student_id,
          major: data.major,
          intern_type: data.intern_type,
          cohort: data.cohort,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
        })
        .returning('*')

      return {
        ...intern,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        is_active: user.is_active,
      }
    })
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === '23505') {
      throw new DuplicateUsernameError()
    }
    throw err
  }
}

interface InternUpdate {
  university_id?: number | null
  doctor_id?: number | null
  student_id?: string
  major?: string
  intern_type?: 'student' | 'graduate' | 'other'
  cohort?: string
  start_date?: string
  end_date?: string
  status?: 'applied' | 'active' | 'completed' | 'terminated' | 'on_leave'
}

function update(userId: number, data: InternUpdate): Promise<number> {
  return knex('interns').where({ user_id: userId }).update(data)
}

export default { findAll, findById, list, create, update }
</file>

<file path="src/models/mentors.ts">
import knex from '../../db'

export class DuplicateUsernameError extends Error {}

export interface MentorWithUser {
  user_id: number
  department: string | null
  title: string | null
  full_name: string
  username: string
  email: string | null
  is_active: boolean
}

const MENTOR_COLUMNS = [
  'mentors.user_id',
  'mentors.department',
  'mentors.title',
  'users.full_name',
  'users.username',
  'users.email',
  'users.is_active',
]

function findAll(): Promise<MentorWithUser[]> {
  return knex('mentors')
    .join('users', 'users.id', 'mentors.user_id')
    .select(MENTOR_COLUMNS)
    .orderBy('users.full_name')
}

function findById(userId: number): Promise<MentorWithUser | undefined> {
  return knex('mentors')
    .join('users', 'users.id', 'mentors.user_id')
    .where('mentors.user_id', userId)
    .select(MENTOR_COLUMNS)
    .first()
}

export interface NewMentor {
  full_name: string
  username: string
  password_hash: string
  role_id: number
  department?: string
  title?: string
}

async function create(data: NewMentor): Promise<MentorWithUser> {
  try {
    return await knex.transaction(async (trx) => {
      const [user] = await trx('users')
        .insert({
          full_name: data.full_name,
          username: data.username,
          password_hash: data.password_hash,
          role_id: data.role_id,
        })
        .returning('*')

      await trx('mentors').insert({
        user_id: user.id,
        department: data.department,
        title: data.title,
      })

      return {
        user_id: user.id,
        department: data.department ?? null,
        title: data.title ?? null,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        is_active: user.is_active,
      }
    })
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === '23505') {
      throw new DuplicateUsernameError()
    }
    throw err
  }
}

interface MentorUpdate {
  department?: string
  title?: string
}

function update(userId: number, data: MentorUpdate): Promise<number> {
  return knex('mentors').where({ user_id: userId }).update(data)
}

export default { findAll, findById, create, update }
</file>

<file path="src/models/messages.ts">
export default {}
</file>

<file path="src/models/notifications.ts">
export default {}
</file>

<file path="src/models/permissions.ts">
import knex from '../../db'

export interface PermissionOverride {
  key: string
  effect: 'grant' | 'revoke'
}

export interface Permission {
  id: number
  key: string
  description: string | null
}

function findAll(): Promise<Permission[]> {
  return knex('permissions').select('id', 'key', 'description').orderBy('key')
}

function findByKey(key: string): Promise<Permission | undefined> {
  return knex('permissions').where({ key }).first()
}

async function upsertOverride(
  userId: number,
  permissionId: number,
  effect: 'grant' | 'revoke',
  grantedBy: number
): Promise<void> {
  const existing = await knex('user_permission_overrides')
    .where({ user_id: userId, permission_id: permissionId })
    .first()

  if (existing) {
    await knex('user_permission_overrides')
      .where({ user_id: userId, permission_id: permissionId })
      .update({ effect, granted_by: grantedBy })
  } else {
    await knex('user_permission_overrides').insert({
      user_id: userId,
      permission_id: permissionId,
      effect,
      granted_by: grantedBy,
    })
  }
}

function deleteOverride(
  userId: number,
  permissionId: number
): Promise<number> {
  return knex('user_permission_overrides')
    .where({ user_id: userId, permission_id: permissionId })
    .del()
}

function getRoleDefaultKeys(roleId: number): Promise<string[]> {
  return knex('role_permissions')
    .join('permissions', 'permissions.id', 'role_permissions.permission_id')
    .where('role_permissions.role_id', roleId)
    .pluck('permissions.key')
}

function getUserOverrides(userId: number): Promise<PermissionOverride[]> {
  return knex('user_permission_overrides')
    .join(
      'permissions',
      'permissions.id',
      'user_permission_overrides.permission_id'
    )
    .where('user_permission_overrides.user_id', userId)
    .select('permissions.key', 'user_permission_overrides.effect')
}

export default {
  getRoleDefaultKeys,
  getUserOverrides,
  findAll,
  findByKey,
  upsertOverride,
  deleteOverride,
}
</file>

<file path="src/models/planMilestones.ts">
import knex from '../../db'

export interface PlanMilestone {
  id: number
  plan_id: number
  title: string
  due_date: string | null
  status: 'not_started' | 'in_progress' | 'completed'
  sort_order: number | null
}

export interface NewPlanMilestone {
  plan_id: number
  title: string
  due_date?: string
  status?: PlanMilestone['status']
  sort_order?: number
}

function findByPlan(planId: number): Promise<PlanMilestone[]> {
  return knex<PlanMilestone>('plan_milestones')
    .where({ plan_id: planId })
    .orderBy('sort_order')
}

function findById(id: number): Promise<PlanMilestone | undefined> {
  return knex<PlanMilestone>('plan_milestones').where({ id }).first()
}

async function create(data: NewPlanMilestone): Promise<PlanMilestone> {
  const [milestone] = await knex<PlanMilestone>('plan_milestones')
    .insert(data)
    .returning('*')
  return milestone
}

async function update(
  id: number,
  data: Partial<NewPlanMilestone>
): Promise<PlanMilestone | undefined> {
  const [milestone] = await knex<PlanMilestone>('plan_milestones')
    .where({ id })
    .update(data)
    .returning('*')
  return milestone
}

function remove(id: number): Promise<number> {
  return knex<PlanMilestone>('plan_milestones').where({ id }).del()
}

export default { findByPlan, findById, create, update, remove }
</file>

<file path="src/models/plans.ts">
import knex from '../../db'
import type { PaginationParams } from '../utils/pagination'

export interface Plan {
  id: number
  intern_id: number
  title: string
  description: string | null
  start_date: string | null
  end_date: string | null
  created_by: number | null
  created_at: Date
}

export interface NewPlan {
  intern_id: number
  title: string
  description?: string
  start_date?: string
  end_date?: string
  created_by?: number
}

function findAll(): Promise<Plan[]> {
  return knex<Plan>('plans').orderBy('created_at', 'desc')
}

function findByIntern(internId: number): Promise<Plan[]> {
  return knex<Plan>('plans')
    .where({ intern_id: internId })
    .orderBy('created_at', 'desc')
}

async function listPaginatedByIntern(
  internId: number,
  pagination: PaginationParams
): Promise<{ rows: Plan[]; total: number }> {
  const base = knex<Plan>('plans').where({ intern_id: internId })
  const countQuery = base.clone()
  const rows = await base
    .orderBy('created_at', 'desc')
    .limit(pagination.limit)
    .offset(pagination.offset)
  const [{ count }] = await countQuery.count<{ count: string }[]>('* as count')
  return { rows, total: Number(count) }
}

function findById(id: number): Promise<Plan | undefined> {
  return knex<Plan>('plans').where({ id }).first()
}

async function create(data: NewPlan): Promise<Plan> {
  const [plan] = await knex<Plan>('plans').insert(data).returning('*')
  return plan
}

async function update(
  id: number,
  data: Partial<NewPlan>
): Promise<Plan | undefined> {
  const [plan] = await knex<Plan>('plans')
    .where({ id })
    .update(data)
    .returning('*')
  return plan
}

function remove(id: number): Promise<number> {
  return knex<Plan>('plans').where({ id }).del()
}

export default {
  findAll,
  findByIntern,
  listPaginatedByIntern,
  findById,
  create,
  update,
  remove,
}
</file>

<file path="src/models/projectInterns.ts">
import type { Knex } from 'knex'
import knex from '../../db'

export class DuplicateAssignmentError extends Error {}
export class InvalidReferenceError extends Error {}

export interface ProjectIntern {
  project_id: number
  intern_id: number
  assigned_at: Date
}

function findByProject(projectId: number): Promise<ProjectIntern[]> {
  return knex<ProjectIntern>('project_interns').where({
    project_id: projectId,
  })
}

function findByIntern(internId: number): Promise<ProjectIntern[]> {
  return knex<ProjectIntern>('project_interns').where({ intern_id: internId })
}

function find(
  projectId: number,
  internId: number
): Promise<ProjectIntern | undefined> {
  return knex<ProjectIntern>('project_interns')
    .where({ project_id: projectId, intern_id: internId })
    .first()
}

async function assign(
  projectId: number,
  internId: number
): Promise<ProjectIntern> {
  try {
    const [row] = await knex<ProjectIntern>('project_interns')
      .insert({ project_id: projectId, intern_id: internId })
      .returning('*')
    return row
  } catch (err) {
    if (err instanceof Error && 'code' in err) {
      if (err.code === '23505') throw new DuplicateAssignmentError()
      if (err.code === '23503') throw new InvalidReferenceError()
    }
    throw err
  }
}

function unassign(
  projectId: number,
  internId: number,
  trx: Knex = knex
): Promise<number> {
  return trx('project_interns')
    .where({ project_id: projectId, intern_id: internId })
    .del()
}

export default { findByProject, findByIntern, find, assign, unassign }
</file>

<file path="src/models/projects.ts">
import knex from '../../db'

export interface Project {
  id: number
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  status: 'active' | 'on_hold' | 'completed' | 'cancelled'
  created_by: number | null
  created_at: Date
  updated_at: Date
}

export interface NewProject {
  name: string
  description?: string
  start_date?: string
  end_date?: string
  status?: 'active' | 'on_hold' | 'completed' | 'cancelled'
  created_by?: number
}

function findAll(): Promise<Project[]> {
  return knex<Project>('projects').orderBy('created_at', 'desc')
}

function findById(id: number): Promise<Project | undefined> {
  return knex<Project>('projects').where({ id }).first()
}

function findByIntern(internId: number): Promise<Project[]> {
  return knex<Project>('projects')
    .join('project_interns', 'project_interns.project_id', 'projects.id')
    .where('project_interns.intern_id', internId)
    .select('projects.*')
    .orderBy('projects.created_at', 'desc')
}

async function create(data: NewProject): Promise<Project> {
  const [project] = await knex<Project>('projects').insert(data).returning('*')
  return project
}

async function update(
  id: number,
  data: Partial<NewProject>
): Promise<Project | undefined> {
  const [project] = await knex<Project>('projects')
    .where({ id })
    .update({ ...data, updated_at: knex.fn.now() })
    .returning('*')
  return project
}

function remove(id: number): Promise<number> {
  return knex<Project>('projects').where({ id }).del()
}

export default { findAll, findById, findByIntern, create, update, remove }
</file>

<file path="src/models/taskAssignments.ts">
import type { Knex } from 'knex'
import knex from '../../db'
import type { Task } from './tasks'
import type { PaginationParams } from '../utils/pagination'

export class DuplicateAssignmentError extends Error {}
export class InvalidReferenceError extends Error {}

export interface TaskAssignment {
  task_id: number
  intern_id: number
  assigned_at: Date
}

function findByTask(taskId: number): Promise<TaskAssignment[]> {
  return knex<TaskAssignment>('task_assignments').where({ task_id: taskId })
}

function findByIntern(internId: number): Promise<TaskAssignment[]> {
  return knex<TaskAssignment>('task_assignments').where({
    intern_id: internId,
  })
}

function find(
  taskId: number,
  internId: number
): Promise<TaskAssignment | undefined> {
  return knex<TaskAssignment>('task_assignments')
    .where({ task_id: taskId, intern_id: internId })
    .first()
}

async function listTasksForIntern(
  internId: number,
  pagination: PaginationParams
): Promise<{ rows: Task[]; total: number }> {
  const base = knex('task_assignments')
    .join('tasks', 'tasks.id', 'task_assignments.task_id')
    .where('task_assignments.intern_id', internId)

  const countQuery = base.clone()
  const rows = await base
    .select('tasks.*')
    .orderBy('tasks.created_at', 'desc')
    .limit(pagination.limit)
    .offset(pagination.offset)
  const [{ count }] = await countQuery.count<{ count: string }[]>('* as count')
  return { rows: rows as Task[], total: Number(count) }
}

async function assign(
  taskId: number,
  internId: number
): Promise<TaskAssignment> {
  try {
    const [row] = await knex<TaskAssignment>('task_assignments')
      .insert({ task_id: taskId, intern_id: internId })
      .returning('*')
    return row
  } catch (err) {
    if (err instanceof Error && 'code' in err) {
      if (err.code === '23505') throw new DuplicateAssignmentError()
      if (err.code === '23503') throw new InvalidReferenceError()
    }
    throw err
  }
}

function unassign(
  taskId: number,
  internId: number,
  trx: Knex = knex
): Promise<number> {
  return trx('task_assignments')
    .where({ task_id: taskId, intern_id: internId })
    .del()
}

// Used when an intern is removed from a project — a task assignment implies
// project membership, so this cascade keeps that invariant when membership
// is revoked.
async function removeByProjectAndIntern(
  projectId: number,
  internId: number,
  trx: Knex = knex
): Promise<number> {
  const taskIds = await trx('tasks')
    .where({ project_id: projectId })
    .pluck('id')
  if (taskIds.length === 0) return 0
  return trx('task_assignments')
    .where({ intern_id: internId })
    .whereIn('task_id', taskIds)
    .del()
}

export default {
  findByTask,
  findByIntern,
  find,
  listTasksForIntern,
  assign,
  unassign,
  removeByProjectAndIntern,
}
</file>

<file path="src/models/tasks.ts">
import type { Knex } from 'knex'
import knex from '../../db'

export interface Task {
  id: number
  project_id: number | null
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  status: 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'rejected'
  created_by: number | null
  created_at: Date
  updated_at: Date
}

export interface NewTask {
  project_id?: number
  title: string
  description?: string
  priority?: Task['priority']
  due_date?: string
  status?: Task['status']
  created_by?: number
}

function findAll(): Promise<Task[]> {
  return knex<Task>('tasks').orderBy('created_at', 'desc')
}

function findById(id: number, trx: Knex = knex): Promise<Task | undefined> {
  return trx<Task>('tasks').where({ id }).first()
}

async function create(data: NewTask): Promise<Task> {
  const [task] = await knex<Task>('tasks').insert(data).returning('*')
  return task
}

async function update(
  id: number,
  data: Partial<NewTask>,
  trx: Knex = knex
): Promise<Task | undefined> {
  const [task] = await trx<Task>('tasks')
    .where({ id })
    .update({ ...data, updated_at: trx.fn.now() })
    .returning('*')
  return task
}

function remove(id: number): Promise<number> {
  return knex<Task>('tasks').where({ id }).del()
}

export default { findAll, findById, create, update, remove }
</file>

<file path="src/models/taskSubmissions.ts">
import type { Knex } from 'knex'
import knex from '../../db'

export interface TaskSubmission {
  id: number
  task_id: number
  intern_id: number
  note: string | null
  file_url: string | null
  submitted_at: Date
  reviewed_by: number | null
  review_status: 'pending' | 'approved' | 'rejected'
  review_comment: string | null
  reviewed_at: Date | null
}

export interface NewTaskSubmission {
  task_id: number
  intern_id: number
  note?: string
  file_url?: string | null
}

function findByTask(taskId: number): Promise<TaskSubmission[]> {
  return knex<TaskSubmission>('task_submissions')
    .where({ task_id: taskId })
    .orderBy('submitted_at', 'desc')
}

function findById(id: number): Promise<TaskSubmission | undefined> {
  return knex<TaskSubmission>('task_submissions').where({ id }).first()
}

function findByIntern(internId: number): Promise<TaskSubmission[]> {
  return knex<TaskSubmission>('task_submissions')
    .where({ intern_id: internId })
    .orderBy('submitted_at', 'desc')
}

async function create(
  data: NewTaskSubmission,
  trx: Knex = knex
): Promise<TaskSubmission> {
  const [row] = await trx<TaskSubmission>('task_submissions')
    .insert(data)
    .returning('*')
  return row
}

interface ReviewUpdate {
  review_status: 'approved' | 'rejected'
  review_comment?: string
  reviewed_by: number
}

async function review(
  id: number,
  data: ReviewUpdate,
  trx: Knex = knex
): Promise<TaskSubmission | undefined> {
  const [row] = await trx<TaskSubmission>('task_submissions')
    .where({ id })
    .update({ ...data, reviewed_at: trx.fn.now() })
    .returning('*')
  return row
}

export default { findByTask, findById, findByIntern, create, review }
</file>

<file path="src/models/universities.ts">
import knex from '../../db'
import type { PaginationParams } from '../utils/pagination'

export interface University {
  id: number
  name: string
  country: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface NewUniversity {
  name: string
  country?: string | null
}

function findAll(): Promise<University[]> {
  return knex<University>('universities').orderBy('name')
}

function findById(id: number): Promise<University | undefined> {
  return knex<University>('universities').where({ id }).first()
}

async function list(
  pagination: PaginationParams,
  filters: { includeInactive?: boolean } = {}
): Promise<{ rows: University[]; total: number }> {
  const base = knex<University>('universities')
  if (!filters.includeInactive) {
    base.where({ is_active: true })
  }

  const countQuery = base.clone()
  const rows = await base
    .orderBy('name')
    .limit(pagination.limit)
    .offset(pagination.offset)
  const [{ count }] = await countQuery.count<{ count: string }[]>('* as count')
  return { rows, total: Number(count) }
}

async function create(data: NewUniversity): Promise<University> {
  const [university] = await knex<University>('universities')
    .insert(data)
    .returning('*')
  return university
}

async function update(
  id: number,
  data: Partial<NewUniversity>
): Promise<University | undefined> {
  const [university] = await knex<University>('universities')
    .where({ id })
    .update({ ...data, updated_at: knex.fn.now() })
    .returning('*')
  return university
}

function setActive(id: number, isActive: boolean): Promise<number> {
  return knex<University>('universities')
    .where({ id })
    .update({ is_active: isActive, updated_at: knex.fn.now() })
}

export default { findAll, findById, list, create, update, setActive }
</file>

<file path="src/models/users.ts">
import knex from '../../db'

export interface User {
  id: number
  full_name: string
  username: string
  email: string | null
  password_hash: string
  role_id: number
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  created_by: number | null
  created_at: Date
  updated_at: Date
}

export interface NewUser {
  full_name: string
  username: string
  password_hash: string
  role_id: number
  email?: string
  phone?: string
  created_by?: number
}

export interface UserWithRole extends User {
  role_name: string
}

function findByUsername(username: string): Promise<User | undefined> {
  return knex<User>('users').where({ username }).first()
}

function findByUsernameWithRole(
  username: string
): Promise<UserWithRole | undefined> {
  return knex<User>('users')
    .join('roles', 'roles.id', 'users.role_id')
    .where({ username })
    .select('users.*', 'roles.name as role_name')
    .first()
}

function findById(id: number): Promise<User | undefined> {
  return knex<User>('users').where({ id }).first()
}

function findByIdWithRole(id: number): Promise<UserWithRole | undefined> {
  return knex<User>('users')
    .join('roles', 'roles.id', 'users.role_id')
    .where({ 'users.id': id })
    .select('users.*', 'roles.name as role_name')
    .first()
}

async function createUser(data: NewUser): Promise<User> {
  const [user] = await knex<User>('users').insert(data).returning('*')
  return user
}

function updateUsername(id: number, username: string): Promise<number> {
  return knex<User>('users')
    .where({ id })
    .update({ username, updated_at: knex.fn.now() })
}

function updatePasswordHash(
  id: number,
  password_hash: string
): Promise<number> {
  return knex<User>('users')
    .where({ id })
    .update({ password_hash, updated_at: knex.fn.now() })
}

function setActive(id: number, isActive: boolean): Promise<number> {
  return knex<User>('users')
    .where({ id })
    .update({ is_active: isActive, updated_at: knex.fn.now() })
}

export default {
  findByUsername,
  findByUsernameWithRole,
  findById,
  findByIdWithRole,
  createUser,
  updateUsername,
  updatePasswordHash,
  setActive,
}
</file>

<file path="src/routes/attendanceRoutes.ts">
import { Router } from 'express'
import { sendHeartbeat } from '../controllers/attendanceController' 
import {requireAuth} from '../middleware/authMiddleware';
const router = Router()

router.post("/HeartBeatAttendence" ,requireAuth, sendHeartbeat);

export default router
</file>

<file path="src/routes/authRoutes.ts">
import { Router } from 'express'
import authController from '../controllers/authController'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.post('/login', authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.get('/me', requireAuth, authController.me)

export default router
</file>

<file path="src/routes/chatRoutes.ts">
import { Router } from 'express'

const router = Router()

export default router
</file>

<file path="src/routes/doctorPortalRoutes.ts">
import { Router } from 'express'
import * as doctorScopeController from '../controllers/doctorScopeController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'

// Strictly read-only: doctors have no write endpoints anywhere in this
// router, and requireRole("doctor") plus per-lookup scope checks in
// doctorScopeService keep this to the doctor's own university's student
// interns only.
const router = Router()

router.use(requireAuth)
router.use(requireRole('doctor'))

router.get('/interns', doctorScopeController.listInterns)
router.get('/interns/:id', doctorScopeController.getInternProfile)
router.get('/interns/:id/tasks', doctorScopeController.listInternTasks)
router.get('/interns/:id/plans', doctorScopeController.listInternPlans)
router.get(
  '/interns/:id/attendance',
  doctorScopeController.listInternAttendance
)

export default router
</file>

<file path="src/routes/doctorRoutes.ts">
import { Router } from 'express'
import doctorController from '../controllers/doctorController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'

const router = Router()

router.use(requireAuth)
router.use(requireRole('doctor'))

router.get('/', doctorController.list)
router.get('/:userId', doctorController.getOne)
router.post('/', doctorController.create)
router.patch('/:userId', doctorController.update)
router.patch('/:userId/deactivate', doctorController.deactivate)

export default router
</file>

<file path="src/routes/internRoutes.ts">
import { Router } from 'express'
import internController from '../controllers/internController'
import { requireAuth } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', internController.list)
router.get('/:userId', internController.getOne)
router.post('/', requirePermission('manage_users'), internController.create)
router.patch(
  '/:userId',
  requirePermission('manage_users'),
  internController.update
)
router.patch(
  '/:userId/assignment',
  requirePermission('assign_interns'),
  internController.updateAssignment
)
router.patch(
  '/:userId/deactivate',
  requirePermission('manage_users'),
  internController.deactivate
)

export default router
</file>

<file path="src/routes/logsRoutes.ts">
import { Router } from 'express'

const router = Router()

export default router
</file>

<file path="src/routes/mentorRoutes.ts">
import { Router } from 'express'
import mentorController from '../controllers/mentorController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'mentor'), mentorController.list)
router.get('/:userId', requireRole('admin', 'mentor'), mentorController.getOne)
router.post('/', requirePermission('manage_users'), mentorController.create)
router.patch(
  '/:userId',
  requirePermission('manage_users'),
  mentorController.update
)
router.patch(
  '/:userId/deactivate',
  requirePermission('manage_users'),
  mentorController.deactivate
)

router.get(
  '/:userId/permissions',
  requirePermission('manage_permissions'),
  mentorController.getPermissions
)
router.patch(
  '/:userId/permissions',
  requirePermission('manage_permissions'),
  mentorController.updatePermissions
)

export default router
</file>

<file path="src/routes/meRoutes.ts">
import { Router } from 'express'
import meController from '../controllers/meController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'

// The intern's own portal: every route is scoped to the authenticated
// intern's user id, so there are no path params and no write endpoints.
const router = Router()

router.use(requireAuth)
router.use(requireRole('intern'))

router.get('/', meController.getProfile)
router.get('/projects', meController.listProjects)
router.get('/tasks', meController.listTasks)
router.get('/submissions', meController.listSubmissions)
router.get('/plans', meController.listPlans)

export default router
</file>

<file path="src/routes/notificationRoutes.ts">
import { Router } from 'express'

const router = Router()

export default router
</file>

<file path="src/routes/planRoutes.ts">
import { Router } from 'express'
import planController from '../controllers/planController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'mentor'), planController.list)
router.get('/:id', requireRole('admin', 'mentor'), planController.getOne)
router.post('/', requirePermission('manage_plans'), planController.create)
router.patch('/:id', requirePermission('manage_plans'), planController.update)
router.delete('/:id', requirePermission('manage_plans'), planController.remove)

router.get(
  '/:id/milestones',
  requireRole('admin', 'mentor'),
  planController.listMilestones
)
router.post(
  '/:id/milestones',
  requirePermission('manage_plans'),
  planController.createMilestone
)
router.patch(
  '/:id/milestones/:milestoneId',
  requirePermission('manage_plans'),
  planController.updateMilestone
)
router.delete(
  '/:id/milestones/:milestoneId',
  requirePermission('manage_plans'),
  planController.removeMilestone
)

export default router
</file>

<file path="src/routes/projectRoutes.ts">
import { Router } from 'express'
import projectController from '../controllers/projectController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'mentor'), projectController.list)
router.get('/:id', requireRole('admin', 'mentor'), projectController.getOne)
router.post('/', requirePermission('manage_projects'), projectController.create)
router.patch(
  '/:id',
  requirePermission('manage_projects'),
  projectController.update
)
router.delete(
  '/:id',
  requirePermission('manage_projects'),
  projectController.remove
)

router.get(
  '/:id/interns',
  requireRole('admin', 'mentor'),
  projectController.listInterns
)
router.post(
  '/:id/interns',
  requirePermission('assign_interns'),
  projectController.assignIntern
)
router.delete(
  '/:id/interns/:internId',
  requirePermission('assign_interns'),
  projectController.removeIntern
)

export default router
</file>

<file path="src/routes/taskRoutes.ts">
import { Router } from 'express'
import taskController from '../controllers/taskController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin', 'mentor'), taskController.list)
router.get('/:id', requireRole('admin', 'mentor'), taskController.getOne)
router.post('/', requirePermission('manage_tasks'), taskController.create)
router.patch('/:id', requirePermission('manage_tasks'), taskController.update)
router.delete('/:id', requirePermission('manage_tasks'), taskController.remove)

router.get(
  '/:id/assignments',
  requireRole('admin', 'mentor'),
  taskController.listAssignments
)
router.post(
  '/:id/assignments',
  requirePermission('assign_interns'),
  taskController.assignIntern
)
router.delete(
  '/:id/assignments/:internId',
  requirePermission('assign_interns'),
  taskController.removeIntern
)

export default router
</file>

<file path="src/routes/taskSubmissionRoutes.ts">
import { Router } from 'express'
import taskSubmissionController from '../controllers/taskSubmissionController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'
import uploadSubmissionFiles from '../middleware/upload'

const router = Router()

router.use(requireAuth)

router.get('/', taskSubmissionController.listByTask)
router.get('/:id', taskSubmissionController.getOne)
router.post(
  '/',
  requireRole('intern'),
  uploadSubmissionFiles,
  taskSubmissionController.create
)

router.patch(
  '/:id/review',
  requirePermission('approve_submissions'),
  taskSubmissionController.review
)

export default router
</file>

<file path="src/routes/universityRoutes.ts">
import { Router } from 'express'
import universityController from '../controllers/universityController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { requirePermission } from '../middleware/permissionMiddleware'
import { validate } from '../middleware/validate'
import {
  universityIdParamSchema,
  createUniversitySchema,
  updateUniversitySchema,
  listUniversitiesQuerySchema,
} from '../schemas/universitySchemas'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  requireRole('admin', 'mentor'),
  validate({ query: listUniversitiesQuerySchema }),
  universityController.list
)
router.get(
  '/:id',
  requireRole('admin', 'mentor'),
  validate({ params: universityIdParamSchema }),
  universityController.getOne
)
router.post(
  '/',
  requirePermission('manage_universities'),
  validate({ body: createUniversitySchema }),
  universityController.create
)
router.patch(
  '/:id',
  requirePermission('manage_universities'),
  validate({ body: updateUniversitySchema }),
  universityController.update
)
router.patch(
  '/:id/deactivate',
  requirePermission('manage_universities'),
  validate({ params: universityIdParamSchema }),
  universityController.deactivate
)

export default router
</file>

<file path="src/routes/userRoutes.ts">
import { Router } from 'express'

const router = Router()

export default router
</file>

<file path="src/schemas/attendanceSchemas.ts">
export {}
</file>

<file path="src/schemas/chatSchemas.ts">
export {}
</file>

<file path="src/schemas/doctorSchemas.ts">
export {}
</file>

<file path="src/schemas/doctorScopeSchemas.ts">
export {}
</file>

<file path="src/schemas/internSchemas.ts">
export {}
</file>

<file path="src/schemas/logsSchemas.ts">
export {}
</file>

<file path="src/schemas/mentorSchemas.ts">
export {}
</file>

<file path="src/schemas/notificationSchemas.ts">
export {}
</file>

<file path="src/schemas/planSchemas.ts">
export {}
</file>

<file path="src/schemas/projectSchemas.ts">
export {}
</file>

<file path="src/schemas/taskSchemas.ts">
export {}
</file>

<file path="src/schemas/taskSubmissionSchemas.ts">
export {}
</file>

<file path="src/schemas/universitySchemas.ts">
import { z } from 'zod'

export const universityIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const listUniversitiesQuerySchema = z.object({
  includeInactive: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
})

export const createUniversitySchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  country: z.string().trim().min(1).optional(),
})

export const updateUniversitySchema = z
  .object({
    name: z.string().trim().min(1, 'name cannot be empty'),
    country: z.string().trim().min(1).nullable(),
  })
  .partial()

export type UniversityIdParam = z.infer<typeof universityIdParamSchema>
export type ListUniversitiesQuery = z.infer<typeof listUniversitiesQuerySchema>
export type CreateUniversityBody = z.infer<typeof createUniversitySchema>
export type UpdateUniversityBody = z.infer<typeof updateUniversitySchema>
</file>

<file path="src/services/attendanceService.ts">
import { listAttendanceSessions } from '../models/attendanceSessions';
import { PaginationParams, paginatedResponse } from '../utils/pagination';

export async function listSessions(
  pagination: PaginationParams,
  filters: { internId?: number } = {}
) {
  const { rows, total } = await listAttendanceSessions(
    pagination,
    filters
  );
  
  return paginatedResponse(rows, total, pagination);
}
</file>

<file path="src/services/auditService.ts">
export default {}
</file>

<file path="src/services/authService.test.ts">
import { test, after } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app'
import knex from '../../db'

const api = supertest.agent(app)

after(() => knex.destroy())

test('login succeeds with the correct password', async () => {
  const response = await api
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password' })
    .expect(200)

  assert.equal(response.body.user.username, 'admin')
  assert.equal(response.body.user.roleName, 'admin')
  assert.ok(response.headers['set-cookie'])
})

test('login rejects with the wrong password', async () => {
  const response = await supertest(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'wrong-password' })
    .expect(401)

  assert.ok(response.body.error)
})

test('login rejects for a username that does not exist', async () => {
  await supertest(app)
    .post('/api/auth/login')
    .send({ username: 'does-not-exist', password: 'password' })
    .expect(401)
})

test('GET /api/auth/me works with a valid session, rejects a bad one', async () => {
  const me = await api.get('/api/auth/me').expect(200)
  assert.equal(me.body.user.username, 'admin')

  const badSession = supertest(app)
  await badSession
    .get('/api/auth/me')
    .set('Cookie', 'access_token=not-a-real-token')
    .expect(401)
})

test('POST /api/auth/refresh issues a new session from the refresh cookie', async () => {
  const response = await api.post('/api/auth/refresh').expect(200)
  assert.equal(response.body.user.username, 'admin')
})
</file>

<file path="src/services/authService.ts">
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import usersModel, { type UserWithRole } from '../models/users'
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../utils/config'

const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL = '7d'

export class InvalidCredentialsError extends Error {}
export class AccountInactiveError extends Error {}
export class InvalidRefreshTokenError extends Error {}

export interface AccessTokenPayload {
  sub: number
  username: string
  roleId: number
  roleName: string
  type: 'access'
}

interface RefreshTokenPayload {
  sub: number
  type: 'refresh'
}

export interface AuthResult {
  accessToken: string
  refreshToken: string
  user: UserWithRole
}

function signAccessToken(user: UserWithRole): string {
  const payload: AccessTokenPayload = {
    sub: user.id,
    username: user.username,
    roleId: user.role_id,
    roleName: user.role_name,
    type: 'access',
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL })
}

function signRefreshToken(user: UserWithRole): string {
  const payload: RefreshTokenPayload = { sub: user.id, type: 'refresh' }
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  })
}

async function login(
  username: string,
  password: string
): Promise<AuthResult> {
  const user = await usersModel.findByUsernameWithRole(username)
  if (!user) throw new InvalidCredentialsError()

  const passwordMatches = await bcrypt.compare(password, user.password_hash)
  if (!passwordMatches) throw new InvalidCredentialsError()

  if (!user.is_active) throw new AccountInactiveError()

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
    user,
  }
}

async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; user: UserWithRole }> {
  let payload: RefreshTokenPayload
  try {
    payload = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as unknown as RefreshTokenPayload
  } catch {
    throw new InvalidRefreshTokenError()
  }
  if (payload.type !== 'refresh') throw new InvalidRefreshTokenError()

  const user = await usersModel.findByIdWithRole(payload.sub)
  if (!user || !user.is_active) throw new InvalidRefreshTokenError()

  return { accessToken: signAccessToken(user), user }
}

function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(
    token,
    JWT_SECRET
  ) as unknown as AccessTokenPayload
  if (payload.type !== 'access') throw new Error('Invalid token type')
  return payload
}

export default {
  login,
  refreshAccessToken,
  verifyAccessToken,
}
</file>

<file path="src/services/chatService.ts">
export default {}
</file>

<file path="src/services/doctorScopeService.ts">
import doctorModel from '../models/doctors'
import internModel from '../models/interns'
import taskAssignmentModel from '../models/taskAssignments'
import * as planService from './planService'
import * as attendanceService from './attendanceService'
import { PaginationParams, paginatedResponse } from '../utils/pagination'
import { InternNotInScopeError } from '../errors/doctorScopeErrors'

async function verifyInScope(doctorUserId: number, internUserId: number) {
  const doctor = await doctorModel.findById(doctorUserId)
  const intern = await internModel.findById(internUserId)
  if (
    !doctor ||
    !intern ||
    intern.intern_type !== 'student' ||
    intern.university_id !== doctor.university_id
  ) {
    throw new InternNotInScopeError()
  }
  return intern
}

export async function listInterns(
  doctorUserId: number,
  pagination: PaginationParams
) {
  const doctor = await doctorModel.findById(doctorUserId)
  if (!doctor) {
    return paginatedResponse([], 0, pagination)
  }
  const { rows, total } = await internModel.list(pagination, {
    universityId: doctor.university_id,
    internType: 'student',
  })
  return paginatedResponse(rows, total, pagination)
}

export async function getInternProfile(
  doctorUserId: number,
  internUserId: number
) {
  return verifyInScope(doctorUserId, internUserId)
}

export async function listInternTasks(
  doctorUserId: number,
  internUserId: number,
  pagination: PaginationParams
) {
  await verifyInScope(doctorUserId, internUserId)
  const { rows, total } = await taskAssignmentModel.listTasksForIntern(
    internUserId,
    pagination
  )
  return paginatedResponse(rows, total, pagination)
}

export async function listInternPlans(
  doctorUserId: number,
  internUserId: number,
  pagination: PaginationParams
) {
  await verifyInScope(doctorUserId, internUserId)
  return planService.listPlansForIntern(internUserId, pagination)
}

export async function listInternAttendance(
  doctorUserId: number,
  internUserId: number,
  pagination: PaginationParams
) {
  await verifyInScope(doctorUserId, internUserId)
  return attendanceService.listSessions(pagination, { internId: internUserId })
}
</file>

<file path="src/services/doctorService.ts">
import bcrypt from 'bcrypt'
import knex from '../../db'
import doctorsModel, {
  type DoctorWithUser,
  DuplicateUsernameError,
} from '../models/doctors'
import userService from './userService'
import { ValidationError } from '../errors/AppError'

export { DuplicateUsernameError }
export { ValidationError }

const SALT_ROUNDS = 10

export interface DoctorInput {
  full_name: string
  username: string
  password: string
  university_id: number
  department?: string
  title?: string
}

function assertValid(input: DoctorInput): void {
  if (!input.full_name?.trim()) {
    throw new ValidationError('full_name is required')
  }
  if (!input.username?.trim()) {
    throw new ValidationError('username is required')
  }
  if (!input.password || input.password.length < 8) {
    throw new ValidationError('password must be at least 8 characters')
  }
  if (!input.university_id) {
    throw new ValidationError('university_id is required')
  }
}

async function getDoctorRoleId(): Promise<number> {
  const role = await knex('roles').where({ name: 'doctor' }).first()
  if (!role) throw new Error('doctor role not seeded')
  return role.id
}

function listDoctors(): Promise<DoctorWithUser[]> {
  return doctorsModel.findAll()
}

function getDoctor(userId: number): Promise<DoctorWithUser | undefined> {
  return doctorsModel.findById(userId)
}

async function createDoctor(input: DoctorInput): Promise<DoctorWithUser> {
  assertValid(input)
  const role_id = await getDoctorRoleId()
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS)

  return doctorsModel.create({
    full_name: input.full_name.trim(),
    username: input.username.trim(),
    password_hash,
    role_id,
    university_id: input.university_id,
    department: input.department?.trim(),
    title: input.title?.trim(),
  })
}

function updateDoctor(
  userId: number,
  input: Partial<Pick<DoctorInput, 'university_id' | 'department' | 'title'>>
): Promise<number> {
  return doctorsModel.update(userId, input)
}

function deactivateDoctor(userId: number): Promise<boolean> {
  return userService.setActive(userId, false)
}

export default {
  listDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deactivateDoctor,
}
</file>

<file path="src/services/internService.ts">
import bcrypt from 'bcrypt'
import knex from '../../db'
import internsModel, {
  type InternWithUser,
  type NewIntern,
  DuplicateUsernameError,
} from '../models/interns'
import userService from './userService'
import { AppError, ValidationError } from '../errors/AppError'

export { DuplicateUsernameError }

export class InternNotFoundError extends AppError {
  constructor() {
    super(404, 'INTERN_NOT_FOUND', 'Intern not found')
  }
}

const SALT_ROUNDS = 10

export { ValidationError }

export interface InternInput {
  full_name: string
  username: string
  password: string
  start_date: string
  university_id?: number
  doctor_id?: number
  student_id?: string
  major?: string
  intern_type?: 'student' | 'graduate' | 'other'
  cohort?: string
  end_date?: string
  status?: 'applied' | 'active' | 'completed' | 'terminated' | 'on_leave'
}

// Mirrors the DB's chk_interns_non_student_no_academic_link CHECK constraint —
// caught here so the UI/caller gets a clean 400 instead of a raw DB error.
function assertAcademicLinkAllowed(
  internType: string,
  universityId?: number | null,
  doctorId?: number | null
): void {
  if (internType !== 'student' && (universityId || doctorId)) {
    throw new ValidationError(
      'university_id and doctor_id can only be set when intern_type is "student"'
    )
  }
}

function assertValid(input: InternInput): void {
  if (!input.full_name?.trim()) {
    throw new ValidationError('full_name is required')
  }
  if (!input.username?.trim()) {
    throw new ValidationError('username is required')
  }
  if (!input.password || input.password.length < 8) {
    throw new ValidationError('password must be at least 8 characters')
  }
  if (!input.start_date) {
    throw new ValidationError('start_date is required')
  }
  assertAcademicLinkAllowed(
    input.intern_type ?? 'student',
    input.university_id,
    input.doctor_id
  )
}

async function getInternRoleId(): Promise<number> {
  const role = await knex('roles').where({ name: 'intern' }).first()
  if (!role) throw new Error('intern role not seeded')
  return role.id
}

function listInterns(): Promise<InternWithUser[]> {
  return internsModel.findAll()
}

function getIntern(userId: number): Promise<InternWithUser | undefined> {
  return internsModel.findById(userId)
}

async function createIntern(input: InternInput): Promise<InternWithUser> {
  assertValid(input)
  const role_id = await getInternRoleId()
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS)

  const data: NewIntern = {
    full_name: input.full_name.trim(),
    username: input.username.trim(),
    password_hash,
    role_id,
    university_id: input.university_id,
    doctor_id: input.doctor_id,
    student_id: input.student_id?.trim(),
    major: input.major?.trim(),
    intern_type: input.intern_type,
    cohort: input.cohort?.trim(),
    start_date: input.start_date,
    end_date: input.end_date,
    status: input.status,
  }

  return internsModel.create(data)
}

async function updateIntern(
  userId: number,
  input: Partial<
    Pick<
      InternInput,
      'student_id' | 'major' | 'intern_type' | 'cohort' | 'end_date' | 'status'
    >
  >
): Promise<InternWithUser | undefined> {
  if (input.intern_type !== undefined) {
    const current = await internsModel.findById(userId)
    if (!current) return undefined

    assertAcademicLinkAllowed(
      input.intern_type,
      current.university_id,
      current.doctor_id
    )
  }

  const updatedCount = await internsModel.update(userId, input)
  if (updatedCount === 0) return undefined
  return internsModel.findById(userId)
}

export interface InternAssignmentInput {
  university_id?: number | null
  doctor_id?: number | null
}

async function updateAssignment(
  userId: number,
  input: InternAssignmentInput
): Promise<InternWithUser | undefined> {
  const current = await internsModel.findById(userId)
  if (!current) return undefined

  const universityId =
    input.university_id !== undefined
      ? input.university_id
      : current.university_id
  const doctorId =
    input.doctor_id !== undefined ? input.doctor_id : current.doctor_id

  assertAcademicLinkAllowed(current.intern_type, universityId, doctorId)

  const updatedCount = await internsModel.update(userId, {
    university_id: universityId,
    doctor_id: doctorId,
  })
  if (updatedCount === 0) return undefined
  return internsModel.findById(userId)
}

function deactivateIntern(userId: number): Promise<boolean> {
  return userService.setActive(userId, false)
}

export default {
  listInterns,
  getIntern,
  createIntern,
  updateIntern,
  updateAssignment,
  deactivateIntern,
}
</file>

<file path="src/services/logsService.ts">
export default {}
</file>

<file path="src/services/mentorService.ts">
import bcrypt from 'bcrypt'
import knex from '../../db'
import mentorsModel, {
  type MentorWithUser,
  DuplicateUsernameError,
} from '../models/mentors'
import userService from './userService'
import { ValidationError } from '../errors/AppError'

export { DuplicateUsernameError }

const SALT_ROUNDS = 10

export { ValidationError }

export interface MentorInput {
  full_name: string
  username: string
  password: string
  department?: string
  title?: string
}

function assertValid(input: MentorInput): void {
  if (!input.full_name?.trim()) {
    throw new ValidationError('full_name is required')
  }
  if (!input.username?.trim()) {
    throw new ValidationError('username is required')
  }
  if (!input.password || input.password.length < 8) {
    throw new ValidationError('password must be at least 8 characters')
  }
}

async function getMentorRoleId(): Promise<number> {
  const role = await knex('roles').where({ name: 'mentor' }).first()
  if (!role) throw new Error('mentor role not seeded')
  return role.id
}

function listMentors(): Promise<MentorWithUser[]> {
  return mentorsModel.findAll()
}

function getMentor(userId: number): Promise<MentorWithUser | undefined> {
  return mentorsModel.findById(userId)
}

async function createMentor(input: MentorInput): Promise<MentorWithUser> {
  assertValid(input)
  const role_id = await getMentorRoleId()
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS)

  return mentorsModel.create({
    full_name: input.full_name.trim(),
    username: input.username.trim(),
    password_hash,
    role_id,
    department: input.department?.trim(),
    title: input.title?.trim(),
  })
}

function updateMentor(
  userId: number,
  input: Partial<Pick<MentorInput, 'department' | 'title'>>
): Promise<number> {
  return mentorsModel.update(userId, input)
}

function deactivateMentor(userId: number): Promise<boolean> {
  return userService.setActive(userId, false)
}

export default {
  listMentors,
  getMentor,
  createMentor,
  updateMentor,
  deactivateMentor,
}
</file>

<file path="src/services/meService.test.ts">
import { test, before, after } from 'node:test'
import assert from 'node:assert'
import bcrypt from 'bcrypt'
import supertest from 'supertest'
import app from '../app'
import knex from '../../db'

const api = supertest.agent(app)
const adminApi = supertest.agent(app)

const USERNAME = 'me-test-intern'

let internId: number
let projectId: number
let taskId: number
let planId: number

async function cleanup() {
  const existing = await knex('users').where({ username: USERNAME }).first()
  if (existing) {
    // projects/plans don't cascade from the user, so clear them explicitly;
    // interns + join rows + submissions go via ON DELETE CASCADE.
    await knex('projects')
      .whereIn(
        'id',
        knex('project_interns')
          .select('project_id')
          .where('intern_id', existing.id)
      )
      .del()
    await knex('plans').where({ intern_id: existing.id }).del()
    await knex('users').where({ id: existing.id }).del()
  }
}

after(async () => {
  await cleanup()
  await knex.destroy()
})

before(async () => {
  await cleanup()

  const internRole = await knex('roles').where({ name: 'intern' }).first()
  const [user] = await knex('users')
    .insert({
      full_name: 'Me Test Intern',
      username: USERNAME,
      password_hash: await bcrypt.hash('password', 10),
      role_id: internRole.id,
      is_active: true,
    })
    .returning('*')
  internId = user.id
  await knex('interns').insert({
    user_id: internId,
    intern_type: 'graduate',
    start_date: '2026-01-01',
    status: 'active',
  })

  const [project] = await knex('projects')
    .insert({ name: 'Me Test Project' })
    .returning('*')
  projectId = project.id
  await knex('project_interns').insert({
    project_id: projectId,
    intern_id: internId,
  })

  const [task] = await knex('tasks')
    .insert({ project_id: projectId, title: 'Me Test Task' })
    .returning('*')
  taskId = task.id
  await knex('task_assignments').insert({
    task_id: taskId,
    intern_id: internId,
  })
  await knex('task_submissions').insert({
    task_id: taskId,
    intern_id: internId,
    note: 'first pass',
    file_url: null,
  })

  const [plan] = await knex('plans')
    .insert({ intern_id: internId, title: 'Me Test Plan' })
    .returning('*')
  planId = plan.id
  await knex('plan_milestones').insert({
    plan_id: planId,
    title: 'Milestone one',
  })

  await api
    .post('/api/auth/login')
    .send({ username: USERNAME, password: 'password' })
    .expect(200)
  await adminApi
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password' })
    .expect(200)
})

test('GET /api/me returns the caller’s own intern profile', async () => {
  const res = await api.get('/api/me').expect(200)
  assert.equal(res.body.profile.user_id, internId)
  assert.equal(res.body.profile.full_name, 'Me Test Intern')
  assert.equal(res.body.profile.intern_type, 'graduate')
})

test('GET /api/me/projects lists only the interns assigned projects', async () => {
  const res = await api.get('/api/me/projects').expect(200)
  assert.equal(res.body.projects.length, 1)
  assert.equal(res.body.projects[0].id, projectId)
})

test('GET /api/me/tasks returns a paginated list of assigned tasks', async () => {
  const res = await api.get('/api/me/tasks').expect(200)
  assert.equal(res.body.total, 1)
  assert.equal(res.body.data[0].id, taskId)
  assert.equal(res.body.page, 1)
})

test('GET /api/me/submissions returns the interns submissions', async () => {
  const res = await api.get('/api/me/submissions').expect(200)
  assert.equal(res.body.submissions.length, 1)
  assert.equal(res.body.submissions[0].note, 'first pass')
})

test('GET /api/me/plans returns plans with their milestones nested', async () => {
  const res = await api.get('/api/me/plans').expect(200)
  assert.equal(res.body.plans.length, 1)
  assert.equal(res.body.plans[0].id, planId)
  assert.equal(res.body.plans[0].milestones.length, 1)
  assert.equal(res.body.plans[0].milestones[0].title, 'Milestone one')
})

test('GET /api/me is forbidden for a non-intern role', async () => {
  await adminApi.get('/api/me').expect(403)
})
</file>

<file path="src/services/meService.ts">
import internsModel, { type InternWithUser } from '../models/interns'
import projectsModel, { type Project } from '../models/projects'
import taskAssignmentsModel from '../models/taskAssignments'
import taskSubmissionsModel, {
  type TaskSubmission,
} from '../models/taskSubmissions'
import plansModel, { type Plan } from '../models/plans'
import planMilestonesModel, {
  type PlanMilestone,
} from '../models/planMilestones'
import storageService from './storageService'
import { PaginationParams, paginatedResponse } from '../utils/pagination'

// All lookups key on the caller's user id, which is also the interns PK
// (interns.user_id) and the FK target for project/task/plan links — so an
// intern only ever sees their own rows.

function getProfile(userId: number): Promise<InternWithUser | undefined> {
  return internsModel.findById(userId)
}

function listProjects(userId: number): Promise<Project[]> {
  return projectsModel.findByIntern(userId)
}

async function listTasks(userId: number, pagination: PaginationParams) {
  const { rows, total } = await taskAssignmentsModel.listTasksForIntern(
    userId,
    pagination
  )
  return paginatedResponse(rows, total, pagination)
}

// file_url holds one or more comma-separated stored URLs; swap each for a
// short-lived presigned download URL so the intern can fetch their own files.
async function withSignedUrls(
  submission: TaskSubmission
): Promise<TaskSubmission> {
  if (!submission.file_url) return submission
  const signedUrls = await Promise.all(
    submission.file_url.split(',').map((url) => {
      const fileKey = url.split('/').pop() || url
      return storageService.GetFilefromS3(fileKey)
    })
  )
  return { ...submission, file_url: signedUrls.join(',') }
}

async function listSubmissions(userId: number): Promise<TaskSubmission[]> {
  const submissions = await taskSubmissionsModel.findByIntern(userId)
  return Promise.all(submissions.map(withSignedUrls))
}

interface PlanWithMilestones extends Plan {
  milestones: PlanMilestone[]
}

async function listPlans(userId: number): Promise<PlanWithMilestones[]> {
  const plans = await plansModel.findByIntern(userId)
  return Promise.all(
    plans.map(async (plan) => ({
      ...plan,
      milestones: await planMilestonesModel.findByPlan(plan.id),
    }))
  )
}

export default {
  getProfile,
  listProjects,
  listTasks,
  listSubmissions,
  listPlans,
}
</file>

<file path="src/services/notificationService.ts">
export default {}
</file>

<file path="src/services/permissionOverrideService.ts">
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
</file>

<file path="src/services/permissionService.test.ts">
import { test, before, after } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app'
import knex from '../../db'

const api = supertest.agent(app)

after(() => knex.destroy())

before(async () => {
  await api
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password' })
    .expect(200)
})

test('admin gets all 10 seeded permissions by default', async () => {
  const response = await api.get('/api/auth/me').expect(200)

  assert.equal(response.body.permissions.length, 10)
  assert.ok(response.body.permissions.includes('manage_projects'))
})

test('a revoke override removes a permission the role would otherwise have', async () => {
  const admin = await knex('users').where({ username: 'admin' }).first()
  const permission = await knex('permissions')
    .where({ key: 'manage_projects' })
    .first()

  await knex('user_permission_overrides').insert({
    user_id: admin.id,
    permission_id: permission.id,
    effect: 'revoke',
  })

  try {
    const response = await api.get('/api/auth/me').expect(200)
    assert.ok(!response.body.permissions.includes('manage_projects'))
  } finally {
    await knex('user_permission_overrides')
      .where({ user_id: admin.id, permission_id: permission.id })
      .del()
  }
})
</file>

<file path="src/services/permissionService.ts">
import permissionsModel from '../models/permissions'

// Effective permissions = role defaults, with per-user overrides applied on
// top ('grant' adds a key even if the role doesn't have it, 'revoke' removes
// one even if the role does).
export async function resolveEffectivePermissions(
  userId: number,
  roleId: number
): Promise<string[]> {
  const [defaults, overrides] = await Promise.all([
    permissionsModel.getRoleDefaultKeys(roleId),
    permissionsModel.getUserOverrides(userId),
  ])

  const effective = new Set(defaults)

  for (const { key, effect } of overrides) {
    if (effect === 'grant') {
      effective.add(key)
    } else {
      effective.delete(key)
    }
  }

  return Array.from(effective)
}

export async function userHasPermission(
  userId: number,
  roleId: number,
  key: string
): Promise<boolean> {
  const effective = await resolveEffectivePermissions(userId, roleId)
  return effective.includes(key)
}
</file>

<file path="src/services/planService.ts">
import plansModel, { type Plan } from '../models/plans'
import planMilestonesModel, {
  type PlanMilestone,
} from '../models/planMilestones'
import { ValidationError } from '../errors/AppError'
import { PaginationParams, paginatedResponse } from '../utils/pagination'

export { ValidationError }

const VALID_MILESTONE_STATUSES = ['not_started', 'in_progress', 'completed']

export interface PlanMilestoneInput {
  title: string
  due_date?: string
  status?: string
  sort_order?: number
}

function assertValidMilestoneStatus(status: string | undefined): void {
  if (status !== undefined && !VALID_MILESTONE_STATUSES.includes(status)) {
    throw new ValidationError(
      `status must be one of: ${VALID_MILESTONE_STATUSES.join(', ')}`
    )
  }
}

export interface PlanInput {
  intern_id: number
  title: string
  description?: string
  start_date?: string
  end_date?: string
}

function assertValid(input: PlanInput): void {
  if (!input.intern_id) {
    throw new ValidationError('intern_id is required')
  }
  if (!input.title || !input.title.trim()) {
    throw new ValidationError('title is required')
  }
}

function listPlans(internId?: number): Promise<Plan[]> {
  return internId ? plansModel.findByIntern(internId) : plansModel.findAll()
}

export async function listPlansForIntern(
  internId: number,
  pagination: PaginationParams
) {
  const { rows, total } = await plansModel.listPaginatedByIntern(
    internId,
    pagination
  )
  return paginatedResponse(rows, total, pagination)
}

function getPlan(id: number): Promise<Plan | undefined> {
  return plansModel.findById(id)
}

function createPlan(input: PlanInput, createdBy: number): Promise<Plan> {
  assertValid(input)
  return plansModel.create({
    intern_id: input.intern_id,
    title: input.title.trim(),
    description: input.description?.trim(),
    start_date: input.start_date,
    end_date: input.end_date,
    created_by: createdBy,
  })
}

function updatePlan(
  id: number,
  input: Partial<
    Pick<PlanInput, 'title' | 'description' | 'start_date' | 'end_date'>
  >
): Promise<Plan | undefined> {
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  return plansModel.update(id, input)
}

async function deletePlan(id: number): Promise<boolean> {
  const deletedCount = await plansModel.remove(id)
  return deletedCount > 0
}

function listMilestones(planId: number): Promise<PlanMilestone[]> {
  return planMilestonesModel.findByPlan(planId)
}

function createMilestone(
  planId: number,
  input: PlanMilestoneInput
): Promise<PlanMilestone> {
  if (!input.title || !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertValidMilestoneStatus(input.status)
  return planMilestonesModel.create({
    plan_id: planId,
    title: input.title.trim(),
    due_date: input.due_date,
    status: input.status as PlanMilestone['status'] | undefined,
    sort_order: input.sort_order,
  })
}

function updateMilestone(
  id: number,
  input: Partial<PlanMilestoneInput>
): Promise<PlanMilestone | undefined> {
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertValidMilestoneStatus(input.status)
  return planMilestonesModel.update(id, {
    ...input,
    status: input.status as PlanMilestone['status'] | undefined,
  })
}

async function deleteMilestone(id: number): Promise<boolean> {
  const deletedCount = await planMilestonesModel.remove(id)
  return deletedCount > 0
}

export default {
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  listMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
}
</file>

<file path="src/services/projectService.ts">
import knex from '../../db'
import projectsModel, { type Project } from '../models/projects'
import projectInternsModel, {
  type ProjectIntern,
  DuplicateAssignmentError,
  InvalidReferenceError,
} from '../models/projectInterns'
import taskAssignmentsModel from '../models/taskAssignments'
import { ValidationError } from '../errors/AppError'

export { DuplicateAssignmentError, InvalidReferenceError }

export { ValidationError }

const VALID_STATUSES = ['active', 'on_hold', 'completed', 'cancelled']

export interface ProjectInput {
  name: string
  description?: string
  start_date?: string
  end_date?: string
  status?: string
}

function assertValid(input: ProjectInput): void {
  if (!input.name || !input.name.trim()) {
    throw new ValidationError('name is required')
  }
  if (input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
    throw new ValidationError(
      `status must be one of: ${VALID_STATUSES.join(', ')}`
    )
  }
}

function listProjects(): Promise<Project[]> {
  return projectsModel.findAll()
}

function getProject(id: number): Promise<Project | undefined> {
  return projectsModel.findById(id)
}

function createProject(
  input: ProjectInput,
  createdBy: number
): Promise<Project> {
  assertValid(input)
  return projectsModel.create({
    name: input.name.trim(),
    description: input.description?.trim(),
    start_date: input.start_date,
    end_date: input.end_date,
    status: input.status as Project['status'] | undefined,
    created_by: createdBy,
  })
}

function updateProject(
  id: number,
  input: Partial<ProjectInput>
): Promise<Project | undefined> {
  if (input.name !== undefined && !input.name.trim()) {
    throw new ValidationError('name is required')
  }
  if (input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
    throw new ValidationError(
      `status must be one of: ${VALID_STATUSES.join(', ')}`
    )
  }
  return projectsModel.update(id, {
    ...input,
    status: input.status as Project['status'] | undefined,
  })
}

async function deleteProject(id: number): Promise<boolean> {
  const deletedCount = await projectsModel.remove(id)
  return deletedCount > 0
}

function listInterns(projectId: number): Promise<ProjectIntern[]> {
  return projectInternsModel.findByProject(projectId)
}

function assignIntern(
  projectId: number,
  internId: number
): Promise<ProjectIntern> {
  return projectInternsModel.assign(projectId, internId)
}

async function removeIntern(
  projectId: number,
  internId: number
): Promise<boolean> {
  return knex.transaction(async (trx) => {
    await taskAssignmentsModel.removeByProjectAndIntern(
      projectId,
      internId,
      trx
    )
    const deletedCount = await projectInternsModel.unassign(
      projectId,
      internId,
      trx
    )
    return deletedCount > 0
  })
}

export default {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listInterns,
  assignIntern,
  removeIntern,
}
</file>

<file path="src/services/storageService.ts">
import dotenv from 'dotenv';
//hani s3 imports 
import  { PutObjectCommand , GetObjectCommand } from '@aws-sdk/client-s3'
import { s3Client_First , s3Client_Second } from '../config/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
dotenv.config();

//hani s3 service upload files
async function uploadFiletoS3(files:Express.Multer.File[]):Promise<string[]>{
const bucketName = process.env.IDRIVE_E2_BUCKET_NAME_SECOND;
const endpoint = process.env.IDRIVE_E2_ENDPOINT;
if(!bucketName){
    throw new Error('IDRIVE_E2_BUCKET_NAME is not defined in environment variables.');
}
const uploadPromise = files.map(async(file) => {
const fileName = `${Date.now()}--${file.originalname}`;
const command = new PutObjectCommand({
    Bucket:bucketName,
    Key : fileName,
    Body: file.buffer,
    ContentType:file.mimetype,
});
await s3Client_Second.send(command);
return `${endpoint}/${bucketName}/${fileName}`;
});
return Promise.all(uploadPromise);
}

//hani s3 service get files
async function GetFilefromS3(file:string):Promise<string>{
const bucketName = process.env.IDRIVE_E2_BUCKET_NAME_SECOND;

if(!bucketName){
    throw new Error('IDRIVE_E2_BUCKET_NAME is not defined in environment variables.');
}
const fileName = file;
const command = new GetObjectCommand({
    Bucket:bucketName,
    Key : fileName,
});
const downloadUrl = await getSignedUrl(s3Client_Second,command,{ expiresIn: 3600 });
return downloadUrl;
}

export default {
uploadFiletoS3,
GetFilefromS3
};
</file>

<file path="src/services/taskService.ts">
import tasksModel, { type Task } from '../models/tasks'
import taskAssignmentsModel, {
  type TaskAssignment,
  DuplicateAssignmentError,
  InvalidReferenceError,
} from '../models/taskAssignments'
import projectInternsModel from '../models/projectInterns'
import { AppError, ValidationError } from '../errors/AppError'
import { ErrorCode } from '../errors/errorCodes'
import { InternNotOnProjectError } from '../errors/assignmentErrors'

export { DuplicateAssignmentError, InvalidReferenceError }
export { InternNotOnProjectError }

export class TaskNotFoundError extends AppError {
  constructor() {
    super(404, ErrorCode.TASK_NOT_FOUND, 'Task not found')
  }
}

export { ValidationError }

const VALID_PRIORITIES = ['low', 'medium', 'high']
const VALID_STATUSES = [
  'not_started',
  'in_progress',
  'submitted',
  'approved',
  'rejected',
]

export interface TaskInput {
  project_id?: number
  title: string
  description?: string
  priority?: string
  due_date?: string
  status?: string
}

function assertValidCreate(input: TaskInput): void {
  if (!input.title || !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertValidPriorityAndStatus(input)
}

function assertValidPriorityAndStatus(
  input: Pick<TaskInput, 'priority' | 'status'>
): void {
  if (
    input.priority !== undefined &&
    !VALID_PRIORITIES.includes(input.priority)
  ) {
    throw new ValidationError(
      `priority must be one of: ${VALID_PRIORITIES.join(', ')}`
    )
  }
  if (input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
    throw new ValidationError(
      `status must be one of: ${VALID_STATUSES.join(', ')}`
    )
  }
}

function listTasks(): Promise<Task[]> {
  return tasksModel.findAll()
}

function getTask(id: number): Promise<Task | undefined> {
  return tasksModel.findById(id)
}

function createTask(input: TaskInput, createdBy: number): Promise<Task> {
  assertValidCreate(input)
  return tasksModel.create({
    project_id: input.project_id,
    title: input.title.trim(),
    description: input.description?.trim(),
    priority: input.priority as Task['priority'] | undefined,
    due_date: input.due_date,
    status: input.status as Task['status'] | undefined,
    created_by: createdBy,
  })
}

function updateTask(
  id: number,
  input: Partial<TaskInput>
): Promise<Task | undefined> {
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError('title is required')
  }
  assertValidPriorityAndStatus(input)
  return tasksModel.update(id, {
    ...input,
    priority: input.priority as Task['priority'] | undefined,
    status: input.status as Task['status'] | undefined,
  })
}

async function deleteTask(id: number): Promise<boolean> {
  const deletedCount = await tasksModel.remove(id)
  return deletedCount > 0
}

function listAssignments(taskId: number): Promise<TaskAssignment[]> {
  return taskAssignmentsModel.findByTask(taskId)
}

async function assignIntern(
  taskId: number,
  internId: number
): Promise<TaskAssignment> {
  const task = await tasksModel.findById(taskId)
  if (!task) throw new TaskNotFoundError()

  if (task.project_id !== null) {
    const membership = await projectInternsModel.find(task.project_id, internId)
    if (!membership) throw new InternNotOnProjectError()
  }

  return taskAssignmentsModel.assign(taskId, internId)
}

async function removeIntern(
  taskId: number,
  internId: number
): Promise<boolean> {
  const deletedCount = await taskAssignmentsModel.unassign(taskId, internId)
  return deletedCount > 0
}

export default {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  listAssignments,
  assignIntern,
  removeIntern,
}
</file>

<file path="src/services/taskSubmissionService.ts">
import knex from '../../db'
import taskSubmissionsModel, {
  type TaskSubmission,
} from '../models/taskSubmissions'
import tasksModel from '../models/tasks'

import storageService from './storageService'

import taskAssignmentsModel from '../models/taskAssignments'
import activityLogsModel from '../models/activityLogs'
import { ValidationError } from '../errors/AppError'
import { TaskNotFoundError } from './taskService'
import {
  TaskNotAssignedError,
  SubmissionNotAllowedError,
} from '../errors/submissionErrors'

export { ValidationError, TaskNotFoundError, TaskNotAssignedError }
export { SubmissionNotAllowedError }
export class InvalidReviewStateError extends Error {}



export interface SubmissionInput {
  task_id: number
  note?: string
  files?: Express.Multer.File[] | null

}

function assertValid(input: SubmissionInput): void {
  if (!input.task_id) {
    throw new ValidationError('task_id is required')
  }

  if (!input.note?.trim() && (!input.files || input.files.length === 0)) {
    throw new ValidationError('note or file is required')
}
}

function listByTask(taskId: number): Promise<TaskSubmission[]> {
  return taskSubmissionsModel.findByTask(taskId)
}


async function getSubmission(id: number): Promise<TaskSubmission | undefined> {
  const submission = await taskSubmissionsModel.findById(id)
  if (!submission || !submission.file_url) return submission

 
  const fileKey = submission.file_url.split('/').pop() || submission.file_url


  const presignedUrl = await storageService.GetFilefromS3(fileKey)
  return { ...submission, file_url: presignedUrl }

}

async function createSubmission(
  input: SubmissionInput,
  internId: number
): Promise<TaskSubmission> {
  assertValid(input)

  const task = await tasksModel.findById(input.task_id)
  if (!task) throw new TaskNotFoundError()

  const assignment = await taskAssignmentsModel.find(input.task_id, internId)
  if (!assignment) throw new TaskNotAssignedError()

  const priorSubmissions = await taskSubmissionsModel.findByTask(
    input.task_id
  )
  const latest = priorSubmissions.find((s) => s.intern_id === internId)
  if (
    latest &&
    (latest.review_status === 'pending' || latest.review_status === 'approved')
  ) {
    throw new SubmissionNotAllowedError()
  }


 
  let uploadedUrls: string[] = []
  if (input.files && input.files.length > 0) {
    uploadedUrls = await storageService.uploadFiletoS3(input.files)
  }


  const fileUrlData = uploadedUrls.length > 0 ? uploadedUrls.join(',') : null



  return knex.transaction(async (trx) => {
    const submission = await taskSubmissionsModel.create(
      {
        task_id: input.task_id,
        intern_id: internId,
        note: input.note?.trim(),
        file_url: fileUrlData,

      },
      trx
    )

    await tasksModel.update(input.task_id, { status: 'submitted' }, trx)

    return submission
  })
}

async function reviewSubmission(
  id: number,
  status: 'approved' | 'rejected',
  comment: string | undefined,
  reviewedBy: number
): Promise<TaskSubmission | undefined> {
  const submission = await taskSubmissionsModel.findById(id)
  if (!submission) return undefined

  if (submission.review_status !== 'pending') {
    throw new InvalidReviewStateError('submission has already been reviewed')
  }

  return knex.transaction(async (trx) => {
    const updated = await taskSubmissionsModel.review(
      id,
      {
        review_status: status,
        review_comment: comment?.trim(),
        reviewed_by: reviewedBy,
      },
      trx
    )

    await tasksModel.update(submission.task_id, { status }, trx)

    await activityLogsModel.create(
      {
        intern_id: submission.intern_id,
        actor_id: reviewedBy,
        action_type: `task_submission_${status}`,
        entity_type: 'task_submissions',
        entity_id: id,
      },
      trx
    )

    return updated
  })
}

export default {
  listByTask,
  getSubmission,
  createSubmission,
  reviewSubmission,

}
</file>

<file path="src/services/universityService.ts">
import universitiesModel, { type University } from '../models/universities'
import { PaginationParams, paginatedResponse } from '../utils/pagination'
import type {
  CreateUniversityBody,
  UpdateUniversityBody,
} from '../schemas/universitySchemas'

export async function listUniversities(
  pagination: PaginationParams,
  filters: { includeInactive?: boolean } = {}
) {
  const { rows, total } = await universitiesModel.list(pagination, filters)
  return paginatedResponse(rows, total, pagination)
}

function getUniversity(id: number): Promise<University | undefined> {
  return universitiesModel.findById(id)
}

function createUniversity(input: CreateUniversityBody): Promise<University> {
  return universitiesModel.create({
    name: input.name,
    country: input.country,
  })
}

function updateUniversity(
  id: number,
  input: UpdateUniversityBody
): Promise<University | undefined> {
  return universitiesModel.update(id, input)
}

async function deactivateUniversity(id: number): Promise<boolean> {
  const updatedCount = await universitiesModel.setActive(id, false)
  return updatedCount > 0
}

export default {
  listUniversities,
  getUniversity,
  createUniversity,
  updateUniversity,
  deactivateUniversity,
}
</file>

<file path="src/services/userService.ts">
import bcrypt from 'bcrypt'
import usersModel, { type User } from '../models/users'

const SALT_ROUNDS = 10

export type SafeUser = Omit<User, 'password_hash'>

function toSafeUser(user: User): SafeUser {
  const { password_hash: _password_hash, ...safeUser } = user
  return safeUser
}

export interface CreateUserInput {
  full_name: string
  username: string
  password: string
  role_id: number
  email?: string
  phone?: string
  created_by?: number
}

// Admin-only: creates a new user account (admin, mentor, doctor, or intern).
async function createUser(input: CreateUserInput): Promise<SafeUser> {
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS)
  const user = await usersModel.createUser({
    full_name: input.full_name,
    username: input.username,
    password_hash,
    role_id: input.role_id,
    email: input.email,
    phone: input.phone,
    created_by: input.created_by,
  })
  return toSafeUser(user)
}

// Used by the login endpoint — returns the user if the password matches, null otherwise.
async function verifyCredentials(
  username: string,
  password: string
): Promise<SafeUser | null> {
  const user = await usersModel.findByUsername(username)
  if (!user || !user.is_active) return null

  const passwordMatches = await bcrypt.compare(password, user.password_hash)
  if (!passwordMatches) return null

  return toSafeUser(user)
}

async function findById(id: number): Promise<SafeUser | null> {
  const user = await usersModel.findById(id)
  return user ? toSafeUser(user) : null
}

// Admin-only: changes a user's username. Does not touch the password.
async function updateUsername(id: number, username: string): Promise<void> {
  await usersModel.updateUsername(id, username)
}

// Admin-only: changes a user's password. There is no self-service password change.
async function updatePassword(id: number, newPassword: string): Promise<void> {
  const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await usersModel.updatePasswordHash(id, password_hash)
}

async function setActive(id: number, isActive: boolean): Promise<boolean> {
  const updatedCount = await usersModel.setActive(id, isActive)
  return updatedCount > 0
}

export default {
  createUser,
  verifyCredentials,
  findById,
  updateUsername,
  updatePassword,
  setActive,
}
</file>

<file path="src/socket/io.ts">
export default {}
</file>

<file path="src/types/express.d.ts">
export interface AuthenticatedUser {
  id: number
  username: string
  roleId: number
  roleName: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
      validatedQuery?: Record<string, unknown>
    }
  }
}

export {}
</file>

<file path="src/utils/config.ts">
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const PORT = process.env.PORT || 4000

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

const JWT_SECRET = requireEnv('JWT_SECRET')
const JWT_REFRESH_SECRET = requireEnv('JWT_REFRESH_SECRET')

export { PORT, JWT_SECRET, JWT_REFRESH_SECRET }
</file>

<file path="src/utils/cookies.ts">
import type { Response } from 'express'

const isProduction = process.env.NODE_ENV === 'production'

const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

function setAccessCookie(res: Response, accessToken: string): void {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    path: '/',
  })
}

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  setAccessCookie(res, accessToken)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    path: '/',
  })
}

function clearAuthCookies(res: Response): void {
  res.clearCookie('access_token', { path: '/' })
  res.clearCookie('refresh_token', { path: '/' })
}

export { setAccessCookie, setAuthCookies, clearAuthCookies }
</file>

<file path="src/utils/filenames.ts">
export default {}
</file>

<file path="src/utils/pagination.ts">
import { Request } from 'express'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export function parsePagination(req: Request): PaginationParams {
  const rawPage = Number(req.query.page)
  const rawLimit = Number(req.query.limit)

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
  const limit =
    Number.isInteger(rawLimit) && rawLimit > 0
      ? Math.min(rawLimit, MAX_LIMIT)
      : DEFAULT_LIMIT

  return { page, limit, offset: (page - 1) * limit }
}

export interface PaginatedResult<T> {
  data: T[]
  page: number
  limit: number
  total: number
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return { data, page: params.page, limit: params.limit, total }
}
</file>

<file path="src/app.ts">
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes'
import universityRoutes from './routes/universityRoutes'
import doctorRoutes from './routes/doctorRoutes'
import doctorPortalRoutes from './routes/doctorPortalRoutes'
import mentorRoutes from './routes/mentorRoutes'
import internRoutes from './routes/internRoutes'
import projectRoutes from './routes/projectRoutes'
import taskRoutes from './routes/taskRoutes'
import taskSubmissionRoutes from './routes/taskSubmissionRoutes'
import planRoutes from './routes/planRoutes'
import meRoutes from './routes/meRoutes'
import attendanceRoutes from './routes/attendanceRoutes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' })
})

app.use('/api/auth', authRoutes)
app.use('/api/universities', universityRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/doctor', doctorPortalRoutes)
app.use('/api/mentors', mentorRoutes)
app.use('/api/interns', internRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/task-submissions', taskSubmissionRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/me', meRoutes)
app.use('/api' , attendanceRoutes)
app.use(errorHandler)

export default app
</file>

<file path="src/server.ts">
import app from './app'
import { PORT } from './utils/config'

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
</file>

<file path=".env.example">
DATABASE_URL=postgres://user:password@localhost:5432/db_name
PORT=3001
JWT_SECRET=                        
JWT_REFRESH_SECRET=                
IDRIVE_E2_ENDPOINT=                
IDRIVE_E2_REGION=
IDRIVE_E2_BUCKET_NAME=
IDRIVE_E2_KEY_ID=
IDRIVE_E2_SECRET_ACCESS_KEY=
IDRIVE_E2_BUCKET_NAME_SECOND = 
IDRIVE_E2_KEY_ID_SECOND=
IDRIVE_E2_SECRET_ACCESS_KEY_SECOND=
</file>

<file path=".gitignore">
.env 
node_modules
</file>

<file path="db.ts">
import knexLib from 'knex'
import knexConfig from './knexfile'

const knex = knexLib(knexConfig)

export default knex
</file>

<file path="eslint.config.mjs">
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      eqeqeq: 'error',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  // Turns off any stylistic rules above that would fight with Prettier.
  eslintConfigPrettier
)
</file>

<file path="knexfile.ts">
import type { Knex } from 'knex'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './database/migrations',
  },
  seeds: {
    directory: './database/seeds',
  },
}

export default config
</file>

<file path="package.json">
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "dist/src/server.js",
  "scripts": {
    "start": "node dist/src/server.js",
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "migrate": "knex migrate:latest",
    "migrate:make": "knex migrate:make",
    "seed": "knex seed:run",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "node --import tsx --test"
  },
  "keywords": [],
  "type": "commonjs",
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1121.0",
    "@aws-sdk/s3-request-presigner": "^3.1127.0",
    "@types/bcrypt": "^6.0.0",
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "knex": "^3.3.0",
    "multer": "^2.3.0",
    "pg": "^8.23.0",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/cookie-parser": "^1.4.10",
    "@types/cors": "^2.8.19",
    "@types/dotenv": "^6.1.1",
    "@types/express": "^5.0.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/multer": "^2.2.0",
    "@types/node": "^26.4.0",
    "@types/supertest": "^7.2.1",
    "eslint": "^10.8.1",
    "eslint-config-prettier": "^10.1.8",
    "prettier": "^3.9.6",
    "supertest": "^7.2.2",
    "ts-node": "^10.9.2",
    "tsx": "^4.23.12",
    "typescript": "^6.0.3",
    "typescript-eslint": "^8.67.0"
  },
  "allowScripts": {
    "bcrypt@6.0.0": true,
    "esbuild@0.28.2": true
  }
}
</file>

<file path="tsconfig.json">
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    "rootDir": ".",
    "outDir": "dist",

    // Environment Settings — plain CommonJS to match this project's package.json
    // "type": "commonjs" (matches the FSO Part 3-5 backend convention).
    "module": "commonjs",
    "target": "es2022",
    "types": ["node"],
    "esModuleInterop": true,

    // Other Outputs
    "sourceMap": true,

    // Recommended Options
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
</file>

</files>

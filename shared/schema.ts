import { pgTable, varchar, timestamp, boolean, integer, text, json } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: varchar('id').primaryKey().notNull(),
  username: varchar('username').unique().notNull(),
  password: varchar('password').notNull(),
  role: varchar('role').notNull(), // 'ADMIN' or 'EMPLOYEE'
  title: varchar('title').notNull(),
  nickname: varchar('nickname').notNull(),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  email: varchar('email').unique().notNull(),
  phone: varchar('phone').notNull(),
  position: varchar('position').notNull(),
  profilePicture: varchar('profile_picture'),
  address: text('address'),
  socialMedia: varchar('social_media'),
  lineUserId: varchar('line_user_id'),
  gender: varchar('gender').notNull(), // 'MALE' or 'FEMALE'
  leaveBalances: json('leave_balances').$type<{
    accumulated: number;
    sick: number;
    maternity: number;
    paternity: number;
    personal: number;
    vacation: number;
    ordination: number;
    military: number;
    study: number;
    international: number;
    spouse: number;
  }>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leave requests table
export const leaveRequests = pgTable('leave_requests', {
  id: varchar('id').primaryKey().notNull(),
  userId: varchar('user_id').notNull(),
  employeeName: varchar('employee_name').notNull(),
  leaveType: varchar('leave_type').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalDays: integer('total_days').notNull(),
  reason: text('reason').notNull(),
  contactNumber: varchar('contact_number').notNull(),
  status: varchar('status').notNull(), // 'รอพิจารณา', 'อนุมัติ', 'ปฏิเสธ'
  requestDate: timestamp('request_date').defaultNow().notNull(),
  approvedBy: varchar('approved_by'),
  approvedDate: timestamp('approved_date'),
  documentUrl: varchar('document_url'), // For sick leave documents
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Sessions table for authentication
export const sessions = pgTable('sessions', {
  sid: varchar('sid').primaryKey(),
  sess: json('sess').notNull(),
  expire: timestamp('expire').notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role', { enum: ['superadmin', 'manager', 'editor', 'viewer'] }).default('superadmin'),
  permissions: text('permissions'), // JSON string of specific permissions
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  type: text('type').notNull(), // job_category, tender_category, announcement_category, location, industry, education_level, employment_type
  description: text('description'),
  icon: text('icon'),
  displayOrder: integer('display_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  logo: text('logo'),
  industryId: integer('industry_id'), // Refers to categories table
  locationId: integer('location_id'), // Refers to categories table
  description: text('description'),
  website: text('website'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  companyId: integer('company_id').references(() => companies.id).notNull(),
  categoryId: integer('category_id').notNull(), // Refers to categories table
  locationId: integer('location_id').notNull(), // Refers to categories table
  employmentTypeId: integer('employment_type_id').notNull(), // Refers to categories table
  educationLevelId: integer('education_level_id').notNull(), // Refers to categories table
  experience: text('experience').notNull(),
  vacancies: integer('vacancies').default(1),
  description: text('description').notNull(),
  responsibilities: text('responsibilities'),
  requirements: text('requirements'),
  skills: text('skills'),
  applicationInstructions: text('application_instructions'),
  requiredDocuments: text('required_documents'),
  applicationLink: text('application_link'),
  status: text('status', { enum: ['draft', 'pending', 'published', 'expired', 'archived'] }).default('published'),
  isFeatured: boolean('is_featured').default(false),
  publicationDate: timestamp('publication_date').defaultNow(),
  deadline: timestamp('deadline').notNull(),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tenders = pgTable('tenders', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  institution: text('institution').notNull(),
  referenceNumber: text('reference_number'),
  categoryId: integer('category_id').notNull(), // Refers to categories table
  locationId: integer('location_id').notNull(), // Refers to categories table
  description: text('description').notNull(),
  eligibilityRequirements: text('eligibility_requirements'),
  requiredDocuments: text('required_documents'),
  submissionInstructions: text('submission_instructions'),
  officialSourceLink: text('official_source_link'),
  contactDetails: text('contact_details'),
  status: text('status', { enum: ['draft', 'published', 'expired', 'awarded', 'closed'] }).default('published'),
  publicationDate: timestamp('publication_date').defaultNow(),
  deadline: timestamp('deadline').notNull(),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  categoryId: integer('category_id').notNull(), // Refers to categories table
  description: text('description').notNull(),
  officialSourceLink: text('official_source_link'),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('published'),
  publicationDate: timestamp('publication_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const audit_logs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').references(() => users.id),
  adminName: text('admin_name'),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: integer('entity_id'),
  details: text('details'),
  result: text('result'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const website_settings = pgTable('website_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(), // JSON string for complex objects
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
}));


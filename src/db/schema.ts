import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role', { enum: ['admin', 'superadmin'] }).default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  logo: text('logo'),
  industry: text('industry'),
  location: text('location'),
  website: text('website'),
  about: text('about'),
  contactDetails: text('contact_details'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  companyId: integer('company_id').references(() => companies.id).notNull(),
  category: text('category').notNull(),
  location: text('location').notNull(),
  employmentType: text('employment_type').notNull(),
  educationLevel: text('education_level').notNull(),
  experience: text('experience').notNull(),
  vacancies: integer('vacancies').default(1),
  description: text('description').notNull(),
  responsibilities: text('responsibilities'),
  requirements: text('requirements'),
  skills: text('skills'),
  applicationInstructions: text('application_instructions'),
  requiredDocuments: text('required_documents'),
  applicationLink: text('application_link'), // URL or Email
  isFeatured: boolean('is_featured').default(false),
  isPublished: boolean('is_published').default(true),
  publicationDate: timestamp('publication_date').defaultNow(),
  deadline: timestamp('deadline').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tenders = pgTable('tenders', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  institution: text('institution').notNull(),
  referenceNumber: text('reference_number'),
  category: text('category').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  eligibilityRequirements: text('eligibility_requirements'),
  requiredDocuments: text('required_documents'),
  submissionInstructions: text('submission_instructions'),
  officialSourceLink: text('official_source_link'),
  contactDetails: text('contact_details'),
  isPublished: boolean('is_published').default(true),
  publicationDate: timestamp('publication_date').defaultNow(),
  deadline: timestamp('deadline').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // scholarship, training, recruitment, etc.
  description: text('description').notNull(),
  officialSourceLink: text('official_source_link'),
  isPublished: boolean('is_published').default(true),
  publicationDate: timestamp('publication_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
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

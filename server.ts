import express from 'express';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import { jobs, companies, tenders, announcements, users, categories, audit_logs, website_settings } from './src/db/schema.ts';
import { eq, desc, and, ilike, or, sql, count } from 'drizzle-orm';
import { requireAdmin, AuthRequest } from './src/middleware/auth.ts';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for audit logs
async function logAction(adminId: number | null, adminName: string | null, action: string, entityType?: string, entityId?: number, details?: string) {
  try {
    await db.insert(audit_logs).values({
      adminId,
      adminName,
      action,
      entityType,
      entityId,
      details,
      result: 'success'
    });
  } catch (err) {
    console.error('Failed to log action:', err);
  }
}

async function createServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  
  // Public - Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const type = req.query.type as string;
      const conditions = [eq(categories.isActive, true)];
      if (type) conditions.push(eq(categories.type, type));
      
      const results = await db.select().from(categories).where(and(...conditions)).orderBy(categories.displayOrder);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Public - Jobs
  app.get('/api/jobs', async (req, res) => {
    try {
      const { categoryId, typeId, locationId, search, limit } = req.query;
      
      const conditions: (any)[] = [eq(jobs.status, 'published')];
      
      if (categoryId) conditions.push(eq(jobs.categoryId, parseInt(categoryId as string)));
      if (typeId) conditions.push(eq(jobs.employmentTypeId, parseInt(typeId as string)));
      if (locationId) conditions.push(eq(jobs.locationId, parseInt(locationId as string)));
      if (search) {
        conditions.push(or(
          ilike(jobs.title, `%${search}%`),
          ilike(companies.name, `%${search}%`)
        ));
      }

      let query = db.select({
        job: jobs,
        company: companies,
        category: categories,
        location: sql`loc.name`.as('location_name'),
        type: sql`type.name`.as('type_name')
      })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .innerJoin(categories, eq(jobs.categoryId, categories.id))
      .innerJoin(sql`categories loc`, eq(jobs.locationId, sql`loc.id`))
      .innerJoin(sql`categories type`, eq(jobs.employmentTypeId, sql`type.id`))
      .where(and(...conditions))
      .orderBy(desc(jobs.publicationDate));

      if (limit) {
        const results = await query.limit(parseInt(limit as string));
        res.json(results);
      } else {
        const results = await query;
        res.json(results);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const result = await db.select({
        job: jobs,
        company: companies,
        category: sql`cat.name`.as('category_name'),
        location: sql`loc.name`.as('location_name'),
        type: sql`type.name`.as('type_name'),
        level: sql`lev.name`.as('level_name')
      })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .innerJoin(sql`categories cat`, eq(jobs.categoryId, sql`cat.id`))
      .innerJoin(sql`categories loc`, eq(jobs.locationId, sql`loc.id`))
      .innerJoin(sql`categories type`, eq(jobs.employmentTypeId, sql`type.id`))
      .innerJoin(sql`categories lev`, eq(jobs.educationLevelId, sql`lev.id`))
      .where(eq(jobs.id, parseInt(req.params.id)));
      
      if (result.length === 0) return res.status(404).json({ error: 'Job not found' });
      
      await db.update(jobs).set({ viewCount: sql`${jobs.viewCount} + 1` }).where(eq(jobs.id, parseInt(req.params.id)));
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  });

  // Public - Tenders
  app.get('/api/tenders', async (req, res) => {
    try {
      const { limit } = req.query;
      let query = db.select({
        id: tenders.id,
        title: tenders.title,
        institution: tenders.institution,
        referenceNumber: tenders.referenceNumber,
        category: sql`cat.name`.as('category'),
        location: sql`loc.name`.as('location'),
        publicationDate: tenders.publicationDate,
        deadline: tenders.deadline,
        status: tenders.status
      })
      .from(tenders)
      .innerJoin(sql`categories cat`, eq(tenders.categoryId, sql`cat.id`))
      .innerJoin(sql`categories loc`, eq(tenders.locationId, sql`loc.id`))
      .where(eq(tenders.status, 'published'))
      .orderBy(desc(tenders.publicationDate));

      if (limit) {
        const results = await query.limit(parseInt(limit as string));
        res.json(results);
      } else {
        const results = await query;
        res.json(results);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch tenders' });
    }
  });

  // Public - Announcements
  app.get('/api/announcements', async (req, res) => {
    try {
      const { limit } = req.query;
      let query = db.select({
        id: announcements.id,
        title: announcements.title,
        description: announcements.description,
        category: sql`cat.name`.as('category'),
        officialSourceLink: announcements.officialSourceLink,
        publicationDate: announcements.publicationDate,
        status: announcements.status
      })
      .from(announcements)
      .innerJoin(sql`categories cat`, eq(announcements.categoryId, sql`cat.id`))
      .where(eq(announcements.status, 'published'))
      .orderBy(desc(announcements.publicationDate));

      if (limit) {
        const results = await query.limit(parseInt(limit as string));
        res.json(results);
      } else {
        const results = await query;
        res.json(results);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  // Public - Companies
  app.get('/api/companies', async (req, res) => {
    try {
      const results = await db.select({
        id: companies.id,
        name: companies.name,
        logo: companies.logo,
        about: companies.description,
        website: companies.website,
        email: companies.email,
        phone: companies.phone,
        address: companies.address,
        industry: sql`ind.name`.as('industry'),
        location: sql`loc.name`.as('location')
      })
      .from(companies)
      .leftJoin(sql`categories ind`, eq(companies.industryId, sql`ind.id`))
      .leftJoin(sql`categories loc`, eq(companies.locationId, sql`loc.id`))
      .where(eq(companies.isActive, true))
      .orderBy(companies.name);
      
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch companies' });
    }
  });

  // Admin - Stats
  app.get('/api/admin/stats', requireAdmin, async (req, res) => {
    try {
      const [totalJobs] = await db.select({ value: count() }).from(jobs);
      const [activeJobs] = await db.select({ value: count() }).from(jobs).where(eq(jobs.status, 'published'));
      const [totalCompanies] = await db.select({ value: count() }).from(companies);
      const [totalTenders] = await db.select({ value: count() }).from(tenders);
      const [activeTenders] = await db.select({ value: count() }).from(tenders).where(eq(tenders.status, 'published'));
      const [totalAnnouncements] = await db.select({ value: count() }).from(announcements);

      res.json({
        totalJobs: totalJobs.value,
        activeJobs: activeJobs.value,
        totalCompanies: totalCompanies.value,
        totalTenders: totalTenders.value,
        activeTenders: activeTenders.value,
        totalAnnouncements: totalAnnouncements.value,
        websiteVisitors: 1250,
        monthlyPageViews: 8400
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Admin - Audit Logs
  app.get('/api/admin/logs', requireAdmin, async (req, res) => {
    try {
      const results = await db.select().from(audit_logs).orderBy(desc(audit_logs.timestamp)).limit(50);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  });

  // Admin - Website Settings
  app.get('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const results = await db.select().from(website_settings);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.post('/api/admin/settings', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { key, value } = req.body;
      const result = await db.insert(website_settings).values({ key, value }).onConflictDoUpdate({
        target: website_settings.key,
        set: { value, updatedAt: new Date() }
      }).returning();
      
      await logAction(null, req.user?.email || 'Admin', `Updated website setting: ${key}`);
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update setting' });
    }
  });

  // Generic Admin CRUD
  const entities: any = {
    jobs: jobs,
    tenders: tenders,
    announcements: announcements,
    companies: companies,
    categories: categories,
    users: users
  };

  Object.keys(entities).forEach(key => {
    const table = entities[key];

    app.get(`/api/admin/${key}`, requireAdmin, async (req, res) => {
      try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
        
        let query = db.select().from(table).orderBy(desc(table.id));
        if (limit) {
          const results = await query.limit(limit).offset(offset || 0);
          res.json(results);
        } else {
          const results = await query;
          res.json(results);
        }
      } catch (error) {
        res.status(500).json({ error: `Failed to fetch ${key}` });
      }
    });

    app.post(`/api/admin/${key}`, requireAdmin, async (req: AuthRequest, res) => {
      try {
        const results = await db.insert(table).values(req.body).returning();
        const result = (results as any)[0];
        await logAction(null, req.user?.email || 'Admin', `Created ${key.slice(0, -1)}`, key, result.id);
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Failed to create ${key.slice(0, -1)}` });
      }
    });

    app.put(`/api/admin/${key}/:id`, requireAdmin, async (req: AuthRequest, res) => {
      try {
        const id = parseInt(req.params.id);
        const results = await db.update(table).set({ ...req.body, updatedAt: new Date() }).where(eq(table.id, id)).returning();
        const result = (results as any)[0];
        await logAction(null, req.user?.email || 'Admin', `Updated ${key.slice(0, -1)}`, key, id);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: `Failed to update ${key.slice(0, -1)}` });
      }
    });

    app.delete(`/api/admin/${key}/:id`, requireAdmin, async (req: AuthRequest, res) => {
      try {
        const id = parseInt(req.params.id);
        await db.delete(table).where(eq(table.id, id));
        await logAction(null, req.user?.email || 'Admin', `Deleted ${key.slice(0, -1)}`, key, id);
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: `Failed to delete ${key.slice(0, -1)}` });
      }
    });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(url, `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rwanda Jobs & Opportunities</title>
    <meta name="description" content="Find the latest job vacancies, tenders, and announcements in Rwanda." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'index.html')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import { jobs, companies, tenders, announcements, users } from './src/db/schema.ts';
import { eq, desc, and, gte, ilike, or } from 'drizzle-orm';
import { requireAdmin, AuthRequest } from './src/middleware/auth.ts';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  
  // Public - Jobs
  app.get('/api/jobs', async (req, res) => {
    try {
      const { category, type, location, search } = req.query;
      let query = db.select().from(jobs).innerJoin(companies, eq(jobs.companyId, companies.id));
      
      const conditions: (any)[] = [eq(jobs.isPublished, true)];
      
      if (category) conditions.push(eq(jobs.category, category as string));
      if (type) conditions.push(eq(jobs.employmentType, type as string));
      if (location) conditions.push(ilike(jobs.location, `%${location}%`));
      if (search) {
        conditions.push(or(
          ilike(jobs.title, `%${search}%`),
          ilike(companies.name, `%${search}%`)
        ));
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      let finalQuery = query.where(and(...conditions)).orderBy(desc(jobs.publicationDate));
      
      const results = limit ? await finalQuery.limit(limit) : await finalQuery;
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const result = await db.select()
        .from(jobs)
        .where(eq(jobs.id, parseInt(req.params.id)))
        .innerJoin(companies, eq(jobs.companyId, companies.id));
      
      if (result.length === 0) return res.status(404).json({ error: 'Job not found' });
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  });

  // Public - Tenders
  app.get('/api/tenders', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      let query = db.select().from(tenders).where(eq(tenders.isPublished, true)).orderBy(desc(tenders.publicationDate));
      const results = limit ? await query.limit(limit) : await query;
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tenders' });
    }
  });

  // Public - Announcements
  app.get('/api/announcements', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      let query = db.select().from(announcements).where(eq(announcements.isPublished, true)).orderBy(desc(announcements.publicationDate));
      const results = limit ? await query.limit(limit) : await query;
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  // Public - Companies
  app.get('/api/companies', async (req, res) => {
    try {
      const results = await db.select().from(companies).where(eq(companies.isActive, true));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch companies' });
    }
  });

  // Admin Routes
  app.post('/api/admin/jobs', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const result = await db.insert(jobs).values(req.body).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create job' });
    }
  });

  app.put('/api/admin/jobs/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const result = await db.update(jobs).set(req.body).where(eq(jobs.id, parseInt(req.params.id))).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update job' });
    }
  });

  app.delete('/api/admin/jobs/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      await db.delete(jobs).where(eq(jobs.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete job' });
    }
  });

  app.post('/api/admin/companies', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const result = await db.insert(companies).values(req.body).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create company' });
    }
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
    // Production: Serve static files from dist
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

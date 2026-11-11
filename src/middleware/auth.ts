import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq, count } from 'drizzle-orm';

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  await requireAuth(req, res, async () => {
    try {
      const email = req.user?.email;
      const uid = req.user?.uid;
      if (!email || !uid) return res.status(401).json({ error: 'Unauthorized: Missing user info' });

      // Find user in DB
      let userRecord = await db.select().from(users).where(eq(users.uid, uid));
      
      // If user doesn't exist, create them as Super Admin (first user) or wait for manual assignment
      if (userRecord.length === 0) {
        const results = await db.select({ count: count() }).from(users);
        const isFirst = results[0].count === 0;
        
        const [newUser] = await db.insert(users).values({
          uid,
          email,
          role: isFirst ? 'superadmin' : 'viewer', // First user is superadmin
        }).returning();
        userRecord = [newUser];
      }

      const user = userRecord[0];
      if (!user.isActive) return res.status(403).json({ error: 'Account deactivated' });

      // Add db user info to request
      (req as any).dbUser = user;

      // Access control: only superadmin, manager, and editor can access admin routes
      if (['superadmin', 'manager', 'editor'].includes(user.role || '')) {
        next();
      } else {
        res.status(403).json({ error: 'Insufficient permissions' });
      }
    } catch (err) {
      console.error('Role check failed:', err);
      res.status(500).json({ error: 'Authentication service error' });
    }
  });
};

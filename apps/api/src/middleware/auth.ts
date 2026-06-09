import { Request, Response, NextFunction } from "express";
import { prisma } from "@repo/database";

function decodeJwtPayload(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
    return payload;
  } catch {
    return null;
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let userId: string | undefined;
  let profile: {
    email?: string;
    name?: string;
    image?: string;
    emailVerified?: boolean;
  } = {};

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    const decoded = decodeJwtPayload(token);
    if (decoded) {
      userId = decoded.uid || decoded.user_id || decoded.sub;
      profile.email = decoded.email;
      profile.name = decoded.name;
      profile.image = decoded.picture;
      profile.emailVerified = decoded.email_verified ?? decoded.emailVerified;
    }
  }

  if (!userId) {
    const headerUserId = req.headers["x-user-id"];
    if (typeof headerUserId === "string" && headerUserId.trim().length > 0) {
      userId = headerUserId.trim();
      profile.name = profile.name || "Dev User";
      profile.email = profile.email || `${userId}@tendrra.ai`;
      profile.emailVerified = profile.emailVerified ?? false;
    }
  }

  if (!userId) {
    if (process.env.NODE_ENV !== "production") {
      userId = "default-user";
      profile.name = "Default User";
      profile.email = `${userId}@tendrra.ai`;
      profile.emailVerified = false;
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: profile.name || `User ${userId.slice(0, 8)}`,
        email: profile.email || `${userId}@tendrra.ai`,
        image: profile.image || null,
        emailVerified: profile.emailVerified ?? false,
      },
      create: {
        id: userId,
        name: profile.name || `User ${userId.slice(0, 8)}`,
        email: profile.email || `${userId}@tendrra.ai`,
        image: profile.image,
        emailVerified: profile.emailVerified ?? false,
      },
    });

    (req as any).user = { uid: userId, ...profile };
    next();
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
};

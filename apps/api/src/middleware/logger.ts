import { Request, Response, NextFunction } from "express";
import { prisma } from "@repo/database";

export async function auditLogger(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send;
  const userId = (req.body && req.body.userId) || req.query.userId;

  // Only log mutating methods if userId is present
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && userId) {
    res.send = function (data) {
      const response = originalSend.call(this, data);
      
      // Fire and forget logging
      prisma.auditLog.create({
        data: {
          userId: String(userId),
          action: req.method,
          entity: req.path.split('/')[2] || 'unknown',
          entityId: req.params.id || (req.body && req.body.id),
          newData: req.body || {},
        }
      }).catch(err => console.error("Audit Logging Error:", err));

      return response;
    };
  }
  
  next();
}

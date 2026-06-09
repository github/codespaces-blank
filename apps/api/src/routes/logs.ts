import { Router } from "express";
import { prisma } from "@repo/database";

const router = Router();

router.get("/", async (req, res) => {
  const { userId, entity } = req.query;
  const logs = await prisma.auditLog.findMany({
    where: { 
      userId: userId ? String(userId) : undefined,
      entity: entity ? String(entity) : undefined
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json(logs);
});

export default router;

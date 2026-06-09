import { Router } from "express";
import { prisma } from "@repo/database";

const router = Router();

router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;
  const { sessionId } = req.query;
  const messages = await prisma.message.findMany({
    where: { 
      userId,
      sessionId: sessionId ? String(sessionId) : undefined
    },
    orderBy: { createdAt: "asc" },
    take: 100
  });
  res.json(messages);
});

router.delete("/history/:userId", async (req, res) => {
  const { userId } = req.params;
  await prisma.message.deleteMany({ where: { userId } });
  res.status(204).send();
});

export default router;

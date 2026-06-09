import { Router } from "express";
import { prisma } from "@repo/database";

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const job = await prisma.backgroundJob.findUnique({ where: { id } });
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const jobs = await prisma.backgroundJob.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20
  });
  res.json(jobs);
});

export default router;

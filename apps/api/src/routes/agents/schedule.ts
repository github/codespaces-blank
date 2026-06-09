import express from "express";
import { prisma } from "@repo/database";
import { createJob } from "../../lib/job-queue.js";

const scheduleRouter = express.Router({ mergeParams: true });

scheduleRouter.post("/trigger", async (req, res) => {
  const { id } = req.params as { id: string };
  const userId = (req as any).user?.uid;
  const { task } = req.body as { task?: string };

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const cfg = (agent.config || {}) as any;
    const t =
      task ||
      cfg.scheduledTask ||
      "Run scheduled maintenance: summarize open risks from the last period.";

    const job = await createJob(
      "AGENT_TASK",
      { agentId: id, task: t, source: "schedule.trigger" },
      userId
    );

    res.json({
      message: "Scheduled-style run queued",
      jobId: job.id,
      task: t,
      cron: cfg.schedule || null,
      timezone: cfg.timezone || null,
    });
  } catch (error) {
    console.error("schedule trigger error:", error);
    res.status(500).json({ error: "Failed to queue scheduled run" });
  }
});

export default scheduleRouter;

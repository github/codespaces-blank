import express from "express";
import { prisma } from "@repo/database";
import { executeAgentTask } from "../../lib/agent-runner.js";
import { createJob } from "../../lib/job-queue.js";

const workspaceRouter = express.Router({ mergeParams: true });

workspaceRouter.get("/", async (req, res) => {
  const { id } = req.params as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const jobs = await prisma.backgroundJob.findMany({
      where: { userId, payload: { path: ["agentId"], equals: id } as any },
      take: 20,
      orderBy: { createdAt: "desc" }
    });

    res.json({ agent, jobs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workspace state" });
  }
});

// Execute task in background
workspaceRouter.post("/execute", async (req, res) => {
  const { id } = req.params as any;
  const { task } = req.body;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Create a background job for the task
    const job = await createJob("AGENT_TASK", { agentId: id, task }, userId);
    
    res.json({ message: "Job created", jobId: job.id });
  } catch (error) {
    console.error("Job creation error:", error);
    res.status(500).json({ error: "Failed to queue agent task" });
  }
});

export default workspaceRouter;

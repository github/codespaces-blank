import { Router } from "express";
import { prisma } from "@repo/database";
import { executeWorkflow } from "../lib/workflow-engine.js";
import { createJob } from "../lib/job-queue.js";

const router = Router();

router.get("/", async (req, res) => {
  const workflows = await prisma.workflow.findMany({
    orderBy: { updatedAt: "desc" },
  });
  res.json(workflows);
});

router.post("/", async (req, res) => {
  const { name, definition, userId } = req.body;
  const workflow = await prisma.workflow.create({
    data: { name, definition, userId },
  });
  res.status(201).json(workflow);
});

router.post("/:id/run", async (req, res) => {
  const { id } = req.params;
  const { inputData, async, userId } = req.body;
  
  try {
    if (async) {
      if (!userId) return res.status(400).json({ error: "userId required for async runs" });
      const job = await createJob("WORKFLOW_EXECUTION", { workflowId: id, inputData }, userId);
      return res.status(202).json({ jobId: job.id, status: "QUEUED" });
    }
    
    const result = await executeWorkflow(id, inputData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/executions/:workflowId", async (req, res) => {
  const { workflowId } = req.params;
  const executions = await prisma.workflowExecution.findMany({
    where: { workflowId },
    orderBy: { createdAt: "desc" },
  });
  res.json(executions);
});

export default router;

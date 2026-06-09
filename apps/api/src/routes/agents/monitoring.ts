import express from "express";
import { prisma } from "@repo/database";

const monitoringRouter = express.Router({ mergeParams: true });

// Get monitoring logs
monitoringRouter.get("/", async (req, res) => {
  const { id: agentId } = req.params as any;
  const userId = (req as any).user?.uid;
  const { limit = 50, offset = 0, status, taskId } = req.query;

  try {
    // Verify agent ownership
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { userId: true }
    });

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    if (userId && agent.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const logs = await prisma.agentMonitoring.findMany({
      where: {
        agentId,
        ...(status && { status: String(status) }),
        ...(taskId && { taskId: String(taskId) })
      },
      take: Math.min(parseInt(String(limit)) || 50, 200),
      skip: parseInt(String(offset)) || 0,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.agentMonitoring.count({
      where: {
        agentId,
        ...(status && { status: String(status) }),
        ...(taskId && { taskId: String(taskId) })
      }
    });

    res.json({
      data: logs,
      total,
      limit: Math.min(parseInt(String(limit)) || 50, 200),
      offset: parseInt(String(offset)) || 0
    });
  } catch (error) {
    console.error("Error fetching monitoring logs:", error);
    res.status(500).json({ error: "Failed to fetch monitoring logs" });
  }
});

// Create monitoring log (after task execution)
monitoringRouter.post("/", async (req, res) => {
  const { id: agentId } = req.params as any;
  const userId = (req as any).user?.uid;
  const { taskId, action, status, metadata, logs } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify agent ownership
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { userId: true }
    });

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    if (agent.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const monitoring = await prisma.agentMonitoring.create({
      data: {
        agentId,
        userId,
        taskId: taskId || null,
        action: action || 'TASK_EXECUTION',
        status: status || 'COMPLETED',
        metadata: metadata || {},
        logs: logs || null
      }
    });

    res.status(201).json(monitoring);
  } catch (error) {
    console.error("Error creating monitoring log:", error);
    res.status(500).json({ error: "Failed to create monitoring log" });
  }
});

// Get specific log
monitoringRouter.get("/:logId", async (req, res) => {
  const { id: agentId, logId } = req.params as any;
  const userId = (req as any).user?.uid;

  try {
    const log = await prisma.agentMonitoring.findUnique({
      where: { id: logId }
    });

    if (!log || log.agentId !== agentId) {
      return res.status(404).json({ error: "Log not found" });
    }

    if (userId && log.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(log);
  } catch (error) {
    console.error("Error fetching log:", error);
    res.status(500).json({ error: "Failed to fetch log" });
  }
});

// Get monitoring summary
monitoringRouter.get("/summary/stats", async (req, res) => {
  const { id: agentId } = req.params as any;
  const userId = (req as any).user?.uid;

  try {
    // Verify agent ownership
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { userId: true }
    });

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    if (userId && agent.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const stats = await prisma.agentMonitoring.groupBy({
      by: ['status'],
      where: { agentId },
      _count: true
    });

    const totalLogs = await prisma.agentMonitoring.count({
      where: { agentId }
    });

    const recentLogs = await prisma.agentMonitoring.findMany({
      where: { agentId },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      stats,
      totalLogs,
      recentLogs
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default monitoringRouter;

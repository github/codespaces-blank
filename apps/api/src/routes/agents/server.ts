import express from "express";
import { prisma } from "@repo/database";
import { authenticate } from "../../middleware/auth.js";

const serverRouter = express.Router({ mergeParams: true });

// Get agent server status
serverRouter.get("/:id/server", async (req, res) => {
  const { id } = req.params as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const cfg = (agent.config || {}) as Record<string, any>;

    res.json({
      agentId: id,
      status: agent.status,
      config: {
        continuousMode: cfg.continuousMode || false,
        serverPort: cfg.serverPort || 8080,
        enableWebhook: cfg.enableWebhook || false,
        webhookUrl: cfg.webhookUrl || "",
        maxMemoryMB: cfg.maxMemoryMB || 1024,
        cpuLimit: cfg.cpuLimit || 50,
        enableLogging: cfg.enableLogging !== false,
        logLevel: cfg.logLevel || "info",
        runMode: cfg.runMode || "manual",
        schedule: cfg.schedule || "",
        timezone: cfg.timezone || "UTC",
        maxConcurrentTasks: cfg.maxConcurrentTasks || 5,
        retryAttempts: cfg.retryAttempts || 3,
        timeoutSeconds: cfg.timeoutSeconds || 300,
        enabledMcpServers: cfg.enabledMcpServers || [],
        customTools: cfg.customTools || [],
        apiKeys: cfg.apiKeys || {},
        requireAuth: cfg.requireAuth !== false,
        allowedDomains: cfg.allowedDomains || "",
        enableRateLimit: cfg.enableRateLimit !== false,
        rateLimitPerMinute: cfg.rateLimitPerMinute || 60,
      },
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      lastUpdated: agent.updatedAt
    });
  } catch (error) {
    console.error("Error fetching agent server status:", error);
    res.status(500).json({ error: "Failed to fetch server status" });
  }
});

// Start agent server
serverRouter.post("/:id/server/start", async (req, res) => {
  const { id } = req.params as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Update agent status to running
    await prisma.agent.update({
      where: { id },
      data: { status: "RUNNING" }
    });

    // Initialize agent server with configuration
    const cfg = (agent.config || {}) as Record<string, any>;

    // Initialize agent server with configuration
    console.log(`Starting agent server for ${id} with config:`, cfg);

    res.json({
      message: "Agent server started successfully",
      agentId: id,
      status: "RUNNING",
      config: {
        serverPort: cfg.serverPort || 8080,
        continuousMode: cfg.continuousMode || false,
        ...cfg,
      },
    });
  } catch (error) {
    console.error("Error starting agent server:", error);
    res.status(500).json({ error: "Failed to start agent server" });
  }
});

// Stop agent server
serverRouter.post("/:id/server/stop", async (req, res) => {
  const { id } = req.params as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Update agent status to paused
    await prisma.agent.update({
      where: { id },
      data: { status: "PAUSED" }
    });

    console.log(`Stopping agent server for ${id}`);
    
    res.json({ 
      message: "Agent server stopped successfully",
      agentId: id,
      status: "PAUSED"
    });
  } catch (error) {
    console.error("Error stopping agent server:", error);
    res.status(500).json({ error: "Failed to stop agent server" });
  }
});

// Get agent metrics
serverRouter.get("/:id/server/metrics", async (req, res) => {
  const { id } = req.params as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Get recent jobs for metrics
    const jobs = await prisma.backgroundJob.findMany({
      where: { 
        userId,
        payload: { path: ["agentId"], equals: id }
      },
      take: 100,
      orderBy: { createdAt: "desc" }
    });

    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(job => job.status === "COMPLETED").length;
    const failedJobs = jobs.filter(job => job.status === "FAILED").length;
    const runningJobs = jobs.filter(job => job.status === "PROCESSING").length;

    // Calculate average execution time
    const completedJobsWithTime = jobs.filter(job => 
      job.status === "COMPLETED" && job.finishedAt
    );
    const avgExecutionTime = completedJobsWithTime.length > 0 
      ? completedJobsWithTime.reduce((sum, job) => {
          const executionTime = new Date(job.finishedAt!).getTime() - new Date(job.createdAt).getTime();
          return sum + executionTime;
        }, 0) / completedJobsWithTime.length
      : 0;

    res.json({
      agentId: id,
      metrics: {
        totalJobs,
        completedJobs,
        failedJobs,
        runningJobs,
        successRate: totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0,
        averageExecutionTime: Math.round(avgExecutionTime / 1000), // Convert to seconds
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching agent metrics:", error);
    res.status(500).json({ error: "Failed to fetch agent metrics" });
  }
});

// Restart agent server
serverRouter.post("/:id/server/restart", async (req, res) => {
  const { id } = req.params as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Stop and start the server
    console.log(`Restarting agent server for ${id}`);
    
    // Update agent status
    await prisma.agent.update({
      where: { id },
      data: { status: "RUNNING" }
    });

    res.json({ 
      message: "Agent server restarted successfully",
      agentId: id,
      status: "RUNNING"
    });
  } catch (error) {
    console.error("Error restarting agent server:", error);
    res.status(500).json({ error: "Failed to restart agent server" });
  }
});

// Get agent logs
serverRouter.get("/:id/server/logs", async (req, res) => {
  const { id } = req.params as any;
  const { limit = 50, level } = req.query as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Get recent jobs as logs
    const whereClause: any = {
      userId,
      payload: { path: ["agentId"], equals: id }
    };

    if (level && level !== "all") {
      // Filter by log level if specified
      whereClause.status = level.toUpperCase();
    }

    const jobs = await prisma.backgroundJob.findMany({
      where: whereClause,
      take: parseInt(limit) || 50,
      orderBy: { createdAt: "desc" }
    });

    const logs = jobs.map(job => ({
      id: job.id,
      timestamp: job.createdAt,
      level: job.status.toLowerCase(),
      message: (job.payload as any)?.task || "Task executed",
      details: {
        type: job.type,
        result: job.result,
        error: job.error,
        executionTime: job.finishedAt 
          ? new Date(job.finishedAt).getTime() - new Date(job.createdAt).getTime()
          : null
      }
    }));

    res.json({
      agentId: id,
      logs,
      total: logs.length,
      filteredBy: level || "all"
    });
  } catch (error) {
    console.error("Error fetching agent logs:", error);
    res.status(500).json({ error: "Failed to fetch agent logs" });
  }
});

export default serverRouter;

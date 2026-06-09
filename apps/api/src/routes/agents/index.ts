import express from "express";
import { prisma } from "@repo/database";

import configRouter from "./config.js";
import knowledgeRouter from "./knowledge.js";
import workspaceRouter from "./workspace.js";
import serverRouter from "./server.js";
import chatRouter from "./chat.js";
import toolsRouter from "./tools.js";
import executionRouter from "./execution.js";
import workflowsRouter from "./workflows.js";
import integrationsRouter from "./integrations.js";
import monitoringRouter from "./monitoring.js";
import exportRouter from "./export.js";
import evalRouter from "./eval.js";
import scheduleRouter from "./schedule.js";
import { executeAgentTask } from "../../lib/agent-runner.js";
import { AgentFactory } from "../../lib/agentFactory.js";
import { getAvailableModelsList } from "../../lib/model-registry.js";

const agentRouter = express.Router();

agentRouter.get("/meta/models", (_req, res) => {
  res.json({ models: getAvailableModelsList() });
});

agentRouter.get("/meta/mcp-servers", (_req, res) => {
  res.json({
    servers: [
      {
        id: "filesystem",
        name: "File System Access",
        description: "Read/write files (stub until MCP wired)",
      },
      {
        id: "database",
        name: "Database Query",
        description: "SQL and structured data access",
      },
      {
        id: "web-search",
        name: "Web Search",
        description: "Exa + optional Parallel multi-query search",
      },
      {
        id: "parallel-web-search",
        name: "Parallel web search",
        description: "Multi-query research via Parallel (PARALLEL_API_KEY)",
      },
      {
        id: "knowledge-base",
        name: "Knowledge base",
        description: "Use uploaded sources via knowledgeSearch tool",
      },
      {
        id: "code-execution",
        name: "Code Execution",
        description: "Sandbox execution (stub in this deployment)",
      },
      {
        id: "api-caller",
        name: "API Caller",
        description: "Outbound HTTP to approved endpoints",
      },
      {
        id: "email",
        name: "Email",
        description: "Send/receive via connected provider",
      },
    ],
  });
});

agentRouter.get("/meta/industry-templates", (_req, res) => {
  res.json({
    templates: {
      fintech: {
        id: "fintech",
        name: "FinTech & banking",
        description: "Compliance, risk, and market intelligence",
        suggestedTools: ["webSearch", "parallelWebSearch", "knowledgeSearch"],
        instructions:
          "You are a senior fintech analyst. Prefer cited sources, flag regulatory ambiguity, and avoid investment advice.",
      },
      healthcare: {
        id: "healthcare",
        name: "Healthcare operations",
        description: "Clinical ops, payer, and patient comms (non-diagnostic)",
        suggestedTools: ["webSearch", "knowledgeSearch"],
        instructions:
          "You support healthcare operations. Never provide diagnoses; cite institutional policies when available.",
      },
      education: {
        id: "education",
        name: "Teaching & curriculum",
        description: "Lesson plans, assessments, and explanations",
        suggestedTools: ["webSearch", "knowledgeSearch"],
        instructions:
          "You are an expert educator. Scaffold answers, check understanding, and align to learning objectives.",
      },
      finance: {
        id: "finance",
        name: "Corporate finance",
        description: "FP&A, reporting, and variance commentary",
        suggestedTools: ["webSearch", "knowledgeSearch"],
        instructions:
          "You are a finance partner. Quantify impacts, separate GAAP vs management views, and note data gaps.",
      },
    },
  });
});

// Get agents for the authenticated user only
agentRouter.get("/", async (req, res) => {
  try {
    const userId = (req as any).user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const agents = await prisma.agent.findMany({
      where: { userId },
      include: {
        integrations: true,
        monitoringLogs: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

// Create a new agent
agentRouter.post("/", async (req, res) => {
  const { name, type, role, description, model, instructions } = req.body;
  const userId = (req as any).user?.uid;
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const agent = await prisma.agent.create({
      data: {
        name,
        type: type || "General",
        role: role || "Assistant",
        userId,
        description,
        model,
        instructions,
        status: "IDLE",
        config: {},
      },
      include: {
        integrations: true
      }
    });
    res.status(201).json(agent);
  } catch (error) {
    console.error("Error creating agent:", error);
    res.status(500).json({ error: "Failed to create agent" });
  }
});

agentRouter.get("/:id/jobs", async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).user?.uid;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const jobs = await prisma.backgroundJob.findMany({
      where: {
        userId,
        OR: [
          { payload: { path: ["agentId"], equals: id } as any },
          { type: "AGENT_TASK", payload: { path: ["agentId"], equals: id } as any },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 80,
    });

    const normalized = jobs.map((j) => ({
      ...j,
      agentId: (j.payload as any)?.agentId ?? id,
    }));

    res.json(normalized);
  } catch (error) {
    console.error("Error listing agent jobs:", error);
    res.status(500).json({ error: "Failed to list jobs" });
  }
});

agentRouter.post("/:id/run", async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).user?.uid;
  const { task } = req.body as { task?: string };

  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!task?.trim()) return res.status(400).json({ error: "task is required" });

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const job = await prisma.backgroundJob.create({
      data: {
        userId,
        type: "AGENT_TASK",
        status: "PROCESSING",
        payload: { agentId: id, task: task.trim() },
      },
    });

    try {
      const result = await executeAgentTask(id, task.trim());
      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          result: result as any,
          finishedAt: new Date(),
        },
      });
      res.json({
        success: true,
        result,
        jobId: job.id,
      });
    } catch (err: any) {
      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: String(err?.message || err),
          finishedAt: new Date(),
        },
      });
      res.json({
        success: false,
        error: String(err?.message || err),
        jobId: job.id,
      });
    }
  } catch (error) {
    console.error("Error running agent:", error);
    res.status(500).json({ error: "Failed to run agent" });
  }
});

// Get a single agent
agentRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).user?.uid;
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        integrations: true,
        monitoringLogs: {
          take: 20,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    
    if (agent.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    res.json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    res.status(500).json({ error: "Failed to fetch agent" });
  }
});

// Update an agent
agentRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).user?.uid;
  const { name, type, role, description, status, config, model, instructions } =
    req.body;

  try {
    // Check authorization
    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    if (userId && agent.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: {
        name,
        type,
        role,
        description,
        status,
        config,
        ...(model !== undefined ? { model } : {}),
        ...(instructions !== undefined ? { instructions } : {}),
      },
      include: { integrations: true },
    });

    AgentFactory.updateAgent(id);

    res.json(updatedAgent);
  } catch (error) {
    console.error("Error updating agent:", error);
    res.status(500).json({ error: "Failed to update agent" });
  }
});

// Delete an agent
agentRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).user?.uid;
  
  try {
    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    if (userId && agent.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    await prisma.agent.delete({ where: { id } });
    AgentFactory.deleteAgent(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting agent:", error);
    res.status(500).json({ error: "Failed to delete agent" });
  }
});

agentRouter.use("/:id/export", exportRouter);
agentRouter.use("/:id/eval", evalRouter);
agentRouter.use("/:id/schedule", scheduleRouter);
agentRouter.use("/:id/config", configRouter);
agentRouter.use("/:id/knowledge", knowledgeRouter);
agentRouter.use("/:id/workspace", workspaceRouter);
agentRouter.use("/:id/server", serverRouter);
agentRouter.use("/:id/chat", chatRouter);
agentRouter.use("/:id/tools", toolsRouter);
agentRouter.use("/:id/execute", executionRouter);
agentRouter.use("/:id/workflows", workflowsRouter);
agentRouter.use("/:id/integrations", integrationsRouter);
agentRouter.use("/:id/monitoring", monitoringRouter);

export default agentRouter;

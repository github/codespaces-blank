import express from "express";
import { prisma } from "@repo/database";
import { AgentFactory } from "../../lib/agentFactory.js";
import { tool } from 'ai';
import { z } from 'zod';

interface AgentConfig {
  enabledTools?: string[];
  customTools?: Array<{
    name: string;
    description: string;
    inputSchema?: Record<string, unknown>;
    executeFunction: string;
    category?: string;
    createdAt?: string;
  }>;
  toolChoice?: string;
  [key: string]: unknown;
}

const DEFAULT_CONFIG: AgentConfig = {
  enabledTools: [],
  customTools: [],
  toolChoice: 'auto',
};

const toolsRouter = express.Router({ mergeParams: true });

// Get available built-in tools
toolsRouter.get("/available", async (req, res) => {
  try {
    const availableTools = AgentFactory.getAvailableTools();
    
    const toolDetails = {
      parallelWebSearch: {
        name: "parallelWebSearch",
        description: "Parallel multi-query web search (requires PARALLEL_API_KEY)",
        inputSchema: {
          objective: { type: "string", description: "Research objective" },
          queries: { type: "array", items: { type: "string" }, description: "Queries" },
        },
        category: "information",
      },
      knowledgeSearch: {
        name: "knowledgeSearch",
        description: "Search this agent's uploaded knowledge",
        inputSchema: {
          query: { type: "string", description: "Search phrase" },
        },
        category: "knowledge",
      },
      fileRead: {
        name: 'fileRead',
        description: 'Read file contents',
        inputSchema: {
          path: { type: 'string', description: 'File path to read' }
        },
        category: 'file-system'
      },
      fileWrite: {
        name: 'fileWrite',
        description: 'Write content to a file',
        inputSchema: {
          path: { type: 'string', description: 'File path to write' },
          content: { type: 'string', description: 'Content to write' }
        },
        category: 'file-system'
      },
      codeExecution: {
        name: 'codeExecution',
        description: 'Execute code in a sandboxed environment',
        inputSchema: {
          code: { type: 'string', description: 'Code to execute' },
          language: { type: 'enum', values: ['javascript', 'python', 'typescript'], description: 'Programming language' }
        },
        category: 'development'
      }
    };

    res.json({
      tools: toolDetails,
      available: availableTools,
      categories: ['information', 'file-system', 'development', 'knowledge', 'custom']
    });

  } catch (error) {
    console.error("Error fetching available tools:", error);
    res.status(500).json({ error: "Failed to fetch available tools" });
  }
});

// Current agent's tool configuration (GET /api/agents/:agentId/tools)
toolsRouter.get("/", async (req, res) => {
  const { id } = req.params as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const config = (agent.config as AgentConfig) || DEFAULT_CONFIG;
    const enabledTools = config.enabledTools || DEFAULT_CONFIG.enabledTools!;
    const customTools = config.customTools || DEFAULT_CONFIG.customTools!;

    res.json({
      agentId: id,
      enabledTools,
      customTools,
      toolChoice: config.toolChoice || DEFAULT_CONFIG.toolChoice!,
      totalTools: enabledTools.length + customTools.length
    });

  } catch (error) {
    console.error("Error fetching agent tools:", error);
    res.status(500).json({ error: "Failed to fetch agent tools" });
  }
});

toolsRouter.put("/", async (req, res) => {
  const { id } = req.params as any;
  const { enabledTools, customTools, toolChoice } = req.body;
  const userId = (req as any).user.uid;

   try {
     const agent = await prisma.agent.findFirst({ where: { id, userId } });
     if (!agent) return res.status(404).json({ error: "Agent not found" });

     const currentConfig = (agent.config as AgentConfig) || DEFAULT_CONFIG;
     const updatedConfig: AgentConfig = {
       ...currentConfig,
       enabledTools: enabledTools || currentConfig.enabledTools || DEFAULT_CONFIG.enabledTools!,
       customTools: customTools || currentConfig.customTools || DEFAULT_CONFIG.customTools!,
       toolChoice: toolChoice || currentConfig.toolChoice || DEFAULT_CONFIG.toolChoice!,
     };

    await prisma.agent.update({
      where: { id },
      data: { config: updatedConfig as any },
    });

    // Update agent instance
    AgentFactory.updateAgent(id, {
      id,
      name: agent.name,
      type: agent.type,
      role: agent.role,
      description: agent.description || '',
      model: agent.model || 'gemini-1.5-flash',
      instructions: agent.instructions || '',
      tools: [],
      config: updatedConfig,
    });

    res.json({
      message: "Agent tools updated successfully",
      agentId: id,
      config: updatedConfig
    });

  } catch (error) {
    console.error("Error updating agent tools:", error);
    res.status(500).json({ error: "Failed to update agent tools" });
  }
});

toolsRouter.post("/custom", async (req, res) => {
  const { id } = req.params as any;
  const { name, description, inputSchema, executeFunction, category } = req.body;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const currentConfig = (agent.config || {}) as Record<string, any>;
    const customTools = currentConfig.customTools || [];

    // Validate the custom tool
    if (!name || !description || !executeFunction) {
      return res.status(400).json({ 
        error: "Missing required fields: name, description, executeFunction" 
      });
    }

    const newTool = {
      name,
      description,
      inputSchema: inputSchema || {},
      executeFunction,
      category: category || 'custom',
      createdAt: new Date().toISOString(),
    };

    customTools.push(newTool);

    await prisma.agent.update({
      where: { id },
      data: {
        config: {
          ...currentConfig,
          customTools,
        } as any,
      },
    });

    // Update agent instance
    AgentFactory.updateAgent(id, {
      id,
      name: agent.name,
      type: agent.type,
      role: agent.role,
      description: agent.description || '',
      model: agent.model || 'gemini-1.5-flash',
      instructions: agent.instructions || '',
      tools: [],
      config: { ...currentConfig, customTools },
    });

    res.status(201).json({
      message: "Custom tool added successfully",
      tool: newTool,
      agentId: id
    });

  } catch (error) {
    console.error("Error adding custom tool:", error);
    res.status(500).json({ error: "Failed to add custom tool" });
  }
});

toolsRouter.delete("/custom/:toolName", async (req, res) => {
  const { id, toolName } = req.params as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const currentConfig = (agent.config || {}) as Record<string, any>;
    const customTools = currentConfig.customTools || [];
    
    const filteredTools = customTools.filter((tool: any) => tool.name !== toolName);

    if (filteredTools.length === customTools.length) {
      return res.status(404).json({ error: "Custom tool not found" });
    }

    await prisma.agent.update({
      where: { id },
      data: {
        config: {
          ...currentConfig,
          customTools: filteredTools,
        } as any,
      },
    });

    // Update agent instance
    AgentFactory.updateAgent(id, {
      id,
      name: agent.name,
      type: agent.type,
      role: agent.role,
      description: agent.description || '',
      model: agent.model || 'gemini-1.5-flash',
      instructions: agent.instructions || '',
      tools: [],
      config: { ...currentConfig, customTools: filteredTools },
    });

    res.json({
      message: "Custom tool removed successfully",
      toolName,
      agentId: id
    });

  } catch (error) {
    console.error("Error removing custom tool:", error);
    res.status(500).json({ error: "Failed to remove custom tool" });
  }
});

toolsRouter.post("/test-tool", async (req, res) => {
  const { id } = req.params as any;
  const { toolName, input } = req.body;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const config = (agent.config || {}) as Record<string, any>;
    const customTools = config.customTools || [];
    
    const tool = customTools.find((t: any) => t.name === toolName);
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    try {
      // Create a safe execution environment for the tool
      const executeFunction = new Function('input', tool.executeFunction);
      const result = await executeFunction(input);

      res.json({
        success: true,
        result,
        toolName,
        input,
        executionTime: Date.now()
      });

    } catch (execError) {
      res.status(400).json({
        success: false,
        error: execError.message,
        toolName,
        input
      });
    }

  } catch (error) {
    console.error("Error testing custom tool:", error);
    res.status(500).json({ error: "Failed to test custom tool" });
  }
});

toolsRouter.get("/stats", async (req, res) => {
  const { id } = req.params as any;
  const { timeRange = '24h' } = req.query as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Calculate time range
    const now = new Date();
    let startTime: Date;
    
    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Get tool usage from background jobs
    const jobs = await prisma.backgroundJob.findMany({
      where: {
        userId,
        payload: { path: ["agentId"], equals: id },
        createdAt: { gte: startTime },
        type: 'TOOL_EXECUTION'
      },
      orderBy: { createdAt: 'desc' }
    });

    // Aggregate tool usage
    const toolUsage: Record<string, number> = {};
    const toolErrors: Record<string, number> = {};

    jobs.forEach(job => {
      const toolName = (job.payload as any)?.toolName || "unknown";
      toolUsage[toolName] = (toolUsage[toolName] || 0) + 1;
      
      if (job.status === 'FAILED') {
        toolErrors[toolName] = (toolErrors[toolName] || 0) + 1;
      }
    });

    const totalExecutions = Object.values(toolUsage).reduce((sum, count) => sum + count, 0);
    const totalErrors = Object.values(toolErrors).reduce((sum, count) => sum + count, 0);

    res.json({
      agentId: id,
      timeRange,
      totalExecutions,
      totalErrors,
      successRate: totalExecutions > 0 ? ((totalExecutions - totalErrors) / totalExecutions) * 100 : 100,
      toolUsage,
      toolErrors,
      mostUsedTool: Object.entries(toolUsage).sort(([,a], [,b]) => b - a)[0]?.[0] || null,
      period: {
        start: startTime,
        end: now,
        hours: (now.getTime() - startTime.getTime()) / (1000 * 60 * 60)
      }
    });

  } catch (error) {
    console.error("Error fetching tool stats:", error);
    res.status(500).json({ error: "Failed to fetch tool statistics" });
  }
});

export default toolsRouter;

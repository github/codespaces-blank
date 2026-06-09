import express from "express";
import { prisma } from "@repo/database";
import { AgentFactory } from "../../lib/agentFactory.js";
import { createAgentUIStreamResponse } from 'ai';

const executionRouter = express.Router({ mergeParams: true });

// POST /api/agents/:agentId/execute
executionRouter.post("/", async (req, res) => {
  const { id } = req.params as any;
  const { prompt, options = {}, stream = true } = req.body;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Load agent instance
    let agentInstance = AgentFactory.getAgent(id);
    if (!agentInstance) {
      agentInstance = await AgentFactory.loadAgentFromDatabase(id);
      if (!agentInstance) {
        return res.status(500).json({ error: "Failed to load agent" });
      }
    }

    // Create background job for tracking
    const job = await prisma.backgroundJob.create({
      data: {
        userId,
        type: 'AGENT_EXECUTION',
        status: 'PROCESSING',
        payload: {
          agentId: id,
          prompt,
          options,
          startTime: new Date().toISOString(),
        },
      },
    });

    try {
      if (stream) {
        // Streaming response
        const response = await agentInstance.stream({
          prompt,
          ...options,
        });

        // Set up SSE headers
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Cache-Control',
        });

        let fullResponse = '';
        let stepCount = 0;

        // Stream the response with metadata
        for await (const chunk of response.textStream) {
          fullResponse += chunk;
          stepCount++;
          
          res.write(`data: ${JSON.stringify({
            type: 'chunk',
            content: chunk,
            stepCount,
            timestamp: new Date().toISOString(),
          })}\n\n`);
        }

        const usage = await response.usage;
        const finishReason = await response.finishReason;

        // Update job with completion
        await prisma.backgroundJob.update({
          where: { id: job.id },
          data: {
            status: 'COMPLETED',
            result: {
              response: fullResponse,
              stepCount,
              usage,
              finishReason,
            },
            finishedAt: new Date(),
          },
        });

        // Create monitoring log
        await prisma.agentMonitoring.create({
          data: {
            agentId: id,
            userId,
            taskId: job.id,
            action: 'EXECUTE_STREAMING',
            status: 'COMPLETED',
            metadata: {
              stepCount,
              usage,
              finishReason,
              prompt: prompt.substring(0, 100)
            },
            logs: fullResponse
          }
        });

        // Send completion signal
        res.write(`data: ${JSON.stringify({
          type: 'done',
          jobId: job.id,
          stepCount,
          usage,
          finishReason,
        })}\n\n`);
        res.end();

      } else {
        // Non-streaming response
        const result = await agentInstance.generate({
          prompt,
          ...options,
        });

        // Update job with completion
        await prisma.backgroundJob.update({
          where: { id: job.id },
          data: {
            status: 'COMPLETED',
            result: {
              response: result.text,
              usage: result.usage,
              finishReason: result.finishReason,
              stepCount: 1,
            },
            finishedAt: new Date(),
          },
        });

        // Create monitoring log
        await prisma.agentMonitoring.create({
          data: {
            agentId: id,
            userId,
            taskId: job.id,
            action: 'EXECUTE',
            status: 'COMPLETED',
            metadata: {
              usage: result.usage,
              finishReason: result.finishReason,
              prompt: prompt.substring(0, 100)
            },
            logs: result.text
          }
        });

        res.json({
          success: true,
          response: result.text,
          usage: result.usage,
          finishReason: result.finishReason,
          jobId: job.id,
        });
      }

    } catch (executionError) {
      // Update job with error
      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: 'FAILED',
          error: String((executionError as Error)?.message || executionError),
          finishedAt: new Date(),
        },
      });

      // Create monitoring log for error
      await prisma.agentMonitoring.create({
        data: {
          agentId: id,
          userId,
          taskId: job.id,
          action: 'EXECUTE',
          status: 'FAILED',
          metadata: {
            error: String((executionError as Error)?.message || executionError),
            prompt: prompt.substring(0, 100)
          }
        }
      });

      throw executionError;
    }

  } catch (error) {
    console.error("Error in agent execution:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to execute agent task" });
    }
  }
});

// POST /api/agents/:agentId/execute/ui
executionRouter.post("/ui", async (req, res) => {
  const { id } = req.params as any;
  const { messages, options = {} } = req.body;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    // Load agent instance
    let agentInstance = AgentFactory.getAgent(id);
    if (!agentInstance) {
      agentInstance = await AgentFactory.loadAgentFromDatabase(id);
      if (!agentInstance) {
        return res.status(500).json({ error: "Failed to load agent" });
      }
    }

    // Create background job
    const job = await prisma.backgroundJob.create({
      data: {
        userId,
        type: 'AGENT_UI_EXECUTION',
        status: 'PROCESSING',
        payload: {
          agentId: id,
          messages,
          options,
          startTime: new Date().toISOString(),
        },
      },
    });

    try {
      const { pipeWebResponseToExpress } = await import("../../lib/stream-express.js");
      const webResponse = await createAgentUIStreamResponse({
        agent: agentInstance as any,
        uiMessages: messages,
        options,
      });
      await pipeWebResponseToExpress(webResponse, res);

      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          finishedAt: new Date(),
        },
      });
      return;
    } catch (executionError) {
      // Update job with error
      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: 'FAILED',
          error: String((executionError as Error)?.message || executionError),
          finishedAt: new Date(),
        },
      });

      throw executionError;
    }

  } catch (error) {
    console.error("Error in agent UI execution:", error);
    res.status(500).json({ error: "Failed to execute agent UI task" });
  }
});

// GET /api/agents/:agentId/execute/history
executionRouter.get("/history", async (req, res) => {
  const { id } = req.params as any;
  const { limit = 20, status, type } = req.query as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const whereClause: any = {
      userId,
      payload: { path: ["agentId"], equals: id },
    };

    if (status && status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    if (type && type !== 'all') {
      whereClause.type = type.toUpperCase();
    }

    const executions = await prisma.backgroundJob.findMany({
      where: whereClause,
      take: parseInt(limit) || 20,
      orderBy: { createdAt: 'desc' },
    });

    const history = executions.map(exec => {
      const p = exec.payload as Record<string, unknown> | null;
      const msgs = p?.messages as unknown[] | undefined;
      return {
      id: exec.id,
      type: exec.type,
      status: exec.status,
      prompt: (p?.prompt as string) || (Array.isArray(msgs) && msgs.length ? String((msgs[msgs.length - 1] as any)?.content ?? '') : ''),
      options: (p?.options as Record<string, unknown>) || {},
      startTime: exec.createdAt,
      endTime: exec.finishedAt || null,
      duration: exec.finishedAt ? 
        new Date(exec.finishedAt).getTime() - new Date(exec.createdAt).getTime() : 
        null,
      result: exec.result,
      error: exec.error,
    };
    });

    // Aggregate statistics
    const totalExecutions = executions.length;
    const completedExecutions = executions.filter(e => e.status === 'COMPLETED').length;
    const failedExecutions = executions.filter(e => e.status === 'FAILED').length;
    const runningExecutions = executions.filter(e => e.status === 'PROCESSING').length;

    res.json({
      agentId: id,
      history,
      stats: {
        total: totalExecutions,
        completed: completedExecutions,
        failed: failedExecutions,
        running: runningExecutions,
        successRate: totalExecutions > 0 ? (completedExecutions / totalExecutions) * 100 : 0,
      },
      filters: {
        limit: parseInt(limit) || 20,
        status: status || 'all',
        type: type || 'all',
      }
    });

  } catch (error) {
    console.error("Error fetching execution history:", error);
    res.status(500).json({ error: "Failed to fetch execution history" });
  }
});

// Cancel running execution
executionRouter.post("/cancel/:jobId", async (req, res) => {
  const { id, jobId } = req.params as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const job = await prisma.backgroundJob.findFirst({
      where: {
        id: jobId,
        userId,
        payload: { path: ["agentId"], equals: id },
        status: 'PROCESSING',
      },
    });

    if (!job) {
      return res.status(404).json({ error: "Running execution not found" });
    }

    // Update job status to cancelled
    await prisma.backgroundJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        error: "Cancelled by user",
        finishedAt: new Date(),
      },
    });

    res.json({
      message: "Execution cancelled successfully",
      agentId: id,
      jobId,
    });

  } catch (error) {
    console.error("Error cancelling execution:", error);
    res.status(500).json({ error: "Failed to cancel execution" });
  }
});

// Get execution details
executionRouter.get("/execution/:jobId", async (req, res) => {
  const { id, jobId } = req.params as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const execution = await prisma.backgroundJob.findFirst({
      where: {
        id: jobId,
        userId,
        payload: { path: ["agentId"], equals: id },
      },
    });

    if (!execution) {
      return res.status(404).json({ error: "Execution not found" });
    }

    res.json({
      id: execution.id,
      type: execution.type,
      status: execution.status,
      payload: execution.payload,
      result: execution.result,
      error: execution.error,
      createdAt: execution.createdAt,
      finishedAt: execution.finishedAt || null,
      duration: execution.finishedAt ? 
        new Date(execution.finishedAt).getTime() - new Date(execution.createdAt).getTime() : 
        null,
    });

  } catch (error) {
    console.error("Error fetching execution details:", error);
    res.status(500).json({ error: "Failed to fetch execution details" });
  }
});

// Batch execute multiple prompts
executionRouter.post("/batch", async (req, res) => {
  const { id } = req.params as any;
  const { prompts, options = {} } = req.body;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    if (!Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({ error: "Prompts must be a non-empty array" });
    }

    // Load agent instance
    let agentInstance = AgentFactory.getAgent(id);
    if (!agentInstance) {
      agentInstance = await AgentFactory.loadAgentFromDatabase(id);
      if (!agentInstance) {
        return res.status(500).json({ error: "Failed to load agent" });
      }
    }

    // Create batch job
    const batchJob = await prisma.backgroundJob.create({
      data: {
        userId,
        type: 'BATCH_EXECUTION',
        status: 'PROCESSING',
        payload: {
          agentId: id,
          prompts,
          options,
          startTime: new Date().toISOString(),
        },
      },
    });

    // Execute prompts in parallel
    const results = await Promise.allSettled(
      prompts.map(async (prompt, index) => {
        try {
          const result = await agentInstance.generate({
            prompt,
            ...options,
          });

          return {
            index,
            prompt,
            success: true,
            response: result.text,
            usage: result.usage,
            finishReason: result.finishReason,
          };
        } catch (error: unknown) {
          return {
            index,
            prompt,
            success: false,
            error: String((error as Error)?.message || error),
          };
        }
      })
    );

    // Update batch job
    await prisma.backgroundJob.update({
      where: { id: batchJob.id },
      data: {
        status: 'COMPLETED',
        result: {
          results,
          totalPrompts: prompts.length,
          successful: results.filter(
            (r) => r.status === "fulfilled" && (r as PromiseFulfilledResult<any>).value?.success
          ).length,
          failed: results.filter(
            (r) =>
              r.status === "rejected" ||
              (r.status === "fulfilled" && !(r as PromiseFulfilledResult<any>).value?.success)
          ).length,
        } as any,
        finishedAt: new Date(),
      },
    });

    res.json({
      success: true,
      batchId: batchJob.id,
      results: results.map(r => r.status === 'fulfilled' ? r.value : r.reason),
      summary: {
        total: prompts.length,
        successful: results.filter(
          (r) => r.status === "fulfilled" && (r as PromiseFulfilledResult<any>).value?.success
        ).length,
        failed: results.filter(
          (r) =>
            r.status === "rejected" ||
            (r.status === "fulfilled" && !(r as PromiseFulfilledResult<any>).value?.success)
        ).length,
      }
    });

  } catch (error) {
    console.error("Error in batch execution:", error);
    res.status(500).json({ error: "Failed to execute batch prompts" });
  }
});

export default executionRouter;

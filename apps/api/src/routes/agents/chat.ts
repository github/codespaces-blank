import express from "express";
import { prisma } from "@repo/database";
import { AgentFactory, SubAgentFactory } from "../../lib/agentFactory.js";
import { tool, readUIMessageStream, streamText, convertToModelMessages } from "ai";
import { z } from "zod";
import { resolveGoogleModel } from "../../lib/model-registry.js";

const chatRouter = express.Router({ mergeParams: true });

// POST /api/agents/:agentId/chat
chatRouter.post("/", async (req, res) => {
  const { id } = req.params as { id: string };
  const { messages } = req.body as { messages: unknown[] };
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    let agentInstance = AgentFactory.getAgent(id);
    if (!agentInstance) {
      agentInstance = await AgentFactory.loadAgentFromDatabase(id);
      if (!agentInstance) {
        return res.status(500).json({ error: "Failed to load agent" });
      }
    }

    const modelMessages = await convertToModelMessages(messages as any);
    const stream = await (agentInstance as any).stream({ messages: modelMessages });
    stream.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Error in agent chat:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to process chat request" });
    }
  }
});

// POST /api/agents/:agentId/chat/generate
chatRouter.post("/generate", async (req, res) => {
  const { id } = req.params as { id: string };
  const { prompt } = req.body as { prompt: string };
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    let agentInstance = AgentFactory.getAgent(id);
    if (!agentInstance) {
      agentInstance = await AgentFactory.loadAgentFromDatabase(id);
      if (!agentInstance) {
        return res.status(500).json({ error: "Failed to load agent" });
      }
    }

    const result = await (agentInstance as any).generate({
      prompt: prompt || "",
    });

    res.json({
      text: result.text,
      usage: result.usage,
      finishReason: result.finishReason,
    });
  } catch (error) {
    console.error("Error in agent generate:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// POST /api/agents/:agentId/chat/with-subagents
chatRouter.post("/with-subagents", async (req, res) => {
  const { id } = req.params as { id: string };
  const { messages, enableSubagents = true } = req.body as {
    messages: unknown[];
    enableSubagents?: boolean;
  };
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const researchSubagent = await SubAgentFactory.createResearchSubagent();
    const codeSubagent = await SubAgentFactory.createCodeSubagent();

    const researchTool = tool({
      description: "Research a topic or question in depth.",
      inputSchema: z.object({
        task: z.string().describe("The research task to complete"),
      }),
      execute: async function* ({ task }, { abortSignal }) {
        const result = await (researchSubagent as any).stream({
          prompt: task,
          abortSignal,
        });

        for await (const message of readUIMessageStream({
          stream: result.toUIMessageStream(),
        })) {
          yield message;
        }
      },
      toModelOutput: ({ output: message }) => {
        const parts = message?.parts || [];
        let lastText: { type: string; text?: string } | undefined;
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i] as { type: string; text?: string };
          if (p.type === "text") {
            lastText = p;
            break;
          }
        }
        return {
          type: "text",
          value: lastText?.text ?? "Research completed.",
        };
      },
    });

    const codeTool = tool({
      description: "Write, analyze, or modify code.",
      inputSchema: z.object({
        task: z.string().describe("The coding task to complete"),
      }),
      execute: async function* ({ task }, { abortSignal }) {
        const result = await (codeSubagent as any).stream({
          prompt: task,
          abortSignal,
        });

        for await (const message of readUIMessageStream({
          stream: result.toUIMessageStream(),
        })) {
          yield message;
        }
      },
      toModelOutput: ({ output: message }) => {
        const parts = message?.parts || [];
        let lastText: { type: string; text?: string } | undefined;
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i] as { type: string; text?: string };
          if (p.type === "text") {
            lastText = p;
            break;
          }
        }
        return {
          type: "text",
          value: lastText?.text ?? "Code task completed.",
        };
      },
    });

    let agentInstance = AgentFactory.getAgent(id);
    if (!agentInstance) {
      agentInstance = await AgentFactory.loadAgentFromDatabase(id);
      if (!agentInstance) {
        return res.status(500).json({ error: "Failed to load agent" });
      }
    }

    const modelMessages = await convertToModelMessages(messages as any);
    const model = resolveGoogleModel(agent.model);

    const response = await streamText({
      model,
      system: agent.instructions || undefined,
      messages: modelMessages,
      tools: {
        ...(agentInstance.tools as any),
        ...(enableSubagents ? { research: researchTool, code: codeTool } : {}),
      },
    });

    response.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Error in agent chat with subagents:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to process chat request" });
    }
  }
});

// GET /api/agents/:agentId/chat/history
chatRouter.get("/history", async (req, res) => {
  const { id } = req.params as { id: string };
  const { limit = "50" } = req.query as { limit?: string };
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const conversations = await prisma.backgroundJob.findMany({
      where: {
        userId,
        payload: { path: ["agentId"], equals: id },
        type: "CHAT",
      },
      take: parseInt(limit, 10),
      orderBy: { createdAt: "desc" },
    });

    const history = conversations.map((job) => ({
      id: job.id,
      timestamp: job.createdAt,
      role: (job.payload as any)?.role || "user",
      content: (job.payload as any)?.content || "",
      agentResponse: job.result,
    }));

    res.json({ history, total: history.length });
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    res.status(500).json({ error: "Failed to fetch conversation history" });
  }
});

// DELETE /api/agents/:agentId/chat/history
chatRouter.delete("/history", async (req, res) => {
  const { id } = req.params as { id: string };
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    await prisma.backgroundJob.deleteMany({
      where: {
        userId,
        payload: { path: ["agentId"], equals: id },
        type: "CHAT",
      },
    });

    res.json({ message: "Conversation history cleared successfully" });
  } catch (error) {
    console.error("Error clearing conversation history:", error);
    res.status(500).json({ error: "Failed to clear conversation history" });
  }
});

export default chatRouter;

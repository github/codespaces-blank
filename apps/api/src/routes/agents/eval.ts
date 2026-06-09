import express from "express";
import { prisma } from "@repo/database";
import { AgentFactory } from "../../lib/agentFactory.js";

const evalRouter = express.Router({ mergeParams: true });

evalRouter.post("/", async (req, res) => {
  const { id } = req.params as { id: string };
  const userId = (req as any).user?.uid;
  const { questions } = req.body as { questions?: string[] };

  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "questions must be a non-empty array" });
  }

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    AgentFactory.updateAgent(id);
    const instance =
      AgentFactory.getAgent(id) || (await AgentFactory.loadAgentFromDatabase(id));
    if (!instance) return res.status(500).json({ error: "Failed to load agent" });

    const runs = [];
    for (const q of questions.slice(0, 20)) {
      const r = await (instance as any).generate({
        prompt: `Evaluation item — answer succinctly with factual grounding when possible:\n\n${q}`,
      });
      runs.push({
        question: q,
        answer: r.text,
        usage: r.usage,
        finishReason: r.finishReason,
      });
    }

    await prisma.backgroundJob.create({
      data: {
        userId,
        type: "AGENT_EVAL",
        status: "COMPLETED",
        payload: { agentId: id, questionCount: runs.length },
        result: { runs },
        finishedAt: new Date(),
      },
    });

    res.json({ agentId: id, runs, evaluatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("eval error:", error);
    res.status(500).json({ error: "Evaluation failed" });
  }
});

export default evalRouter;

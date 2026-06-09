import express from "express";
import { prisma } from "@repo/database";

// mergeParams: true is necessary to access :id from the parent router
const configRouter = express.Router({ mergeParams: true });

// Get agent configuration
configRouter.get("/", async (req, res) => {
  const { id } = req.params as any;
  const userId = (req as any).user?.uid;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const agent = await prisma.agent.findUnique({
      where: { id },
      select: { config: true, instructions: true, model: true, userId: true }
    });
    
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    
    if (agent.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    const { config, instructions, model } = agent;
    res.json({ config, instructions, model });
  } catch (error) {
    console.error("Error fetching agent config:", error);
    res.status(500).json({ error: "Failed to fetch agent config" });
  }
});

// Update agent configuration
configRouter.put("/", async (req, res) => {
  const { id } = req.params as any;
  const userId = (req as any).user?.uid;
  const { config, instructions, model } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const agent = await prisma.agent.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    if (agent.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: {
        config: config ?? undefined,
        instructions: instructions ?? undefined,
        model: model ?? undefined,
      }
    });
    
    res.json(updatedAgent);
  } catch (error) {
    console.error("Error updating agent config:", error);
    res.status(500).json({ error: "Failed to update agent config" });
  }
});

export default configRouter;

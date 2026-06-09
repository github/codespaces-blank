import express from "express";
import { prisma } from "@repo/database";

const integrationsRouter = express.Router({ mergeParams: true });

// Get agent integrations
integrationsRouter.get("/", async (req, res) => {
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

    const integrations = await prisma.agentIntegration.findMany({
      where: { agentId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(integrations);
  } catch (error) {
    console.error("Error fetching integrations:", error);
    res.status(500).json({ error: "Failed to fetch integrations" });
  }
});

// Create integration
integrationsRouter.post("/", async (req, res) => {
  const { id: agentId } = req.params as any;
  const userId = (req as any).user?.uid;
  const { name, type, config } = req.body;

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

    const integration = await prisma.agentIntegration.create({
      data: {
        agentId,
        userId,
        name,
        type,
        config: config || {},
        status: 'active'
      }
    });

    res.status(201).json(integration);
  } catch (error) {
    console.error("Error creating integration:", error);
    res.status(500).json({ error: "Failed to create integration" });
  }
});

// Update integration
integrationsRouter.put("/:integrationId", async (req, res) => {
  const { id: agentId, integrationId } = req.params as any;
  const userId = (req as any).user?.uid;
  const { name, config, status } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify authorization
    const integration = await prisma.agentIntegration.findUnique({
      where: { id: integrationId }
    });

    if (!integration) {
      return res.status(404).json({ error: "Integration not found" });
    }

    if (integration.userId !== userId || integration.agentId !== agentId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await prisma.agentIntegration.update({
      where: { id: integrationId },
      data: {
        ...(name && { name }),
        ...(config && { config }),
        ...(status && { status })
      }
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating integration:", error);
    res.status(500).json({ error: "Failed to update integration" });
  }
});

// Delete integration
integrationsRouter.delete("/:integrationId", async (req, res) => {
  const { id: agentId, integrationId } = req.params as any;
  const userId = (req as any).user?.uid;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const integration = await prisma.agentIntegration.findUnique({
      where: { id: integrationId }
    });

    if (!integration) {
      return res.status(404).json({ error: "Integration not found" });
    }

    if (integration.userId !== userId || integration.agentId !== agentId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.agentIntegration.delete({
      where: { id: integrationId }
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting integration:", error);
    res.status(500).json({ error: "Failed to delete integration" });
  }
});

export default integrationsRouter;

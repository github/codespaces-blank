import express from "express";
import { prisma } from "@repo/database";

const connectorRouter = express.Router({ mergeParams: true });

// List all connectors for an agent (or globally for the user)
connectorRouter.get("/", async (req, res) => {
  const userId = (req as any).user.uid;
  try {
    const connectors = await prisma.connector.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    res.json(connectors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch connectors" });
  }
});

// Create/Register a new platform connector
connectorRouter.post("/", async (req, res) => {
  const userId = (req as any).user.uid;
  const { name, type, config } = req.body;

  try {
    const connector = await prisma.connector.create({
      data: {
        name,
        type,
        config,
        userId,
        status: "DISCONNECTED"
      }
    });
    res.json(connector);
  } catch (error) {
    res.status(500).json({ error: "Failed to create connector" });
  }
});

// Update connector status or config
connectorRouter.put("/:connectorId", async (req, res) => {
  const userId = (req as any).user.uid;
  const { connectorId } = req.params;
  const { status, config } = req.body;

  try {
    const connector = await prisma.connector.updateMany({
      where: { id: connectorId, userId },
      data: { status, config }
    });

    if (connector.count === 0) return res.status(404).json({ error: "Connector not found" });
    res.json({ message: "Connector updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update connector" });
  }
});

export default connectorRouter;

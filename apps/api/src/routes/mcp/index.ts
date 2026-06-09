import express from "express";
import { prisma } from "@repo/database";

const mcpRouter = express.Router();

// Get all connected MCP servers
mcpRouter.get("/", async (req, res) => {
  try {
    const connectors = await prisma.connector.findMany({
      where: { type: "MCP" }
    });
    res.json(connectors);
  } catch (error) {
    console.error("Error fetching MCP connections:", error);
    res.status(500).json({ error: "Failed to fetch MCP connections" });
  }
});

// Register a new MCP server
mcpRouter.post("/register", async (req, res) => {
  const { name, url, config, userId } = req.body;
  
  try {
    const connector = await prisma.connector.create({
      data: {
        name,
        type: "MCP",
        status: "CONNECTED",
        config: config || { url },
        userId
      }
    });
    res.status(201).json(connector);
  } catch (error) {
    console.error("Error registering MCP connection:", error);
    res.status(500).json({ error: "Failed to register MCP connection" });
  }
});

export default mcpRouter;

import express from "express";
import { prisma } from "@repo/database";

const knowledgeRouter = express.Router({ mergeParams: true });

knowledgeRouter.get("/", async (req, res) => {
  const { id } = req.params as { id: string };
  const userId = (req as any).user?.uid;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const sources = await (prisma as any).agentKnowledgeSource.findMany({
      where: { agentId: id },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ agentId: id, sources });
  } catch (error) {
    console.error("knowledge list error:", error);
    res.status(500).json({ error: "Failed to list knowledge sources" });
  }
});

knowledgeRouter.post("/", async (req, res) => {
  const { id } = req.params as { id: string };
  const userId = (req as any).user?.uid;
  const { name, mimeType, content, storageUrl, sizeBytes } = req.body as {
    name: string;
    mimeType?: string;
    content?: string;
    storageUrl?: string;
    sizeBytes?: number;
  };

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!name?.trim()) {
    return res.status(400).json({ error: "name is required" });
  }

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const text = content || "";
    const chunks = Math.max(1, Math.ceil(text.length / 4000));

    const source = await (prisma as any).agentKnowledgeSource.create({
      data: {
        agentId: id,
        userId,
        name: name.trim(),
        mimeType: mimeType || "text/plain",
        sizeBytes: sizeBytes ?? Buffer.byteLength(text, "utf8"),
        content: text || null,
        storageUrl: storageUrl || null,
        status: text ? "indexed" : "pending",
        chunkCount: text ? chunks : 0,
      },
    });

    res.status(201).json({ source });
  } catch (error) {
    console.error("knowledge create error:", error);
    res.status(500).json({ error: "Failed to add knowledge source" });
  }
});

knowledgeRouter.delete("/:sourceId", async (req, res) => {
  const { id, sourceId } = req.params as { id: string; sourceId: string };
  const userId = (req as any).user?.uid;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const result = await (prisma as any).agentKnowledgeSource.deleteMany({
      where: { id: sourceId, agentId: id, userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Source not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("knowledge delete error:", error);
    res.status(500).json({ error: "Failed to delete knowledge source" });
  }
});

export default knowledgeRouter;

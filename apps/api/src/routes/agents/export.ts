import express from "express";
import { prisma } from "@repo/database";

const exportRouter = express.Router({ mergeParams: true });

function escapeCsvCell(s: string) {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

exportRouter.post("/", async (req, res) => {
  const { id } = req.params as { id: string };
  const userId = (req as any).user?.uid;
  const { format, text, jobId } = req.body as {
    format?: string;
    text?: string;
    jobId?: string;
  };

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    let content = text || "";
    if (jobId) {
      const job = await prisma.backgroundJob.findFirst({
        where: { id: jobId, userId },
      });
      if (!job) return res.status(404).json({ error: "Job not found" });
      content =
        typeof job.result === "string"
          ? job.result
          : JSON.stringify(job.result ?? {}, null, 2);
    }

    if (!content.trim()) {
      return res.status(400).json({ error: "Provide text or jobId with a result" });
    }

    const fmt = (format || "markdown").toLowerCase();

    if (fmt === "json") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="agent-${id}-export.json"`
      );
      return res.send(
        JSON.stringify(
          { agentId: id, exportedAt: new Date().toISOString(), body: content },
          null,
          2
        )
      );
    }

    if (fmt === "csv") {
      const lines = content.split("\n").filter(Boolean);
      const csv = lines.map((line) => escapeCsvCell(line)).join("\n");
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="agent-${id}-export.csv"`
      );
      return res.send(csv);
    }

    if (fmt === "pdf") {
      return res.status(501).json({
        error: "PDF export requires a document service; use markdown or json for now",
      });
    }

    if (fmt === "docx") {
      return res.status(501).json({
        error: "DOCX export is not enabled in this deployment",
      });
    }

    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="agent-${id}-export.md"`
    );
    return res.send(`# Export — ${agent.name}\n\n${content}`);
  } catch (error) {
    console.error("export error:", error);
    res.status(500).json({ error: "Export failed" });
  }
});

export default exportRouter;

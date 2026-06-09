import { tool } from "ai";
import { z } from "zod";
import { prisma } from "@repo/database";

export const updateTaskStatusTool = tool({
  description: "Update the status of a task",
  inputSchema: z.object({
    taskId: z.string(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]),
  }),
  execute: async ({ taskId, status }) => {
    return await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  },
});

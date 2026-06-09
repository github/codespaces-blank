import { tool } from "ai";
import { z } from "zod";
import { prisma } from "@repo/database";

export const getTaskDetailsTool = tool({
  description: "Get detailed information about a specific task",
  inputSchema: z.object({
    taskId: z.string().describe("The ID of the task to retrieve"),
  }),
  execute: async ({ taskId }) => {
    return await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignee: true },
    });
  },
});

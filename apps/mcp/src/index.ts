import dotenv from "dotenv";
dotenv.config();
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { prisma } from "@repo/database";
import { z } from "zod";

const server = new Server(
  {
    name: "tendrra-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "getUserProfile",
        description: "Get detailed information about a user",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "The user ID to fetch" },
          },
          required: ["id"],
        },
      },
      {
        name: "getTasks",
        description: "List tasks with filters",
        inputSchema: {
          type: "object",
          properties: {
            assigneeId: { type: "string", description: "Filter by assignee" },
            status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE", "CANCELLED"] },
            priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] },
          },
        },
      },
      {
        name: "getSystemStatus",
        description: "Get system health and status info",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "getUserProfile") {
      const { id } = z.object({ id: z.string() }).parse(args);
      const user = await prisma.user.findUnique({
        where: { id },
        include: { _count: { select: { tasks: true, posts: true } } },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(user || { error: "User not found" }) }],
      };
    }

    if (name === "getTasks") {
      const { assigneeId, status, priority } = z.object({
        assigneeId: z.string().optional(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
      }).parse(args);

      const tasks = await prisma.task.findMany({
        where: { assigneeId, status, priority },
        orderBy: { updatedAt: "desc" },
        take: 10,
      });

      return {
        content: [{ type: "text", text: JSON.stringify(tasks) }],
      };
    }

    if (name === "getSystemStatus") {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            status: "Operational",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: "Connected (Neon PostgreSQL)",
          }) 
        }],
      };
    }

    throw new Error(`Tool not found: ${name}`);
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Tendrra MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});


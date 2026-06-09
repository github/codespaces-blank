import { ToolLoopAgent, tool, stepCountIs } from "ai";
import { z } from "zod";
import { prisma } from "@repo/database";
import { webSearch } from "@exalabs/ai-sdk";
import { search as parallelSearch } from "./parallel.js";
import { resolveGoogleModel, DEFAULT_GEMINI_MODEL } from "./model-registry.js";

export interface AgentConfig {
  id: string;
  name: string;
  type: string;
  role: string;
  description: string;
  model: string;
  instructions: string;
  tools: any[];
  config: Record<string, any>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodSchema;
  execute: (input: any, context?: any) => Promise<any>;
}

const stubTools: Record<string, ToolDefinition> = {
  fileRead: {
    name: "fileRead",
    description: "Read file contents (sandbox stub — wire to storage for production)",
    inputSchema: z.object({
      path: z.string().describe("File path to read"),
    }),
    execute: async ({ path }) => ({ content: `[stub] No filesystem binding for: ${path}` }),
  },
  fileWrite: {
    name: "fileWrite",
    description: "Write content to a file (sandbox stub)",
    inputSchema: z.object({
      path: z.string().describe("File path to write"),
      content: z.string().describe("Content to write"),
    }),
    execute: async ({ path }) => ({ success: true, message: `[stub] Would write to ${path}` }),
  },
  codeExecution: {
    name: "codeExecution",
    description: "Execute code in a sandboxed environment (stub)",
    inputSchema: z.object({
      code: z.string().describe("Code to execute"),
      language: z
        .enum(["javascript", "python", "typescript"])
        .describe("Programming language"),
    }),
    execute: async ({ language }) => ({
      output: `[stub] ${language} execution is not enabled in this deployment`,
    }),
  },
};

function buildToolsForAgent(config: AgentConfig): Record<string, any> {
  const tools: Record<string, any> = {};
  const enabled: string[] = config.config?.enabledTools || [];

  if (enabled.includes("webSearch")) {
    tools.webSearch = webSearch();
  }

  if (enabled.includes("parallelWebSearch")) {
    tools.parallelWebSearch = tool({
      description:
        "Run a Parallel web search with multiple queries for deeper coverage (requires PARALLEL_API_KEY)",
      inputSchema: z.object({
        objective: z.string().describe("Overall research objective"),
        queries: z
          .array(z.string())
          .min(1)
          .max(8)
          .describe("Distinct search queries to run"),
      }),
      execute: async ({ objective, queries }) => {
        if (!process.env.PARALLEL_API_KEY) {
          return {
            error: "PARALLEL_API_KEY is not configured",
            objective,
            queries,
          };
        }
        try {
          return await parallelSearch(objective, queries);
        } catch (e) {
          return { error: String(e), objective, queries };
        }
      },
    });
  }

  if (enabled.includes("knowledgeSearch")) {
    const agentId = config.id;
    tools.knowledgeSearch = tool({
      description:
        "Search this agent's knowledge base (uploaded sources and text) by keyword",
      inputSchema: z.object({
        query: z.string().describe("Keywords to find in titles or content"),
      }),
      execute: async ({ query }) => {
        const rows = await (prisma as any).agentKnowledgeSource.findMany({
          where: {
            agentId,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 20,
          orderBy: { updatedAt: "desc" },
        });
        return {
          sources: rows.map((r) => ({
            id: r.id,
            name: r.name,
            status: r.status,
            chunkCount: r.chunkCount,
            excerpt: (r.content || "").slice(0, 800),
          })),
        };
      },
    });
  }

  for (const name of enabled) {
    const def = stubTools[name];
    if (def && !tools[name]) {
      tools[name] = tool({
        description: def.description,
        inputSchema: def.inputSchema,
        execute: def.execute,
      });
    }
  }

  if (config.config.customTools) {
    for (const customTool of config.config.customTools) {
      try {
        const toolConfig =
          typeof customTool === "string" ? JSON.parse(customTool) : customTool;
        tools[toolConfig.name] = tool({
          description: toolConfig.description,
          inputSchema: z.object({ input: z.unknown() }),
          execute: new Function("input", toolConfig.executeFunction) as any,
        }) as any;
      } catch (error) {
        console.warn(`Failed to load custom tool: ${customTool}`, error);
      }
    }
  }

  return tools;
}

export class AgentFactory {
  private static agents: Map<string, ToolLoopAgent<any, any, any>> = new Map();

  static async createAgent(config: AgentConfig): Promise<ToolLoopAgent<any, any, any>> {
    const model = resolveGoogleModel(config.model || DEFAULT_GEMINI_MODEL);
    const tools = buildToolsForAgent(config);

    const agent = new ToolLoopAgent({
      model,
      instructions:
        config.instructions ||
        `You are ${config.name}, a ${config.role}. ${config.description}`,
      tools,
      stopWhen: stepCountIs(
        typeof config.config.maxSteps === "number" && config.config.maxSteps > 0
          ? config.config.maxSteps
          : 20
      ),
      toolChoice: (config.config.toolChoice as any) || "auto",
      onStepFinish: config.config.enableLogging
        ? async ({ stepNumber, usage, finishReason, toolCalls }) => {
            console.log(`Agent ${config.id} - Step ${stepNumber}:`, {
              inputTokens: usage?.inputTokens,
              outputTokens: usage?.outputTokens,
              finishReason,
              toolsUsed: toolCalls?.map((tc) => tc.toolName),
            });
          }
        : undefined,
    });

    this.agents.set(config.id, agent);
    return agent;
  }

  static getAgent(id: string): ToolLoopAgent<any, any, any> | null {
    return this.agents.get(id) || null;
  }

  static async loadAgentFromDatabase(id: string): Promise<ToolLoopAgent<any, any, any> | null> {
    try {
      const agentData = await prisma.agent.findUnique({
        where: { id },
      });

      if (!agentData) {
        return null;
      }

      const config: AgentConfig = {
        id: agentData.id,
        name: agentData.name,
        type: agentData.type,
        role: agentData.role,
        description: agentData.description || "",
        model: agentData.model || DEFAULT_GEMINI_MODEL,
        instructions: agentData.instructions || "",
        tools: [],
        config: agentData.config as Record<string, any>,
      };

      return await this.createAgent(config);
    } catch (error) {
      console.error("Failed to load agent from database:", error);
      return null;
    }
  }

  static updateAgent(id: string, _config?: Partial<AgentConfig>): void {
    this.agents.delete(id);
  }

  static deleteAgent(id: string): void {
    this.agents.delete(id);
  }

  static getAvailableModels(): string[] {
    return [
      "gemini-2.5-pro-preview-05-06",
      "gemini-2.0-flash-exp",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
    ];
  }

  static getAvailableTools(): string[] {
    return [
      "webSearch",
      "parallelWebSearch",
      "knowledgeSearch",
      "fileRead",
      "fileWrite",
      "codeExecution",
    ];
  }
}

export class SubAgentFactory {
  static async createResearchSubagent(): Promise<ToolLoopAgent<any, any, any>> {
    return new ToolLoopAgent({
      model: resolveGoogleModel(DEFAULT_GEMINI_MODEL),
      instructions: `You are a research agent. Complete the task autonomously.

IMPORTANT: When you have finished, write a clear summary of your findings as your final response.
This summary will be returned to the main agent, so include all relevant information.`,
      tools: {
        webSearch: webSearch(),
        parallelWebSearch: tool({
          description: "Parallel multi-query web search",
          inputSchema: z.object({
            objective: z.string(),
            queries: z.array(z.string()).min(1).max(8),
          }),
          execute: async ({ objective, queries }) => {
            if (!process.env.PARALLEL_API_KEY) {
              return { error: "PARALLEL_API_KEY not configured" };
            }
            return parallelSearch(objective, queries);
          },
        }),
      },
    });
  }

  static async createCodeSubagent(): Promise<ToolLoopAgent<any, any, any>> {
    return new ToolLoopAgent({
      model: resolveGoogleModel(DEFAULT_GEMINI_MODEL),
      instructions: `You are a coding agent. Write, analyze, and modify code.

IMPORTANT: Provide complete, working code solutions with proper error handling.`,
      tools: {
        fileRead: tool({
          description: "Read file contents",
          inputSchema: z.object({
            path: z.string().describe("File path to read"),
          }),
          execute: async ({ path }) => ({
            content: `[stub] Would read: ${path}`,
          }),
        }),
        fileWrite: tool({
          description: "Write code to a file",
          inputSchema: z.object({
            path: z.string().describe("File path"),
            content: z.string().describe("Code content"),
          }),
          execute: async ({ path }) => ({
            success: true,
            message: `[stub] Would write to ${path}`,
          }),
        }),
        codeExecution: tool({
          description: "Execute code for testing",
          inputSchema: z.object({
            code: z.string().describe("Code to execute"),
            language: z.enum(["javascript", "python", "typescript"]),
          }),
          execute: async ({ language }) => ({
            output: `[stub] ${language} execution disabled`,
          }),
        }),
      },
    });
  }
}

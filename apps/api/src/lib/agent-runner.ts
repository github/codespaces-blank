import { prisma } from "@repo/database";
import { AgentFactory } from "./agentFactory.js";

export async function executeAgentTask(agentId: string, task: string) {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
  });

  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }

  AgentFactory.updateAgent(agentId);
  const instance =
    AgentFactory.getAgent(agentId) ||
    (await AgentFactory.loadAgentFromDatabase(agentId));

  if (!instance) {
    throw new Error(`Failed to load agent ${agentId}`);
  }

  const { text, toolCalls, toolResults, usage, finishReason } =
    await (instance as any).generate({
      prompt: `Execute this task and report results clearly:\n\n${task}`,
    });

  await prisma.auditLog.create({
    data: {
      userId: agent.userId,
      action: "AGENT_TASK_EXECUTED",
      entity: "Agent",
      entityId: agentId,
      newData: { task, output: text, toolCalls, toolResults, usage, finishReason } as any,
    },
  });

  return {
    output: text,
    steps: toolCalls,
    results: toolResults,
    usage,
    finishReason,
  };
}

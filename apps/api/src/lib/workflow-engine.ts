import { prisma } from "@repo/database";
import { search, extract } from "./parallel.js";

export async function executeWorkflow(workflowId: string, inputData: any) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) throw new Error("Workflow not found");

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      status: "RUNNING",
    },
  });

  const logs: any[] = [];
  const results: any = { input: inputData };

  try {
    const nodes = (workflow.definition as any).nodes || [];
    
    for (const node of nodes) {
      logs.push({ step: node.name, type: node.type, startedAt: new Date() });
      
      let nodeResult;
      switch (node.type) {
        case 'SEARCH':
          nodeResult = await search(node.params.objective, node.params.queries);
          break;
        case 'EXTRACT':
          nodeResult = await extract(node.params.url, node.params.objective);
          break;
        case 'DATABASE_QUERY':
          // Simplified database lookup
          nodeResult = await (prisma as any)[node.params.model].findMany({ where: node.params.where });
          break;
        default:
          nodeResult = { status: 'skipped', reason: 'unknown type' };
      }
      
      results[node.id] = nodeResult;
      logs[logs.length - 1].finishedAt = new Date();
      logs[logs.length - 1].result = nodeResult;
    }

    await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: "COMPLETED",
        logs: { steps: logs, results },
        finishedAt: new Date(),
      },
    });

    return results;
  } catch (error) {
    await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: "FAILED",
        logs: { steps: logs, error: String(error) },
        finishedAt: new Date(),
      },
    });
    throw error;
  }
}

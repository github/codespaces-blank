import express from "express";
import { prisma } from "@repo/database";
import { authenticate } from "../../middleware/auth.js";
import { AgentFactory, SubAgentFactory } from "../../lib/agentFactory.js";
import { resolveGoogleModel } from "../../lib/model-registry.js";
import { ToolLoopAgent, tool, readUIMessageStream } from 'ai';
import { z } from 'zod';

const workflowsRouter = express.Router({ mergeParams: true });

// Workflow patterns
const WORKFLOW_PATTERNS = {
  sequential: {
    name: 'Sequential Processing',
    description: 'Execute steps in a predefined order where each step builds on the previous',
    useCase: 'Content generation pipelines, data transformation processes'
  },
  parallel: {
    name: 'Parallel Processing',
    description: 'Execute independent tasks simultaneously for efficiency',
    useCase: 'Multiple document analysis, concurrent research'
  },
  evaluator_optimizer: {
    name: 'Evaluator-Optimizer Loop',
    description: 'Iteratively improve results through evaluation and optimization',
    useCase: 'Content refinement, translation quality improvement'
  },
  orchestrator_worker: {
    name: 'Orchestrator-Worker',
    description: 'Coordinate multiple specialized workers for complex tasks',
    useCase: 'Feature implementation, multi-domain analysis'
  },
  routing: {
    name: 'Routing',
    description: 'Dynamically direct work based on context and requirements',
    useCase: 'Customer support, task categorization'
  }
};

// Get available workflow patterns
workflowsRouter.get("/patterns", async (req, res) => {
  try {
    res.json({
      patterns: WORKFLOW_PATTERNS,
      categories: ['processing', 'coordination', 'optimization', 'routing']
    });
  } catch (error) {
    console.error("Error fetching workflow patterns:", error);
    res.status(500).json({ error: "Failed to fetch workflow patterns" });
  }
});

// Execute sequential workflow
workflowsRouter.post("/:id/sequential", async (req, res) => {
  const { id } = req.params as any;
  const { steps, input, options = {} } = req.body;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ error: "Steps must be a non-empty array" });
    }

    // Load main agent
    let agentInstance = AgentFactory.getAgent(id);
    if (!agentInstance) {
      agentInstance = await AgentFactory.loadAgentFromDatabase(id);
      if (!agentInstance) {
        return res.status(500).json({ error: "Failed to load agent" });
      }
    }

    // Create workflow job
    const workflowJob = await prisma.backgroundJob.create({
      data: {
        userId,
        type: 'SEQUENTIAL_WORKFLOW',
        status: 'PROCESSING',
        payload: {
          agentId: id,
          workflowType: 'sequential',
          steps,
          input,
          options,
          startTime: new Date().toISOString(),
        },
      },
    });

    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    try {
      let currentInput = input;
      const results = [];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        res.write(`data: ${JSON.stringify({
          type: 'step_start',
          step: i + 1,
          totalSteps: steps.length,
          stepName: step.name || `Step ${i + 1}`,
          input: currentInput,
        })}\n\n`);

        try {
          const result = await (agentInstance as any).generate({
            prompt: `${step.prompt || ''}\n\nInput: ${currentInput}`,
            options: {
              ...options,
              ...step.options,
            },
          });

          currentInput = result.text;
          results.push({
            step: i + 1,
            name: step.name || `Step ${i + 1}`,
            input: step.prompt || '',
            output: result.text,
            usage: result.usage,
            finishReason: result.finishReason,
          });

          res.write(`data: ${JSON.stringify({
            type: 'step_complete',
            step: i + 1,
            totalSteps: steps.length,
            stepName: step.name || `Step ${i + 1}`,
            output: result.text,
            usage: result.usage,
          })}\n\n`);

        } catch (stepError) {
          results.push({
            step: i + 1,
            name: step.name || `Step ${i + 1}`,
            error: stepError.message,
          });

          res.write(`data: ${JSON.stringify({
            type: 'step_error',
            step: i + 1,
            totalSteps: steps.length,
            stepName: step.name || `Step ${i + 1}`,
            error: stepError.message,
          })}\n\n`);

          if (!step.continueOnError) {
            throw stepError;
          }
        }
      }

      // Update workflow job
      await prisma.backgroundJob.update({
        where: { id: workflowJob.id },
        data: {
          status: 'COMPLETED',
          result: {
            results,
            finalOutput: currentInput,
            totalSteps: steps.length,
            completedAt: new Date().toISOString(),
          },
        },
      });

      res.write(`data: ${JSON.stringify({
        type: 'workflow_complete',
        results,
        finalOutput: currentInput,
        workflowId: workflowJob.id,
      })}\n\n`);
      res.end();

    } catch (workflowError) {
      await prisma.backgroundJob.update({
        where: { id: workflowJob.id },
        data: {
          status: 'FAILED',
          error: workflowError.message,
        },
      });

      if (!res.headersSent) {
        res.status(500).json({ error: "Workflow execution failed" });
      }
    }

  } catch (error) {
    console.error("Error in sequential workflow:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to execute sequential workflow" });
    }
  }
});

// Execute parallel workflow
workflowsRouter.post("/:id/parallel", async (req, res) => {
  const { id } = req.params as any;
  const { tasks, input, options = {} } = req.body;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "Tasks must be a non-empty array" });
    }

    let agentInstance = AgentFactory.getAgent(id);
    if (!agentInstance) {
      agentInstance = await AgentFactory.loadAgentFromDatabase(id);
      if (!agentInstance) {
        return res.status(500).json({ error: "Failed to load agent" });
      }
    }

    const workflowJob = await prisma.backgroundJob.create({
      data: {
        userId,
        type: 'PARALLEL_WORKFLOW',
        status: 'PROCESSING',
        payload: {
          agentId: id,
          workflowType: 'parallel',
          tasks,
          input,
          options,
          startTime: new Date().toISOString(),
        },
      },
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    try {
      // Execute tasks in parallel
      const taskPromises = tasks.map(async (task, index) => {
        try {
          res.write(`data: ${JSON.stringify({
            type: 'task_start',
            task: index + 1,
            totalTasks: tasks.length,
            taskName: task.name || `Task ${index + 1}`,
          })}\n\n`);

          const result = await (agentInstance as any).generate({
            prompt: `${task.prompt || ''}\n\nInput: ${input}`,
            options: {
              ...options,
              ...task.options,
            },
          });

          res.write(`data: ${JSON.stringify({
            type: 'task_complete',
            task: index + 1,
            totalTasks: tasks.length,
            taskName: task.name || `Task ${index + 1}`,
            output: result.text,
            usage: result.usage,
          })}\n\n`);

          return {
            task: index + 1,
            name: task.name || `Task ${index + 1}`,
            success: true,
            output: result.text,
            usage: result.usage,
            finishReason: result.finishReason,
          };
        } catch (taskError) {
          res.write(`data: ${JSON.stringify({
            type: 'task_error',
            task: index + 1,
            totalTasks: tasks.length,
            taskName: task.name || `Task ${index + 1}`,
            error: taskError.message,
          })}\n\n`);

          return {
            task: index + 1,
            name: task.name || `Task ${index + 1}`,
            success: false,
            error: taskError.message,
          };
        }
      });

      const results = await Promise.all(taskPromises);

      // Aggregate results
      const successfulTasks = results.filter(r => r.success);
      const failedTasks = results.filter(r => !r.success);

      // Create summary
      const summaryPrompt = `Synthesize these parallel task results into a cohesive summary:

${successfulTasks.map(task => `Task ${task.task} (${task.name}): ${task.output}`).join('\n\n')}

${failedTasks.length > 0 ? `\nFailed tasks:\n${failedTasks.map(task => `Task ${task.task} (${task.name}): ${task.error}`).join('\n')}` : ''}`;

      const summaryResult = await (agentInstance as any).generate({
        prompt: summaryPrompt,
      });

      await prisma.backgroundJob.update({
        where: { id: workflowJob.id },
        data: {
          status: 'COMPLETED',
          result: {
            results,
            summary: summaryResult.text,
            totalTasks: tasks.length,
            successfulTasks: successfulTasks.length,
            failedTasks: failedTasks.length,
          },
        },
      });

      res.write(`data: ${JSON.stringify({
        type: 'workflow_complete',
        results,
        summary: summaryResult.text,
        workflowId: workflowJob.id,
        stats: {
          total: tasks.length,
          successful: successfulTasks.length,
          failed: failedTasks.length,
        }
      })}\n\n`);
      res.end();

    } catch (workflowError) {
      await prisma.backgroundJob.update({
        where: { id: workflowJob.id },
        data: {
          status: 'FAILED',
          error: workflowError.message,
        },
      });

      if (!res.headersSent) {
        res.status(500).json({ error: "Parallel workflow failed" });
      }
    }

  } catch (error) {
    console.error("Error in parallel workflow:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to execute parallel workflow" });
    }
  }
});

// Execute evaluator-optimizer workflow
workflowsRouter.post("/:id/evaluator-optimizer", async (req, res) => {
  const { id } = req.params as any;
  const { prompt, evaluationCriteria, maxIterations = 3, options = {} } = req.body;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    let agentInstance = AgentFactory.getAgent(id);
    if (!agentInstance) {
      agentInstance = await AgentFactory.loadAgentFromDatabase(id);
      if (!agentInstance) {
        return res.status(500).json({ error: "Failed to load agent" });
      }
    }

    const workflowJob = await prisma.backgroundJob.create({
      data: {
        userId,
        type: 'EVALUATOR_OPTIMIZER_WORKFLOW',
        status: 'PROCESSING',
        payload: {
          agentId: id,
          workflowType: 'evaluator-optimizer',
          prompt,
          evaluationCriteria,
          maxIterations,
          options,
          startTime: new Date().toISOString(),
        },
      },
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    try {
      let currentOutput = '';
      let iterations = 0;
      const iterationResults = [];

      while (iterations < maxIterations) {
        iterations++;

        res.write(`data: ${JSON.stringify({
          type: 'iteration_start',
          iteration: iterations,
          maxIterations,
        })}\n\n`);

        // Generate or optimize
        const optimizePrompt = iterations === 1 ? 
          prompt : 
          `Improve this output based on the evaluation feedback:

Previous output: ${currentOutput}

Evaluation feedback: ${iterationResults[iterations - 2]?.evaluation || ''}

Original prompt: ${prompt}`;

        const optimizeResult = await (agentInstance as any).generate({
          prompt: optimizePrompt,
          options,
        });

        currentOutput = optimizeResult.text;

        // Evaluate the output
        const evaluationPrompt = `Evaluate this output against the following criteria:

Output: ${currentOutput}

Criteria:
${evaluationCriteria.map((c: string) => `- ${c}`).join('\n')}

Provide:
1. Overall quality score (1-10)
2. Pass/Fail for each criterion
3. Specific feedback for improvement
4. Overall assessment (PASS/NEEDS_IMPROVEMENT)`;

        const evaluationResult = await (agentInstance as any).generate({
          prompt: evaluationPrompt,
          options: {
            ...options,
            output: {
              type: 'object',
              schema: z.object({
                qualityScore: z.number().min(1).max(10),
                criteriaResults: z.array(z.object({
                  criterion: z.string(),
                  passed: z.boolean(),
                  feedback: z.string(),
                })),
                overallAssessment: z.enum(['PASS', 'NEEDS_IMPROVEMENT']),
                feedback: z.string(),
              }),
            },
          },
        });

        const iterationResult = {
          iteration: iterations,
          output: currentOutput,
          evaluation: evaluationResult.output,
          optimizeUsage: optimizeResult.usage,
          evaluationUsage: evaluationResult.usage,
        };

        iterationResults.push(iterationResult);

        res.write(`data: ${JSON.stringify({
          type: 'iteration_complete',
          iteration: iterations,
          output: currentOutput,
          evaluation: evaluationResult.output,
        })}\n\n`);

        // Check if quality meets threshold
        const evaluation = evaluationResult.output as any;
        if (evaluation?.overallAssessment === 'PASS' || 
            evaluation?.qualityScore >= 8) {
          break;
        }
      }

      await prisma.backgroundJob.update({
        where: { id: workflowJob.id },
        data: {
          status: 'COMPLETED',
          result: {
            finalOutput: currentOutput,
            iterations: iterationResults,
            totalIterations: iterations,
            finalEvaluation: iterationResults[iterationResults.length - 1]?.evaluation,
          },
        },
      });

      res.write(`data: ${JSON.stringify({
        type: 'workflow_complete',
        finalOutput: currentOutput,
        iterations: iterationResults,
        totalIterations: iterations,
        workflowId: workflowJob.id,
      })}\n\n`);
      res.end();

    } catch (workflowError) {
      await prisma.backgroundJob.update({
        where: { id: workflowJob.id },
        data: {
          status: 'FAILED',
          error: workflowError.message,
        },
      });

      if (!res.headersSent) {
        res.status(500).json({ error: "Evaluator-optimizer workflow failed" });
      }
    }

  } catch (error) {
    console.error("Error in evaluator-optimizer workflow:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to execute evaluator-optimizer workflow" });
    }
  }
});

// Execute orchestrator-worker workflow
workflowsRouter.post("/:id/orchestrator-worker", async (req, res) => {
  const { id } = req.params as any;
  const { task, workers, options = {} } = req.body;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    if (!Array.isArray(workers) || workers.length === 0) {
      return res.status(400).json({ error: "Workers must be a non-empty array" });
    }

    // Create specialized worker subagents
    const workerAgents = await Promise.all(
      workers.map(async (worker: any) => {
        const workerAgent = new ToolLoopAgent({
          model: resolveGoogleModel(agent.model),
          instructions: worker.instructions || `You are a specialized worker for: ${worker.type}`,
          tools: worker.tools || {},
        });

        return {
          ...worker,
          agent: workerAgent,
        };
      })
    );

    const workflowJob = await prisma.backgroundJob.create({
      data: {
        userId,
        type: 'ORCHESTRATOR_WORKER_WORKFLOW',
        status: 'PROCESSING',
        payload: {
          agentId: id,
          workflowType: 'orchestrator-worker',
          task,
          workers,
          options,
          startTime: new Date().toISOString(),
        },
      },
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    try {
      // Step 1: Orchestrator creates plan
      const orchestratorAgent = await AgentFactory.loadAgentFromDatabase(id);
      if (!orchestratorAgent) {
        throw new Error("Failed to load orchestrator agent");
      }

      res.write(`data: ${JSON.stringify({
        type: 'planning_start',
        task,
      })}\n\n`);

      const planningResult = await (orchestratorAgent as any).generate({
        prompt: `Create an execution plan for this task by delegating to specialized workers:

Task: ${task}

Available workers:
${workers.map((w: any, i: number) => `${i + 1}. ${w.name} (${w.type}): ${w.description || w.instructions}`).join('\n')}

Break down the task into specific subtasks for each worker. Provide a clear plan with assignments.`,
      });

      res.write(`data: ${JSON.stringify({
        type: 'planning_complete',
        plan: planningResult.text,
      })}\n\n`);

      // Step 2: Execute worker tasks
      const workerResults = await Promise.all(
        workerAgents.map(async (worker, index) => {
          res.write(`data: ${JSON.stringify({
            type: 'worker_start',
            worker: index + 1,
            workerName: worker.name,
            workerType: worker.type,
          })}\n\n`);

          try {
            const workerPrompt = `Execute your part of the plan:

Overall task: ${task}
Plan: ${planningResult.text}

Your role: ${worker.name} (${worker.type})
Your expertise: ${worker.description || worker.instructions}

Execute your specific responsibilities and provide your output.`;

            const workerResult = await (worker.agent as any).generate({
              prompt: workerPrompt,
            });

            res.write(`data: ${JSON.stringify({
              type: 'worker_complete',
              worker: index + 1,
              workerName: worker.name,
              output: workerResult.text,
              usage: workerResult.usage,
            })}\n\n`);

            return {
              worker: index + 1,
              name: worker.name,
              type: worker.type,
              success: true,
              output: workerResult.text,
              usage: workerResult.usage,
            };
          } catch (workerError) {
            res.write(`data: ${JSON.stringify({
              type: 'worker_error',
              worker: index + 1,
              workerName: worker.name,
              error: workerError.message,
            })}\n\n`);

            return {
              worker: index + 1,
              name: worker.name,
              type: worker.type,
              success: false,
              error: workerError.message,
            };
          }
        })
      );

      // Step 3: Orchestrator synthesizes results
      res.write(`data: ${JSON.stringify({
        type: 'synthesis_start',
      })}\n\n`);

      const synthesisResult = await (orchestratorAgent as any).generate({
        prompt: `Synthesize the results from all workers into a cohesive final response:

Original task: ${task}
Plan: ${planningResult.text}

Worker results:
${workerResults.map(r => `${r.name} (${r.type}): ${r.success ? r.output : `ERROR: ${r.error}`}`).join('\n\n')}

Provide a comprehensive response that addresses the original task by integrating all worker outputs.`,
      });

      await prisma.backgroundJob.update({
        where: { id: workflowJob.id },
        data: {
          status: 'COMPLETED',
          result: {
            plan: planningResult.text,
            workerResults,
            finalOutput: synthesisResult.text,
            totalWorkers: workers.length,
            successfulWorkers: workerResults.filter(r => r.success).length,
          },
        },
      });

      res.write(`data: ${JSON.stringify({
        type: 'workflow_complete',
        plan: planningResult.text,
        workerResults,
        finalOutput: synthesisResult.text,
        workflowId: workflowJob.id,
      })}\n\n`);
      res.end();

    } catch (workflowError) {
      await prisma.backgroundJob.update({
        where: { id: workflowJob.id },
        data: {
          status: 'FAILED',
          error: workflowError.message,
        },
      });

      if (!res.headersSent) {
        res.status(500).json({ error: "Orchestrator-worker workflow failed" });
      }
    }

  } catch (error) {
    console.error("Error in orchestrator-worker workflow:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to execute orchestrator-worker workflow" });
    }
  }
});

// Get workflow history
workflowsRouter.get("/:id/history", async (req, res) => {
  const { id } = req.params as any;
  const { limit = 20, workflowType } = req.query as any;
  const userId = (req as any).user.uid;

  try {
    const agent = await prisma.agent.findFirst({ where: { id, userId } });
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const whereClause: any = {
      userId,
      payload: { path: ["agentId"], equals: id },
      type: { contains: 'WORKFLOW' },
    };

    if (workflowType && workflowType !== 'all') {
      whereClause.type = `${workflowType.toUpperCase()}_WORKFLOW`;
    }

    const workflows = await prisma.backgroundJob.findMany({
      where: whereClause,
      take: parseInt(limit) || 20,
      orderBy: { createdAt: 'desc' },
    });

    const history = workflows.map(workflow => ({
      id: workflow.id,
      type: workflow.type,
      status: workflow.status,
      workflowType: (workflow.payload as any)?.workflowType || 'unknown',
      startTime: workflow.createdAt,
      endTime: workflow.updatedAt,
      duration: workflow.updatedAt ? 
        new Date(workflow.updatedAt).getTime() - new Date(workflow.createdAt).getTime() : 
        null,
      result: workflow.result,
      error: workflow.error,
    }));

    // Aggregate statistics
    const totalWorkflows = workflows.length;
    const completedWorkflows = workflows.filter(w => w.status === 'COMPLETED').length;
    const failedWorkflows = workflows.filter(w => w.status === 'FAILED').length;
    const runningWorkflows = workflows.filter(w => w.status === 'PROCESSING').length;

    res.json({
      agentId: id,
      history,
      stats: {
        total: totalWorkflows,
        completed: completedWorkflows,
        failed: failedWorkflows,
        running: runningWorkflows,
        successRate: totalWorkflows > 0 ? (completedWorkflows / totalWorkflows) * 100 : 0,
      },
      filters: {
        limit: parseInt(limit) || 20,
        workflowType: workflowType || 'all',
      }
    });

  } catch (error) {
    console.error("Error fetching workflow history:", error);
    res.status(500).json({ error: "Failed to fetch workflow history" });
  }
});

export default workflowsRouter;

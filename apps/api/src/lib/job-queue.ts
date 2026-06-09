import { prisma } from "@repo/database";

type JobHandler = (payload: any) => Promise<any>;

const handlers: Record<string, JobHandler> = {};

export function registerJobHandler(type: string, handler: JobHandler) {
  handlers[type] = handler;
}

export async function createJob(type: string, payload: any, userId: string) {
  const job = await prisma.backgroundJob.create({
    data: {
      type,
      payload,
      userId,
      status: "QUEUED",
    },
  });

  // Start processing in background
  processJob(job.id).catch(console.error);

  return job;
}

async function processJob(jobId: string) {
  const job = await prisma.backgroundJob.findUnique({ where: { id: jobId } });
  if (!job || !handlers[job.type]) return;

  await prisma.backgroundJob.update({
    where: { id: jobId },
    data: { status: "PROCESSING" },
  });

  try {
    const result = await handlers[job.type](job.payload);
    await prisma.backgroundJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        result,
        finishedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    await prisma.backgroundJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        error: String(error),
        finishedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}

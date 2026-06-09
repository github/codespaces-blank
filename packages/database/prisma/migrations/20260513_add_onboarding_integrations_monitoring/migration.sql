/*
  Warnings:

  - Added the required column `onboarding` to the `users` table without a default value. This is not possible if the table has an empty column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "onboarding" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "agent_integrations" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_monitoring" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" JSONB,
    "logs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_monitoring_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agent_integrations_agentId_idx" ON "agent_integrations"("agentId");

-- CreateIndex
CREATE INDEX "agent_integrations_userId_idx" ON "agent_integrations"("userId");

-- CreateIndex
CREATE INDEX "agent_integrations_type_idx" ON "agent_integrations"("type");

-- CreateIndex
CREATE INDEX "agent_monitoring_agentId_idx" ON "agent_monitoring"("agentId");

-- CreateIndex
CREATE INDEX "agent_monitoring_userId_idx" ON "agent_monitoring"("userId");

-- CreateIndex
CREATE INDEX "agent_monitoring_taskId_idx" ON "agent_monitoring"("taskId");

-- CreateIndex
CREATE INDEX "agent_monitoring_createdAt_idx" ON "agent_monitoring"("createdAt");

-- AddForeignKey
ALTER TABLE "agent_integrations" ADD CONSTRAINT "agent_integrations_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_integrations" ADD CONSTRAINT "agent_integrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_monitoring" ADD CONSTRAINT "agent_monitoring_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_monitoring" ADD CONSTRAINT "agent_monitoring_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

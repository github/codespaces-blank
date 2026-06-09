-- CreateTable
CREATE TABLE "agent_knowledge_sources" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "content" TEXT,
    "storageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "chunkCount" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_knowledge_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agent_knowledge_sources_agentId_idx" ON "agent_knowledge_sources"("agentId");

-- CreateIndex
CREATE INDEX "agent_knowledge_sources_userId_idx" ON "agent_knowledge_sources"("userId");

-- CreateIndex
CREATE INDEX "agent_knowledge_sources_status_idx" ON "agent_knowledge_sources"("status");

-- AddForeignKey
ALTER TABLE "agent_knowledge_sources" ADD CONSTRAINT "agent_knowledge_sources_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_knowledge_sources" ADD CONSTRAINT "agent_knowledge_sources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

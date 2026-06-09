# Research Page - Agentic Deep Research Implementation Plan

## Current State Analysis

The existing `/dashboard/research` page has basic search capabilities but lacks:
- Real-time streaming during deep research
- Research task queuing and progress tracking
- Rich result formatting (markdown, citations, structured data)
- Research history and saved artifacts
- Agentic workflow integration

## Architecture Overview

```
Frontend: Next.js 16 + React 19 + TailwindCSS
Backend: Express API with Parallel Web integration
Database: PostgreSQL (Prisma ORM) - using BackgroundJob model for async tasks
```

## Feature Implementation Plan

### Phase 1: Core Deep Research Components

#### 1.1 Research Agent Component
- **Component**: `ResearchAgent` - Real-time streaming research display
- **Features**:
  - Token-by-token streaming of research progress
  - Step visualization (search → extract → analyze → synthesize)
  - Live reasoning display with collapsible sections
  - Source attribution with inline citations

#### 1.2 Research Queue Component
- **Component**: `ResearchQueue` - Background job management
- **Features**:
  - Queue status indicators (QUEUED → PROCESSING → COMPLETED → FAILED)
  - Polling mechanism for job updates
  - Webhook support for real-time notifications
  - Cancel/retry actions

#### 1.3 Research Artifacts
- **Component**: `ResearchArtifact` - Persistent research storage
- **Features**:
  - Save research results to database
  - Export to PDF, Markdown, JSON
  - Version history tracking
  - Shareable artifact links

### Phase 2: Advanced Research Features

#### 2.1 Multi-Step Agentic Research
- **Enhancements to API**:
  - Iterative search with follow-up queries
  - Content extraction with schema validation
  - Cross-source synthesis
  - Fact-checking and validation loops

#### 2.2 Research Templates
- Predefined research workflows:
  - Competitive Analysis
  - Market Research
  - Technical Deep Dive
  - Product Sourcing
  - News Aggregation

#### 2.3 Research History & Library
- **Component**: `ResearchLibrary`
- **Features**:
  - Searchable research archive
  - Tag-based organization
  - Filter by date, type, status
  - Favorite/Bookmark system

### Phase 3: Integration Features

#### 3.1 BigQuery Integration
- Auto-enrich search results with database records
- Join web findings with internal data
- Export complete datasets

#### 3.2 Agent Integration
- Trigger research from AI agent workflows
- Use research results as agent context
- Scheduled automated research

## Database Schema Additions

### ResearchArtifact Model (Prisma)
```prisma
model ResearchArtifact {
  id           String   @id @default(cuid())
  userId       String
  objective    String
  type         ResearchType @default(SEARCH)
  status       JobStatus @default(COMPLETED)
  results      Json?
  sources      Json?
  queryChain   Json?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([createdAt])
  @@index([type])
  @@map("research_artifacts")
}

enum ResearchType {
  SEARCH
  EXTRACT
  DEEP_RESEARCH
}
```

## File Structure

```
apps/dashboard/src/app/dashboard/research/
├── page.tsx                          # Main research page
├── components/
│   ├── research-agent.tsx            # Streaming agent display
│   ├── research-queue.tsx            # Job queue manager
│   ├── research-artifact.tsx         # Artifact viewer
│   ├── research-history.tsx          # History browser
│   ├── research-sidebar.tsx          # Related info panel
│   └── research-input.tsx            # Enhanced input with suggestions
├── hooks/
│   ├── use-research-job.ts           # Job polling hook
│   ├── use-research-stream.ts        # Streaming hook
│   └── use-research-history.ts       # History hook
└── lib/
    ├── research-api.ts               # API client
    └── research-utils.ts             # Helpers
```

## API Endpoints

### New Endpoints
- `POST /api/research/deep-research` - Enhanced with async/job support
- `GET /api/research/jobs/:jobId` - Check job status
- `GET /api/research/history` - List user's research artifacts
- `GET /api/research/artifacts/:id` - Get specific artifact
- `DELETE /api/research/jobs/:jobId` - Cancel job

### Enhanced Parallel Integration
```typescript
// Current parallel.ts enhancement
export async function deepResearch(objective: string, options?: {
  iterations?: number;
  followUpQueries?: boolean;
  extractContent?: boolean;
  validateSources?: boolean;
})
```

## UI/UX Design

### Research Input Area
- PromptInput component with research-specific suggestions
- Mode selector (Search/Extract/Deep Research)
- Advanced options dropdown (iteration count, source filters)

### Progress Visualization
- Step-by-step progress cards
- Source counter with live updates
- Estimated time remaining
- Intermediate findings preview

### Results Display
- Markdown-rendered synthesis
- Collapsible source details
- Confidence scores per claim
- Copy/export actions

## Implementation Steps

### Step 1: Create ResearchArtifact model
- Add model to schema.prisma
- Generate migration
- Update seed data

### Step 2: Enhance API endpoints
- Update research.ts routes
- Add job status polling
- Implement artifact persistence

### Step 3: Build frontend components
- ResearchAgent with streaming
- ResearchQueue for background jobs
- ResearchHistory library

### Step 4: Integrate with existing UI
- Update page.tsx with new components
- Connect to PromptInput system
- Add navigation badges for active jobs

## Dependencies

- `parallel-web` (existing) - Web search API
- `@repo/database` (existing) - Database client
- `motion` (existing) - Animations
- `recharts` (existing) - Charts for research metrics
- New: PDF generation library for exports

## Success Criteria

1. Deep research runs asynchronously with real-time progress
2. Users can track multiple research jobs simultaneously
3. Research artifacts are persisted and searchable
4. Integration with existing agent/monitoring system
5. Export functionality for PDF, Markdown, JSON
# Tendrra AI - User-Scoped Agent System API Documentation

## Overview

This document outlines the complete API structure for the user-scoped agent management system, including onboarding data, user profiles, agent configuration, integrations, and monitoring/logs.

## Database Schema

### User Model (Updated)
```typescript
model User {
  id: string                    // UUID
  name: string                  // User's display name
  email: string                 // Unique email
  emailVerified: boolean        // Email verification status
  image?: string                // Avatar URL
  bio?: string                  // Bio/description
  role: Role                    // USER | ADMIN | SUPER_ADMIN
  onboarding: JSON              // Onboarding data (NEW)
  
  // Relations
  agents: Agent[]               // User's agents
  integrations: AgentIntegration[]  // User's integrations (NEW)
  monitoringLogs: AgentMonitoring[] // User's monitoring logs (NEW)
  
  timestamps: createdAt, updatedAt
}
```

### Agent Model (Updated)
```typescript
model Agent {
  id: string
  name: string
  description?: string
  type: string                 // "General", "Research", etc.
  role: string                 // "Assistant", "Analyst", etc.
  status: AgentStatus          // IDLE | RUNNING | PAUSED | ERROR
  config: JSON                 // Agent configuration
  instructions?: string        // System instructions
  model?: string               // Model name (gpt-4, claude-3, etc.)
  userId: string               // Owner user ID
  
  // Relations
  integrations: AgentIntegration[]     // Agent integrations (NEW)
  monitoringLogs: AgentMonitoring[]    // Execution logs (NEW)
  
  timestamps: createdAt, updatedAt
  indexes: status, userId
}
```

### AgentIntegration Model (NEW)
```typescript
model AgentIntegration {
  id: string
  agentId: string              // Reference to agent
  userId: string               // Owner user ID
  name: string                 // Integration name
  type: string                 // "slack", "github", "api", etc.
  config: JSON                 // Integration-specific config
  status: string               // "active" | "inactive" | "error"
  
  timestamps: createdAt, updatedAt
  indexes: agentId, userId, type
}
```

### AgentMonitoring Model (NEW)
```typescript
model AgentMonitoring {
  id: string
  agentId: string              // Reference to agent
  userId: string               // Owner user ID
  taskId?: string              // Reference to job/task
  action: string               // "EXECUTE", "CONFIG_UPDATE", etc.
  status: string               // "COMPLETED", "FAILED", "RUNNING", etc.
  metadata: JSON               // Additional context
  logs?: string                // Full execution logs
  
  timestamps: createdAt, updatedAt
  indexes: agentId, userId, taskId, createdAt
}
```

## API Routes

### User Management

#### Create User with Onboarding
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "AI enthusiast",
  "image": "https://...",
  "onboarding": {
    "completed": true,
    "step": "agents_setup",
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  }
}

Response:
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "onboarding": {...}
}
```

#### Get User Profile
```
GET /api/users/:userId
Authorization: Bearer {token}

Response:
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "AI enthusiast",
  "onboarding": {...},
  "_count": {
    "tasks": 10,
    "messages": 45,
    "agents": 3
  },
  "agents": [
    { "id": "agent_1", "name": "ResearchBot", "status": "RUNNING" },
    ...
  ]
}
```

#### Update User Profile & Onboarding
```
PATCH /api/users/:userId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "bio": "Updated bio",
  "onboarding": {
    "completed": true,
    "step": "complete",
    "completedAt": "2024-12-13T10:30:00Z"
  }
}

Response:
{
  "id": "user_123",
  "name": "John Doe Updated",
  ...
}
```

#### Get User's Agents
```
GET /api/users/:userId/agents
Authorization: Bearer {token}

Response:
[
  {
    "id": "agent_1",
    "name": "ResearchBot",
    "status": "RUNNING",
    "model": "gpt-4",
    "integrations": [
      {
        "id": "int_1",
        "name": "Slack Integration",
        "type": "slack",
        "status": "active"
      }
    ],
    "monitoringLogs": [
      {
        "id": "log_1",
        "action": "EXECUTE",
        "status": "COMPLETED",
        "createdAt": "2024-12-13T10:00:00Z"
      }
    ]
  }
]
```

### Agent Management (User-Scoped)

#### List User's Agents
```
GET /api/agents?userId={userId}
Authorization: Bearer {token}

Response: Array of agents filtered by userId
```

#### Create Agent
```
POST /api/agents
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "ResearchBot",
  "description": "AI research assistant",
  "type": "Research",
  "role": "Assistant",
  "model": "gpt-4",
  "instructions": "You are a research expert..."
}

Response:
{
  "id": "agent_1",
  "name": "ResearchBot",
  "userId": "{authenticated_user_id}",
  "status": "IDLE",
  "config": {},
  "integrations": [],
  ...
}
```

#### Get Single Agent (with Authorization)
```
GET /api/agents/:agentId
Authorization: Bearer {token}

Response:
{
  "id": "agent_1",
  "name": "ResearchBot",
  "status": "RUNNING",
  "config": {...},
  "integrations": [...]
  "monitoringLogs": [...]
}
```

#### Update Agent
```
PUT /api/agents/:agentId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "ResearchBot v2",
  "description": "Updated description",
  "config": {
    "temperature": 0.7,
    "maxTokens": 2000
  }
}

Response: Updated agent object
```

#### Delete Agent
```
DELETE /api/agents/:agentId
Authorization: Bearer {token}

Response: 204 No Content
```

### Agent Integrations

#### List Integrations
```
GET /api/agents/:agentId/integrations
Authorization: Bearer {token}

Response:
[
  {
    "id": "int_1",
    "agentId": "agent_1",
    "name": "Slack Bot",
    "type": "slack",
    "config": {
      "token": "xoxb-...",
      "channels": ["#ai-research"]
    },
    "status": "active",
    "createdAt": "2024-12-13T10:00:00Z"
  }
]
```

#### Create Integration
```
POST /api/agents/:agentId/integrations
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "GitHub Integration",
  "type": "github",
  "config": {
    "token": "ghp_...",
    "owner": "myorg",
    "repo": "my-repo"
  }
}

Response:
{
  "id": "int_2",
  "agentId": "agent_1",
  "name": "GitHub Integration",
  "type": "github",
  "config": {...},
  "status": "active"
}
```

#### Update Integration
```
PUT /api/agents/:agentId/integrations/:integrationId
Authorization: Bearer {token}
Content-Type: application/json

{
  "config": {
    "token": "new_token",
    "channels": ["#general", "#ai"]
  },
  "status": "inactive"
}

Response: Updated integration object
```

#### Delete Integration
```
DELETE /api/agents/:agentId/integrations/:integrationId
Authorization: Bearer {token}

Response: 204 No Content
```

### Agent Monitoring & Logs

#### Get Monitoring Logs
```
GET /api/agents/:agentId/monitoring?limit=50&offset=0&status=COMPLETED&taskId=task_1
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": "log_1",
      "agentId": "agent_1",
      "userId": "user_123",
      "taskId": "job_1",
      "action": "EXECUTE",
      "status": "COMPLETED",
      "metadata": {
        "stepCount": 5,
        "usage": { "promptTokens": 150, "completionTokens": 300 },
        "finishReason": "stop"
      },
      "logs": "Full execution output...",
      "createdAt": "2024-12-13T10:00:00Z"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

#### Create Monitoring Log (Auto-Called During Execution)
```
POST /api/agents/:agentId/monitoring
Authorization: Bearer {token}
Content-Type: application/json

{
  "taskId": "job_1",
  "action": "EXECUTE",
  "status": "COMPLETED",
  "metadata": {
    "stepCount": 5,
    "usage": {...},
    "finishReason": "stop"
  },
  "logs": "Execution output..."
}

Response: Created monitoring log object
```

#### Get Specific Log
```
GET /api/agents/:agentId/monitoring/:logId
Authorization: Bearer {token}

Response: Single monitoring log object with full details
```

#### Get Monitoring Statistics
```
GET /api/agents/:agentId/monitoring/summary/stats
Authorization: Bearer {token}

Response:
{
  "stats": [
    { "status": "COMPLETED", "_count": 145 },
    { "status": "FAILED", "_count": 5 }
  ],
  "totalLogs": 150,
  "recentLogs": [...]
}
```

### Agent Execution (with Auto-Logging)

#### Execute Agent Task
```
POST /api/agents/:agentId/execute
Authorization: Bearer {token}
Content-Type: application/json

{
  "prompt": "Research the latest AI trends",
  "options": {
    "temperature": 0.7,
    "maxTokens": 2000
  },
  "stream": true
}

Response: Streaming SSE events
- Chunks: {"type": "chunk", "content": "...", "stepCount": 1}
- Completion: {"type": "done", "jobId": "...", "usage": {...}}

AUTO: Creates AgentMonitoring entry with status COMPLETED/FAILED
```

#### Execute Agent Task (Non-Streaming)
```
POST /api/agents/:agentId/execute
Authorization: Bearer {token}
Content-Type: application/json

{
  "prompt": "Analyze this code",
  "stream": false
}

Response:
{
  "success": true,
  "response": "Analysis output...",
  "usage": {...},
  "jobId": "job_123"
}
```

## Authorization & Security

- All endpoints require Bearer token authentication (Firebase ID token)
- User can only access/modify their own agents, integrations, and logs
- UserId extracted from request context (req.user.uid)
- Ownership verification on all protected operations

## Error Responses

```json
{
  "error": "Agent not found"  // 404
}

{
  "error": "Forbidden"  // 403 - User doesn't own resource
}

{
  "error": "Unauthorized"  // 401 - No valid token
}
```

## Integration Types

Supported integration types:
- `slack` - Slack bot integration
- `github` - GitHub repositories
- `api` - Custom REST APIs
- `webhook` - Webhook receivers
- `email` - Email notifications
- `database` - Database connections

## Monitoring Actions

Logged actions:
- `EXECUTE` - Agent task execution
- `CONFIG_UPDATE` - Configuration change
- `INTEGRATION_ADDED` - New integration
- `INTEGRATION_REMOVED` - Integration deleted
- `STATUS_CHANGED` - Agent status change

## Examples

### Complete Workflow

1. **Create User with Onboarding**
```bash
POST /api/users
{"name": "John", "email": "john@example.com", "onboarding": {...}}
```

2. **Create Agent**
```bash
POST /api/agents
{"name": "ResearchBot", "model": "gpt-4"}
```

3. **Add Integration**
```bash
POST /api/agents/:agentId/integrations
{"name": "Slack", "type": "slack", "config": {...}}
```

4. **Execute Task**
```bash
POST /api/agents/:agentId/execute
{"prompt": "Research topic"}
```

5. **Check Logs**
```bash
GET /api/agents/:agentId/monitoring?limit=10
```

## Development Notes

- Database migrations are in `packges/database/prisma/migrations/`
- API endpoints are in `apps/api/src/routes/`
- Dashboard integration via React contexts in `apps/dashboard/src/contexts/`
- All database operations use Prisma ORM
- Authentication handled by Firebase

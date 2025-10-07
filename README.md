# Multi-Agent Workspace Overview

- **Research Agent** maps repo architecture, verifies APIs with official sources, and keeps discovery questions organized. It feeds confirmed facts into the integration vault so downstream agents start with vetted context.
- **Coding Agent** takes ready-to-build tickets, edits code, runs tests, and returns implementation results. It follows Integration cues to ensure every change is documented and validated.
- **Integration Orchestrator** plans phases, routes handoffs, and pre-fills prompts for the next agent. It maintains the vault, aggregates outcomes, and signals when to switch agents.

```
.github/
 ├─ instructions/
 │   ├─ research-agent.instructions.md
 │   ├─ coding-agent.instructions.md
 │   └─ integration-orchestrator.instructions.md
 ├─ prompts/
 │   ├─ Research-Agent/
 │   ├─ Coding-Agent/
 │   └─ Integration-Agent/
 └─ chatmodes/
     ├─ Research-Agent.chatmode.md
     ├─ Coding-Agent.chatmode.md
     └─ Integration-Orchestrator.chatmode.md
```

## Research Agent
| When to Use | Tools | Capabilities | Access | Specialist |
|-------------|-------|--------------|--------|------------|
| Discovery, doc gathering, API verification | `serena`, `filesystem`, `Context7`, `memory`, `crawl4ai-rag-mcp` | Map architecture, fetch official docs, update vault TODOs | Read-only (vault updates go through Integration) | Research & documentation

## Coding Agent
| When to Use | Tools | Capabilities | Access | Specialist |
|-------------|-------|--------------|--------|------------|
| Implement scoped changes & run tests | `serena`, `filesystem`, `terminal`, `archon`, GitHub tools | Modify code, run lint/tests, report results to vault | Read/Write (code + vault via Integration cues) | Implementation & testing

## Integration Orchestrator
| When to Use | Tools | Capabilities | Access | Specialist |
|-------------|-------|--------------|--------|------------|
| Coordinate research ↔ coding handoffs, maintain vault source of truth | `serena`, `filesystem`, `memory`, `archon`, `sequential-thinking`, `terminal`, `Context7`, `GitHub`, `crawl4ai-rag-mcp`, `builtin` | Plan phases, populate prompt templates, issue agent cues, aggregate outputs | Read/Write (vault/archon logs, delegation packets) | Cross-repo orchestration

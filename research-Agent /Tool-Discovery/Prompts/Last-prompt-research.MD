---
mode: Tool-Discovery
phase: early-research
---

## Discovery Phase: Find Tool Candidates

### Your Task
Help me discover tools/libraries/frameworks that match my project needs.

### What I Need
**Tool Category:** [e.g., state management, testing framework, API client, database ORM]

**My Project Context:**
- Language: [e.g., TypeScript, Python, Go]
- Framework: [e.g., React, Next.js, FastAPI, Express]
- Current Stack: [list key dependencies]

**Requirements:**
- Must have: [critical features]
- Nice to have: [optional features]
- Performance needs: [bundle size, speed, memory]
- Team constraints: [learning curve, documentation quality]

### What You Should Do

**Phase 1: Analyze My Project**
- Use `serena` to check my current architecture
- Use `filesystem` to inventory existing tools
- Review `archon` for past tool decisions
- Store baseline in `memory`

**Phase 2: Find Candidates**
- Use `search_repositories` to find 5-8 options
- Use `Context7` for official docs overview
- Use `crawl4ai-rag-mcp` for community insights
- Filter by: stars >1000, updated <6 months, license compatibility

### Expected Output

**Deliver this information for the next prompt:**

1. **Baseline Snapshot** (store in memory)
   - Current project structure
   - Existing similar tools
   - Dependencies that might conflict

2. **Candidate List** (5-8 tools)
   | Tool Name | Stars | Last Update | License | Brief Description |
   |-----------|-------|-------------|---------|-------------------|
   | ...       | ...   | ...         | ...     | ...               |

3. **Initial Assessment** (150 words max)
   - Quick pros/cons for each
   - Red flags if any
   - Which 3-4 look most promising?

4. **Questions for Me**
   - Anything unclear about requirements?
   - Trade-offs I should consider?

**Handoff:** Pass the top 3-4 candidates to Mid-Research for deep evaluation.
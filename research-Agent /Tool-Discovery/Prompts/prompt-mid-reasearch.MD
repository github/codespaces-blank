---
mode: Tool-Discovery
phase: mid-research
---

## Evaluation Phase: Deep Analysis of Finalists

### Your Task
Take the candidates from Early Research and do deep technical evaluation.

### What I'm Bringing From Early Research
**Candidates to Evaluate:** [list 3-4 tools from previous prompt]

**My Project Baseline:** [reference from memory - architecture, dependencies, constraints]

**Specific Concerns:** [any red flags or questions from Early Research]

### What You Should Do

**Phase 3: Technical Evaluation**

For each candidate:

1. **Compatibility Check** (use `serena`)
   - Will it work with my current stack?
   - Any dependency conflicts?
   - Breaking changes from current setup?

2. **Code Analysis** (use `search_code` + `get_file_contents`)
   - Find setup examples (targeted snippets only)
   - Extract configuration patterns
   - Check API usage samples
   - Review error handling approaches
   - **Do NOT read entire files** - get specific sections

3. **Integration Complexity** (use `Context7` + `crawl4ai-rag-mcp`)
   - How hard to integrate? (Easy/Medium/Hard)
   - Migration path from current tools
   - Learning curve for team

4. **Document Findings** (use `archon`)
   - Store code snippets
   - Save configuration examples
   - Note integration patterns

### Expected Output

**Deliver this for Late Research (Decision Phase):**

1. **Comparison Table**
   | Tool | Compatibility | Integration | Performance | Security | Score (0-5) |
   |------|---------------|-------------|-------------|----------|-------------|
   | ...  | ✅/⚠️/❌      | Easy/Med/Hard | Impact     | Status   | X.X         |

2. **Technical Deep-Dive** (150-200 words per tool)
   - API compatibility with my code
   - Code snippet showing integration
   - Breaking changes/migration risks
   - Bundle size/performance impact

3. **Narrowed Finalists** (Top 2-3)
   - Why these made the cut
   - Key differentiators
   - Remaining concerns

4. **Stored in Archon**
   - Code examples for each
   - Configuration templates
   - Integration snippets

**Handoff:** Pass top 2-3 finalists + evaluation data to Late Research for final decision.

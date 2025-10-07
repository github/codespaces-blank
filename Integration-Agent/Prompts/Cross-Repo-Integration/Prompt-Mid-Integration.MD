---
mode: Cross-Repo-Integration
phase: mid-integration
---

## Mid Integration: Design & Execution

1. **Review Discovery Assets**
   - Vault references: [repo folders/files]
   - Neo4j nodes/relationships: [queries run]
   - Outstanding TODOs from Early phase.

2. **Integration Blueprint** (`sequential-thinking`, `archon`, `crawl4ai-rag-mcp`)
   - Define data flow, sync strategy, error handling, and fallback paths.
   - Use `query_knowledge_graph` and `check_ai_script_hallucinations` to validate proposed interfaces.
   - Update vault per repo with planned changes (files, functions, exact line ranges, new dependencies).
   - If assumptions remain unverified, draft/issue a "Switch to Research Agent" cue with the unresolved items and supporting evidence paths.

3. **Execution Plan** (`serena`, Coding Agent, `terminal`)
   - Delegate coding tasks (list commands/tests to run).
   - When tasks are ready for implementation, create a "Switch to Coding Agent" directive that includes the task list, file paths, line ranges, and test commands.
   - Capture commands, results, and code snippets in vault + Archon; note any required doc lookups via crawl4ai.

4. **Handoff** (`memory`, vault reference)
   - Run the integrated prompt-fill assistant to generate the Coding/Research Mid-phase template with implementation packets, evidence links, and test commands; wait for operator confirmation before issuing the cue.
   - Summary: "Ready for Late Integration with [planned changes/tests] — see [vault paths], graph queries [list], coding tasks [link]."
   - Next agent cue: `Switch to Coding Agent to implement [tasks]`, `Switch to Research Agent to close [gaps]`, or `Continue as Integration Agent` if everything stays internal.

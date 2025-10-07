---
mode: Cross-Repo-Integration
phase: late-integration
---

## Late Integration: Validation & Handoff

1. **Test Execution** (`terminal`, Coding Agent)
   - Commands to run (unit/integration/e2e): [list + env]
   - Capture outputs, logs, telemetry references; store in vault `validation/`.

2. **Verification** (`serena`, `crawl4ai-rag-mcp`, Neo4j)
   - Re-run `query_knowledge_graph` to ensure architecture matches updated repos.
   - Confirm imported docs/API specs still valid; cite any changes.
   - Check for hallucinations or missing links using `check_ai_script_hallucinations` if Python agents involved.
   - If discrepancies emerge, prepare a "Switch to Research Agent" directive summarizing the mismatch, evidence, and required follow-up.

3. **Documentation & PRs** (`filesystem`, `archon`, GitHub tools)
   - Update vault index + per-repo notes (≤100 lines) with final state.
   - Note PR links, branch names, deployment steps, and rollback plan.
   - If final fixups are needed, craft a "Switch to Coding Agent" cue with the exact files/tests still outstanding.

4. **Final Handoff** (`memory`, vault reference)
   - Run the integrated prompt-fill assistant to assemble the Late-phase template for whichever agent needs follow-up (Research validation, Coding cleanup, or closure) and capture proof paths before presenting it to the operator.
   - Summary: "Integration complete — see [vault files], graph snapshot [reference], PRs [links], remaining risks/TODOs."
   - Next agent cue: `Switch to Research Agent for post-integration validation`, `Switch to Coding Agent for cleanup`, or `Close integration` if done.

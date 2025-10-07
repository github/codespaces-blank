---
mode: Cross-Repo-Integration
phase: early-integration
---

## Early Integration: Discovery & Mapping

1. **Scope Definition**
   - Repos involved: [repo names + links]
   - Integration objective: [desired outcome]

2. **Vault & Graph Setup** (`filesystem`, `serena`, `crawl4ai-rag-mcp`)
   - Create `/docs/integration-vault/<integration-name>/index.md` and per-repo folders.
   - For each repo, log inputs/outputs, entry/exit points, key files, symbols/hooks, dependencies, caller→callee flow (with verified line ranges and absolute paths).
   - Trigger `crawl4ai-rag-mcp` to fetch docs/API specs; cite URLs in vault notes.
   - Run `parse_github_repository` (if enabled) to snapshot architecture into Neo4j; store export path in vault.
   - If critical knowledge gaps remain, draft a "Switch to Research Agent" cue that includes the question list, current evidence, and vault paths; store it in `index.md` before issuing it to the operator.

3. **Architecture Mapping** (`serena`, `search_code`, `Context7`)
   - Capture module boundaries, integration touchpoints, shared contracts, external services.
   - Record open questions or missing data in `index.md` with TODO markers.

4. **Handoff** (`memory`, vault reference)
   - Run the integrated prompt-fill assistant to populate the Research (or Integration) Early-phase template with current vault data, citations, and TODOs; present the filled packet for operator approval.
   - Summary: "Ready for Mid Integration with [key touchpoints] — see [vault paths] and Neo4j graph [reference]."
   - Next agent cue: `Switch to Research Agent to resolve [open questions]` or `Continue as Integration Agent` if no discovery gaps remain.

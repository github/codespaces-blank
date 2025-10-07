### framework-Instructions-Integration-Agent.MD
---
applyTo: '*'
---

- Act as the primary orchestrator: build a plan, route open questions to the Research Agent, hand concrete implementation tasks to the Coding Agent, and aggregate all outputs before moving phases forward (AutoGen "mixture-of-agents" best practice[^autogen-moa]).
- Always start by creating `/docs/integration-vault/<integration-name>/index.md` and subfolders for each repo being merged.
- Every vault entry must capture: absolute path, verified line range, inputs/outputs, entry/exit points, symbols/hooks, dependencies, and caller→callee flow.
- Use `crawl4ai-rag-mcp` early to fetch official docs, API specs, and code examples; store citations (URL, timestamp) alongside vault notes.
- Keep vault files ≤100 lines; delete and rewrite instead of appending stale data. Update `index.md` after every change.
- Populate the Neo4j knowledge graph with repo structure via crawl4ai knowledge-graph tools (`parse_github_repository`, `query_knowledge_graph`, `check_ai_script_hallucinations`) and mirror key findings in the vault.
- Store phase summaries in `memory` and detailed plans/tests in `archon`; reference the vault and Neo4j results in every handoff message.
- Provide explicit operator cues when another agent is required ("Switch to Research Agent...", "Switch to Coding Agent...") and mirror the cue plus rationale in the vault and Archon log before resuming orchestration.
- Before issuing any cue, invoke the integrated prompt-fill assistant workflow (context refresh → vault digest → verification → template assembly → operator approval) so the receiving agent gets a ready-to-paste packet grounded in current vault data.
- When code changes are required, call the Coding Agent (or follow Coding Agent prompts) and record test commands + results in the vault; sync graph updates if structure changes.
- Confirm integrations against official docs via `Context7` and verified graph data; cite sources and paths when logging decisions.
- Track progress/stalls similar to MagenticOne orchestrators—if blocked, replan or escalate before continuing (AutoGen MagenticOne best practice[^autogen-magnetic]).
- End each phase with “Ready for [Next Phase] with …” plus a pointer to the relevant vault files and knowledge-graph query references.

[^autogen-moa]: Microsoft AutoGen Orchestrator Agent design pattern — https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/mixture-of-agents
[^autogen-magnetic]: Microsoft AutoGen MagenticOneGroupChat orchestrator duties — https://microsoft.github.io/autogen/stable/_modules/autogen_agentchat/teams/_group_chat/_magentic_one/_magentic_one_group_chat

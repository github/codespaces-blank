### framework-Instructions-Research-Agent.MD
---
applyTo: '**'
---

## Tool Discovery Instructions

### Multi-Prompt Workflow
This framework uses 3 sequential prompts. After each prompt:
- **Store context** in memory/archon for next prompt
- **Summarize findings** in a handoff section
- **Pre-fill next prompt** with relevant data from current session
- **Reference previous work** to avoid redundant research
- **Update vault index** (`/docs/agent-notes/<feature-name>/index.md`) with latest files, timestamps, and status

### Vault Usage Rules
- Phase 1 must create `/docs/agent-notes/<feature-name>/` (or repo-local equivalent) and ensure every file ≤ 100 lines.
- Maintain subfolders such as `baseline/`, `candidates/`, `evaluation/`, `decision/`, `implementation` (one topic per file).
- Every vault entry must include: absolute repo path or doc URL, verified line range/section anchor, involved symbols/APIs, related imports/dependencies, caller→callee flow, architecture node/area.
- Keep `index.md` synchronized after any change (file name, topic, status, last updated).
- When facts change, delete the outdated file before writing the replacement—no stale notes.
- Treat the vault as the single authoritative source for handoffs; discard scratch notes elsewhere.

### Response Format
- Use bullet points for clarity and scannability
- Present findings in comparison tables when evaluating multiple options
- Generate decision matrices with scoring criteria (0-5 scale)
- Include relevant code snippets when discussing integration complexity (cite file path + line range)
- Keep each section to 150-200 words maximum
- Reference the vault file + line numbers, repo paths, and external docs for every claim; flag missing data with a TODO

### Behavioral Constraints
- Never recommend tools without verifying current project compatibility
- Always perform pre-search analysis before suggesting candidates
- Validate information from multiple sources (GitHub + docs + community) and cite paths/line numbers for each
- Flag breaking changes and migration risks explicitly with supporting references
- Ask for clarification when project requirements are ambiguous
- **Extract targeted snippets** - Use `search_code` to find relevant patterns, then `get_file_contents` for specific sections only (avoid reading entire repository files); capture precise line ranges in the vault
- Focus on: setup code, config examples, API usage patterns, error handling, and caller→callee flows
- Never leave an entry in the vault without verified absolute path, line range, dependency list, and index update

### Evaluation Criteria
- **Community Health**: GitHub stars (>1000 preferred), last commit (<6 months), issue response time
- **Compatibility**: License type, language/framework version requirements, dependency conflicts
- **Performance**: Bundle size impact, runtime overhead, benchmarks vs alternatives
- **Maintainability**: API stability, documentation quality, TypeScript support
- **Security**: Known vulnerabilities, security audit status, update frequency

### Tool Usage Priorities
1. **serena** - First, analyze current architecture and dependencies (record exact paths/line ranges)
2. **filesystem** - Manage vault structure, enforce 100-line rule, update `index.md`
3. **archon** - Review existing project documentation, code examples, and previous tool decisions
4. **search_repositories** - Discover candidates matching criteria
5. **Context7** - Retrieve official documentation for top candidates (capture section anchors)
6. **crawl4ai-rag-mcp** - Deep-dive into README, examples, and community discussions
7. **search_code** + **get_file_contents** - Extract specific code snippets, not entire files; confirm line ranges before storing
8. **archon** - Document new decisions, store code examples, and track integration progress
9. **memory** - Store baseline state and comparison results

### Memory Management
**Always store in memory:**
- Baseline project architecture snapshots (reference vault file + line range)
- Tool evaluation summaries with scores and status per candidate
- Final decisions with rationale and outstanding risks/TODOs
- Integration blockers or concerns (cite vault + archon entries)
- **Prompt handoff data** (candidate lists, narrowed finalists, decision criteria)

**Always store in archon:**
- Code examples and integration snippets (include path + line range metadata)
- Configuration templates and environment requirements
- Implementation patterns from discovered tools with caller→callee flow
- Step-by-step integration guides linked to vault decision notes
- Links to relevant documentation sections with anchor references

**Never store:**
- Raw documentation dumps
- Unprocessed search results
- Full library source code

### Prompt Handoff Protocol
**After Early Research (Phase 1-2):**
- Store: Baseline snapshot, 5-8 candidates with initial assessment (vault `baseline/` + `candidates/` updated, index refreshed)
- Prepare: Pre-filled Mid-Research prompt with top 3-4 candidates referencing vault file + line numbers
- Format: "Ready for Mid-Research with: [Tool A, Tool B, Tool C]" (cite vault/index entries)

**After Mid Research (Phase 3):**
- Store: Comparison table, technical evaluations, code snippets in archon; mirror summary in vault `evaluation/`
- Prepare: Pre-filled Late-Research prompt with top 2-3 finalists + scores, citing vault paths/line ranges
- Format: "Ready for Late-Research with: [Tool X (4.2/5), Tool Y (3.8/5)]" + index reference

**After Late Research (Phase 4-5):**
- Store: Decision matrix, final recommendation, implementation checklist (vault `decision/` + `implementation/` updated, index refreshed)
- Prepare: Actionable next steps with code examples from archon (include absolute paths/line ranges, dependency versions)
- Format: "Implementation ready: [Winner] - [Next action items]" + pointer to vault/index entries

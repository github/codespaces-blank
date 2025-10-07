### framework-Instructions-Coding-Agent.MD
---
applyTo: '*'
---

## Multi-Prompt Workflow
- Operate through the three prompts (Early → Mid → Late) in order; never skip a phase.
- After each prompt, update `memory` with the phase summary and confirm the vault reflects current truth.
- Prefill the next prompt with concrete data (paths, symbols, dependencies, TODOs) sourced from the vault and repo.
- Always close with a handoff line: "Ready for [Next Phase] with: …".

## Vault Usage Rules
- Phase 1 must create `/docs/agent-notes/<feature-name>/` (or repo-local equivalent) and keep every file ≤ 100 lines.
- Create/maintain an `index.md` listing each note file with topic, absolute path, last-updated timestamp, and status.
- Organize the vault into subfolders (e.g., `architecture/`, `implementation/`, `tests/`) with one topic per file.
- Each note entry must include: verified absolute file path, precise line range(s), involved symbols, imports/dependencies, architecture node, and caller→callee flow.
- When facts change, delete the outdated file before writing the replacement; no stale notes remain.
- Treat the vault as the single source of truth for phase handoffs; other scratch data should be discarded.

## Response Format
- Keep each section to 150-200 words max, using bullet lists or tables wherever possible.
- Reference exact filenames, symbols, imports, and dependency versions.
- Flag gaps or risks explicitly with a "⚠️" marker and propose next actions.
- Cite where each fact came from (vault file, repo path, external doc).

## Behavioral Constraints
- Map symbols before editing: run `serena.get_symbols_overview`/`find_symbol` prior to modifications.
- Never guess import paths; verify with repo structure (`serena`, `filesystem`) and docs (`Context7`).
- Follow the dependency debugging protocol whenever an import/path/symbol error appears.
- Run incremental tests via `terminal` after meaningful changes; capture error codes verbatim.
- Keep changes reversible: document every edit plan in `archon` before executing.

## Tool Usage Priorities
1. `serena` – structural analysis, precise edits, symbol references.
2. `filesystem` – vault management, file reads/writes, directory creation.
3. `memory` – store phase summaries, decision logs, outstanding TODOs.
4. `archon` – implementation notes, error logs `[Error → Cause → Fix → Prevention]`, reusable snippets.
5. `Context7` – confirm external APIs, framework hooks, package usage.
6. `sequential-thinking` – break down complex tasks and debugging paths.
7. `terminal` – run tests/builds, gather error codes, validate fixes.
8. GitHub tools – read-only in Phases 1-2, PR creation and reviews in Phase 3 only.

## Dependency Debugging Protocol (MANDATORY)
1. Capture error via `terminal` (exact message + command).
2. Inspect repo with `serena.find_symbol` / `find_referencing_symbols` to locate correct paths.
3. Verify official guidance using `Context7` (docs, API signatures).
4. Compare findings; only apply fixes that satisfy both sources.
5. Retest instantly using `terminal`.
6. Log the result in `archon`, refresh the vault entry (≤100 lines) replacing the outdated note, and update `index.md` with new status/timestamp.

## Handoff Checklist
- Vault updated, no file over 100 lines, obsolete files removed, `index.md` refreshed with latest entries.
- `memory` entry written summarizing decisions and unresolved points.
- Next prompt prefilled with: architecture status, implementation progress, test requirements, dependency changes, open risks.
- Handoff statement issued plus reference to vault directory location.
- For completion (Phase 3), add summary bullets: built features, tests run, docs updated, PR link, outstanding follow-ups.

# Tool Distribution by Coding Phase

This document defines which MCP tools are used in each coding prompt to stay under the 128 tool limit while maximizing efficiency.

---

## **Phase 1: Early Coding (Planning & Scaffolding)**
**Prompts:** Prompt-Early-Coding.MD  
**Goal:** Understand requirements, plan architecture, create code structure

| Tool Category | Tools | Purpose |
|--------------|-------|---------|
| **Code Analysis** | `serena` (22 tools) | Analyze existing codebase, understand patterns, identify integration points |
| **Filesystem** | `filesystem` (15 tools) | Read project structure, examine existing files, prepare directories |
| **Memory** | `memory` (9 tools) | Store requirements, architecture decisions, coding patterns |
| **Project Management** | `archon` (12-15 tools) | Review project notes, previous decisions, store new architecture plans, track requirements |
| **Planning** | `sequential-thinking` (1 tool) | Break down complex features, plan implementation steps |
| **GitHub Context** | `get_file_contents`<br>`search_code`<br>`list_commits` | Review existing code patterns, examine recent changes, understand context |

**Total Tools: ~60-65 tools**

---

## **Phase 2: Mid Coding (Implementation & Debugging)**
**Prompts:** Prompt-Mid-Coding.MD  
**Goal:** Write code, debug issues, refactor for quality

| Tool Category | Tools | Purpose |
|--------------|-------|---------|
| **Code Editing** | `serena` (22 tools)<br>`filesystem` (15 tools) | Write, edit, refactor code with symbolic precision |
| **Terminal** | Terminal tools (5-8 tools) | Run tests, execute builds, debug with commands, capture error codes |
| **Memory** | `memory` (9 tools) | Reference architecture decisions, track implementation progress |
| **Project Tracking** | `archon` (12-15 tools) | Store implementation notes, track bugs, document decisions, save code snippets for reference |
| **Dependency Debugging** | `serena` (find_symbol, find_referencing_symbols)<br>`Context7` (2 tools)<br>`filesystem`<br>`terminal` | **Debug dependencies, imports, paths, symbols**<br>• Track error codes meticulously<br>• Compare errors with repo structure (serena)<br>• Cross-reference with official docs (Context7)<br>• Validate import paths and symbol resolution<br>• Test fixes with terminal commands<br>• Store error-fix mappings in archon |
| **GitHub Integration** | `get_file_contents`<br>`search_code`<br>`get_commit`<br>`list_commits` | Check implementation examples, verify patterns, review changes |
| **Debugging** | `sequential-thinking` (1 tool) | Reason through bugs, plan fixes methodically |

**Total Tools: ~70-80 tools**

---

## **Phase 3: Late Coding (Testing & Finalization)**
**Prompts:** Prompt-Late-Coding.MD  
**Goal:** Test thoroughly, optimize performance, document and deploy

| Tool Category | Tools | Purpose |
|--------------|-------|---------|
| **Testing** | Terminal tools (5-8 tools) | Run unit tests, integration tests, check coverage |
| **Code Review** | `serena` (22 tools)<br>`filesystem` (15 tools) | Review code quality, optimize performance, validate standards |
| **Memory** | `memory` (9 tools) | Store test results, optimization notes, implementation summary |
| **Project Documentation** | `archon` (12-15 tools) | Store final implementation notes, document lessons learned, archive code examples, update project documentation |
| **GitHub Operations** | `create_pull_request`<br>`request_copilot_review`<br>`list_pull_requests`<br>`get_pull_request_status` | Create PR, request reviews, track CI/CD status |
| **Documentation** | `filesystem` (write docs)<br>`memory` (store patterns) | Generate documentation, update README, document patterns |
| **Validation** | Terminal + GitHub workflows | Run final builds, validate deployment readiness |

**Total Tools: ~65-75 tools**

---

## **Tool Usage Summary**

| Phase | Core Tools | Total Count | Primary Focus |
|-------|-----------|-------------|---------------|
| **Early Coding** | serena, filesystem, memory, archon, sequential-thinking, GitHub read | ~60-65 | Architecture planning & scaffolding |
| **Mid Coding** | serena, Context7, filesystem, memory, archon, terminal, GitHub read | ~70-80 | Implementation, dependency debugging & error resolution |
| **Late Coding** | serena, filesystem, memory, archon, terminal, GitHub write/PR | ~65-75 | Testing, optimization & deployment |

**Key Design Principles:**
- ✅ Each phase stays under 80 tools (well under 128 limit)
- ✅ `serena` + `filesystem` used throughout (core coding tools)
- ✅ `memory` used across all phases (context continuity)
- ✅ `archon` used across all phases (project notes, documentation, tracking)
- ✅ Terminal tools in Phases 2-3 (execution & testing)
- ✅ GitHub write operations only in Phase 3 (PR creation, deployment)
- ✅ `sequential-thinking` in Phases 1-2 (planning & debugging)
- ✅ **Dependency debugging protocol** in Phase 2:
  - Capture error codes from terminal
  - Use serena to analyze repo structure (imports, paths, symbols)
  - Use Context7 to verify against official documentation
  - Compare error with both sources before providing fix
  - Store error-fix patterns in archon for future reference

---

## **GitHub MCP Tools Distribution for Coding**

### **Phase 1: Early Coding - GitHub Tools (~8-10 tools)**
**Focus:** Read-only, understanding context

- `get_file_contents` - Examine existing code
- `search_code` - Find implementation patterns
- `list_commits` - Review recent changes
- `get_commit` - Understand specific changes
- `list_branches` - Check branch structure

---

### **Phase 2: Mid Coding - GitHub Tools (~10-12 tools)**
**Focus:** Implementation support, no modifications yet

- All Phase 1 tools +
- `get_pull_request` - Review existing PRs for patterns
- `get_pull_request_files` - Study change patterns
- `search_issues` - Research known bugs
- `list_releases` - Check version compatibility

---

### **Phase 3: Late Coding - GitHub Tools (~15-20 tools)**
**Focus:** PR creation, review, deployment

- Selected Phase 1-2 tools +
- `create_pull_request` - Submit code changes
- `create_pull_request_with_copilot` - AI-assisted PR creation
- `request_copilot_review` - Request automated review
- `get_pull_request_status` - Check CI/CD status
- `merge_pull_request` - Merge when approved
- `create_issue` - Document follow-up work
- `list_workflows` - Check CI/CD pipelines
- `get_workflow_run` - Monitor build status

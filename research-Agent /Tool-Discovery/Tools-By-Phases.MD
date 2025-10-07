# Tool Distribution by Research Phase

This document defines which MCP tools are used in each research prompt to stay under the 128 tool limit while maximizing efficiency.

---

## **Phase 1: Early Research (Discovery)**
**Prompts:** Prompt-Early-research.MD  
**Goal:** Analyze project baseline and discover 5-8 candidate tools

| Tool Category | Tools | Purpose |
|--------------|-------|---------|
| **Project Analysis** | `serena` (22 tools)<br>`filesystem` (15 tools) | Analyze current architecture, inventory dependencies, explore codebase structure |
| **Search & Discovery** | `search_repositories`<br>`search_code`<br>`search_users`<br>`search_orgs` | Find candidate tools on GitHub matching criteria (stars, activity, language) |
| **Documentation** | `Context7` (2 tools)<br>`get_library_docs`<br>`resolve_library_id` | Fetch official documentation for initial candidate overview |
| **Memory** | `memory` (9 tools)<br>`create_entities`<br>`add_observations`<br>`read_graph` | Store baseline snapshot, candidate list, initial assessments |
| **Web Research** | `crawl4ai-rag-mcp` (est. 8 tools)<br>- crawl URLs<br>- search knowledge<br>- extract content | Scrape README files, community discussions, usage examples |

**Total Tools: ~60-65 tools**

---

## **Phase 2: Mid Research (Evaluation)**
**Prompts:** prompt-mid-research.MD  
**Goal:** Deep technical evaluation of top 3-4 finalists

| Tool Category | Tools | Purpose |
|--------------|-------|---------|
| **Code Analysis** | `serena` (22 tools)<br>`search_code`<br>`get_file_contents`<br>`search_files` | Check API compatibility, extract targeted code snippets (setup, config, integration patterns) |
| **Documentation** | `Context7` (2 tools)<br>`get_library_docs` | Deep-dive into API docs, migration guides, breaking changes |
| **Web Research** | `crawl4ai-rag-mcp` (8 tools) | Scrape advanced examples, community best practices, GitHub issues/discussions |
| **Repository Details** | `get_file_contents`<br>`list_commits`<br>`list_releases`<br>`get_release_by_tag` | Analyze update frequency, version history, changelog details |
| **Memory** | `memory` (9 tools)<br>`add_observations`<br>`create_relations`<br>`read_graph` | Store comparison tables, technical evaluations, narrowed finalists |
| **Filesystem** | `filesystem` (15 tools)<br>`read_text_file`<br>`list_directory` | Reference local project structure for compatibility checks |

**Total Tools: ~60-70 tools**

---

## **Phase 3: Late Research (Decision & Implementation)**
**Prompts:** Last-prompt-research.MD  
**Goal:** Make final decision and create implementation plan

| Tool Category | Tools | Purpose |
|--------------|-------|---------|
| **Decision Support** | `sequential-thinking` (1 tool) | Build weighted decision matrix, evaluate trade-offs |
| **Memory** | `memory` (9 tools)<br>`read_graph`<br>`search_nodes`<br>`open_nodes` | Retrieve previous evaluations, candidate scores, technical assessments |
| **Project Management** | `archon` (est. 12-15 tools)<br>- create/update tasks<br>- manage documents<br>- store code examples<br>- track decisions | Document final decision, store implementation guide, create integration checklist with code snippets |
| **Code Integration** | `serena` (22 tools)<br>`filesystem` (15 tools) | Pull code examples from archon, validate integration points, prepare actual implementation snippets |
| **Repository Access** | `get_file_contents`<br>`get_release_by_tag` | Fetch final installation commands, specific version details for recommendation |
| **Terminal Execution** | `terminal` tools (if available)<br>- run commands<br>- execute scripts<br>- test installations | Run installation commands, verify setup, execute test scripts, validate configurations |
| **Code Review** | VSCode tools (if available)<br>- view files<br>- edit code<br>- navigate workspace | Review integration points, examine current codebase, prepare for actual implementation |

**Total Tools: ~65-75 tools**

---

## **Tool Usage Summary**

| Phase | Core Tools | Total Count | Primary Focus |
|-------|-----------|-------------|---------------|
| **Early Research** | serena, filesystem, Context7, memory, GitHub search, crawl4ai-rag | ~60-65 | Discovery & baseline analysis |
| **Mid Research** | serena, Context7, crawl4ai-rag, memory, filesystem, GitHub API | ~60-70 | Technical evaluation & compatibility |
| **Late Research** | archon, memory, serena, filesystem, sequential-thinking, terminal, code-review | ~65-75 | Decision making, implementation & validation |

**Key Design Principles:**
- ✅ Each phase stays under 75 tools (well under 128 limit)
- ✅ `archon` only used in Phase 3 (implementation stage)
- ✅ `serena` used in Phases 1-3 (architecture analysis throughout)
- ✅ `Context7` + `crawl4ai-rag` used in Phases 1-2 (research-heavy stages)
- ✅ `memory` used across all phases (context continuity)
- ✅ GitHub tools prioritized in Phases 1-2 (discovery & evaluation)
- ✅ `terminal` + code review tools only in Phase 3 (validation & implementation)

---

## **GitHub MCP Tools Distribution (107 total tools)**

### **Phase 1: Early Research - GitHub Tools (~35-40 tools)**
**Focus:** Discovery, search, and initial analysis

| Tool Category | Tools | Purpose |
|--------------|-------|--------|
| **Search & Discovery** | `search_repositories`<br>`search_code`<br>`search_issues`<br>`search_users`<br>`search_orgs` | Find candidate repositories, discover similar projects, identify active maintainers |
| **Repository Info** | `get_file_contents`<br>`list_branches`<br>`list_tags`<br>`list_releases`<br>`get_release_by_tag` | Examine README, docs, version history, release notes for candidates |
| **Community Health** | `list_issues`<br>`list_pull_requests`<br>`list_commits`<br>`list_starred_repositories` | Assess activity level, issue response time, community engagement |
| **Metadata** | `get_repository` (via search)<br>`list_discussion_categories`<br>`list_discussions` | Check stars, forks, last update, license, community discussions |
| **Security** | `list_dependabot_alerts`<br>`list_secret_scanning_alerts`<br>`list_code_scanning_alerts` | Initial security health check for candidates |

**Excluded from Phase 1:** PR creation, file modifications, workflow runs, project management tools

---

### **Phase 2: Mid Research - GitHub Tools (~40-45 tools)**
**Focus:** Deep technical evaluation and code analysis

| Tool Category | Tools | Purpose |
|--------------|-------|--------|
| **Code Analysis** | `search_code`<br>`get_file_contents`<br>`get_commit`<br>`list_commits` | Extract code snippets, examine implementation patterns, check recent changes |
| **PR & Review Analysis** | `list_pull_requests`<br>`get_pull_request`<br>`get_pull_request_files`<br>`get_pull_request_diff`<br>`get_pull_request_reviews` | Study how library is used in real PRs, review patterns, integration examples |
| **Version History** | `list_releases`<br>`get_release_by_tag`<br>`list_tags`<br>`get_commit` | Analyze update frequency, breaking changes, migration paths |
| **Issue Tracking** | `list_issues`<br>`search_issues`<br>`get_discussion`<br>`get_discussion_comments` | Research common problems, workarounds, compatibility issues |
| **Security Deep-Dive** | `get_dependabot_alert`<br>`get_secret_scanning_alert`<br>`get_code_scanning_alert`<br>`list_global_security_advisories` | Detailed security assessment, vulnerability analysis |
| **Documentation** | `get_file_contents` (docs/)<br>`search_code` (examples/) | Find advanced usage docs, tutorials, code examples |

**Excluded from Phase 2:** PR creation, merging, file modifications, workflow management

---

### **Phase 3: Late Research - GitHub Tools (~25-30 tools)**
**Focus:** Implementation planning and documentation

| Tool Category | Tools | Purpose |
|--------------|-------|--------|
| **Implementation Prep** | `get_file_contents`<br>`get_release_by_tag`<br>`list_releases` | Fetch installation instructions, specific version setup, latest stable release |
| **Code Examples** | `search_code`<br>`get_file_contents` | Pull actual implementation examples for integration guide |
| **Project Management** | `create_repository` (if needed)<br>`list_projects`<br>`get_project`<br>`create_pull_request_with_copilot` | Set up implementation tracking, prepare for integration work |
| **Issue Creation** | `create_issue` (if needed)<br>`list_issue_types` | Document integration tasks, track implementation blockers |
| **Notifications** | `list_notifications`<br>`manage_repository_notification_subscription` | Subscribe to chosen tool's repo for updates and important announcements |
| **Final Verification** | `get_commit`<br>`list_commits`<br>`search_issues` | Verify latest stable version, check for recent critical issues |
| **Code Review** | `get_file_contents`<br>`get_pull_request_files` | Review actual code structure, examine integration patterns for implementation |

**Excluded from Phase 3:** Extensive searching (already done), security scanning (completed in Phase 2), community analysis (completed in Phase 1)

---

## **GitHub MCP Tool Budget Summary**

| Phase | GitHub Tools | Strategy | Tools Saved For |
|-------|--------------|----------|----------------|
| **Phase 1** | 35-40 tools | Heavy search & discovery | Code analysis, PR tools |
| **Phase 2** | 40-45 tools | Deep technical evaluation | Repository creation, project mgmt |
| **Phase 3** | 25-30 tools | Implementation & setup | Search tools, analysis tools |

**Total Available:** 107 GitHub MCP tools  
**Never Used:** ~10-15 tools (advanced workflow management, team operations, enterprise features)

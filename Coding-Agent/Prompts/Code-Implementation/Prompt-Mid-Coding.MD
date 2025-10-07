---
mode: Code-Implementation
phase: mid-coding
---

## Implementation Phase: Code, Debug & Refactor

### Your Task
Take the architecture from Early Coding and implement the actual functionality with careful debugging.

### What I'm Bringing From Early Coding
**Architecture Plan:** [reference from archon - component breakdown, file structure]

**Scaffolded Files:** [list files created in Phase 1]

**Implementation Priorities:** [which components/functions to tackle first]

**Technical Concerns:** [challenges identified in planning phase]

### What You Should Do

**Phase 2: Implementation & Debugging**

For each component/function:

1. **Write Code** (use `serena` + `filesystem`)
   - Implement core logic following architecture plan
   - Use symbolic editing for precise code insertion
   - Follow existing code patterns from project
   - Reference `memory` for architecture decisions

2. **Dependency Management & Debugging** ⚠️ **CRITICAL PROTOCOL**
   - Run code with `terminal` to capture error codes
   - **For ANY dependency/import/path/symbol error:**
     - ✅ Use `serena` (find_symbol, find_referencing_symbols) to analyze repo structure
     - ✅ Use `Context7` to verify against official documentation
     - ✅ Compare error code with BOTH sources
     - ✅ Test fix with terminal before applying
     - ✅ Store error-fix mapping in `archon` (Error Code → Root Cause → Solution)
   - Track ALL error codes meticulously
   - Never guess at import paths - always verify

3. **Code Quality** (use `serena`)
   - Check for unused imports/variables
   - Validate type safety
   - Ensure proper error handling
   - Follow project conventions

4. **Track Progress** (use `archon`)
   - Store implementation notes
   - Document bug fixes and solutions
   - Save useful code snippets
   - Note any architectural adjustments

5. **Incremental Testing** (use `terminal`)
   - Run code after each significant change
   - Capture and analyze error messages
   - Verify functionality works as expected

### Expected Output

**Deliver this for Late Coding (Testing Phase):**

1. **Implemented Code**
   - All functions/components fully working
   - Proper error handling
   - Type-safe and validated

2. **Error Log Summary** (stored in archon)
   | Error Code | Root Cause | Solution | Prevention |
   |------------|------------|----------|------------|
   | ...        | ...        | ...      | ...        |

3. **Code Quality Report** (150-200 words)
   - What was implemented
   - Key decisions made during coding
   - Refactoring done
   - Known limitations or TODOs

4. **Dependencies Added**
   - New packages installed
   - Version numbers
   - Why they were needed

5. **Testing Notes** (for Phase 3)
   - What needs testing
   - Edge cases to consider
   - Integration points to verify

**Handoff:** Pass working implementation + error log + testing notes to Late-Coding for final validation.

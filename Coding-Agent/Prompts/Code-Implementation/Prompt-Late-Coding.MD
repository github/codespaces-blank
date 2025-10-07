---
mode: Code-Implementation
phase: late-coding
---

## Testing & Deployment Phase: Validate, Optimize & Ship

### Your Task
Test thoroughly, optimize performance, document code, and prepare for deployment.

### What I'm Bringing From Mid Coding
**Implemented Code:** [reference from Phase 2 - what was built]

**Error Log:** [reference from archon - bugs fixed and solutions]

**Testing Notes:** [edge cases, integration points to verify]

**Dependencies:** [new packages and versions installed]

### What You Should Do

**Phase 3: Testing, Optimization & Deployment**

1. **Run Tests** (use `terminal`)
   - Unit tests: `npm test` or equivalent
   - Integration tests if applicable
   - Check test coverage
   - Capture any test failures with error codes

2. **Code Review & Optimization** (use `serena` + `filesystem`)
   - Review code quality and patterns
   - Optimize performance bottlenecks
   - Remove dead code and unused imports
   - Validate all error handling
   - Check for security issues

3. **Debug Remaining Issues** (if any)
   - Use same **dependency debugging protocol** from Phase 2
   - Capture error codes → analyze with serena → verify with Context7
   - Store solutions in `archon`

4. **Documentation** (use `filesystem` + `archon`)
   - Add code comments for complex logic
   - Update README if needed
   - Document API endpoints or component props
   - Store implementation patterns in `archon` for future reference

5. **Final Validation** (use `terminal`)
   - Run full build: `npm run build` or equivalent
   - Check for type errors
   - Verify no console errors
   - Test in target environment

6. **Prepare Deployment** (use GitHub tools)
   - Create feature branch if not already
   - Stage and review changes
   - Prepare commit message
   - Create pull request

### Expected Output

**Final Deliverables:**

1. **Test Results Summary**
   - ✅ All tests passing
   - Code coverage percentage
   - Any skipped tests and why

2. **Code Quality Report** (100-150 words)
   - Optimizations made
   - Security considerations
   - Performance metrics
   - Code review findings

3. **Documentation Updates**
   - [ ] Code comments added
   - [ ] README updated
   - [ ] API/Component docs written
   - [ ] Changelog entry

4. **Pull Request** (use `create_pull_request` or `create_pull_request_with_copilot`)
   - Clear title and description
   - Reference related issues
   - Screenshots/demos if applicable
   - Checklist for reviewers

5. **Implementation Summary** (store in archon + memory)
   - What was built
   - Key decisions made
   - Lessons learned
   - Patterns to reuse
   - Known limitations
   - Future improvements

6. **Deployment Checklist**
   - [ ] Tests passing
   - [ ] Build successful
   - [ ] Documentation updated
   - [ ] PR created and reviewers assigned
   - [ ] CI/CD status: ✅/⏳/❌

**Optional: Request Review**
- Use `request_copilot_review` for automated code review
- Monitor `get_pull_request_status` for CI/CD results
- Use `list_workflows` to check pipeline status

**Session Complete:** Feature implemented, tested, documented, and ready for review/deployment! 🚀

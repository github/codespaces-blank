# Tendrra AI Project - AI Agent Configuration (agents.md)

This document is the central hub for AI agents (like Cursor, Windsurf, Aider, Devin, or Antigravity) interacting with the Tendrra AI project. **All AI agents MUST read this file to understand the project structure, constraints, and available skills before taking action.**

## 1. Project Architecture & Context

Tendrra AI is an enterprise software solution. The repository is structured as a Turborepo monorepo:

### Core Tech Stack
*   **Package Manager**: `pnpm`
*   **Monorepo Tool**: `turborepo`
*   **Framework**: Next.js (App Router, React 19)
*   **Authentication**: Better Auth (with potentially multiple adapters)
*   **Database/Backend**: Firebase (Firestore, Auth, Storage) and potentially others depending on the microfrontend.
*   **Styling**: Tailwind CSS, Shadcn UI (or similar design systems).

### Workspace Structure
*   `apps/dashboard`: The main Next.js web application (WorldAutomate dashboard).
*   `packages/*`: Shared utilities, UI components, and configs.
*   `.agents/skills/`: The repository for AI agent skills and guidelines.

## 2. AI Skills Management

We use "Skills" to extend an AI agent's capabilities. A skill is a folder containing specific guidelines, context, and instructions for a particular technology or domain.

### Existing Skills
You can find the following skills in `.agents/skills/`:
*   `dashboard-app`: Specific guidelines for the `apps/dashboard` frontend.
*   `ai-sdk`: Instructions for using Vercel AI SDK.
*   `better-auth-best-practices` & `create-auth-skill`: Authentication scaffolding and best practices.
*   `next-cache-components` & `vercel-react-best-practices`: Next.js and React optimization.
*   `turborepo`: Monorepo build system guidance.
*   `web-design-guidelines`: UI/UX best practices.

### Combining Skills
When completing a task, agents should identify all relevant skills and synthesize their instructions. For example, if adding a login page to the dashboard:
1. Read `.agents/skills/dashboard-app/SKILL.md` (for the dashboard context).
2. Read `.agents/skills/better-auth-best-practices/SKILL.md` (for authentication).
3. Read `.agents/skills/web-design-guidelines/SKILL.md` (for UI rules).

### Creating a New Skill
If an agent needs to standardize a new pattern or setup a new microfrontend, it should create a new skill:
1.  Create a folder: `.agents/skills/<skill-name>/`
2.  Create a `SKILL.md` file inside the folder.
3.  The `SKILL.md` file must contain YAML frontmatter with `name` and `description` (which includes triggers on when to use it).
4.  Write detailed markdown instructions in the file.

Example `SKILL.md` format:
```markdown
---
name: my-new-skill
description: Use when the user asks to build X. Triggers on "build X", "X setup".
---
# My New Skill
Instructions for X...
```

## 3. General Development Rules
1.  **Do not use placeholders**: Always provide complete, working code.
2.  **Aesthetics Matter**: Ensure all UI is premium, using the designated design system (Tailwind + Shadcn/Aceternity).
3.  **Performant Next.js**: Use Server Components by default. Only use `'use client'` when interactivity or hooks are required.
4.  **Turborepo**: When adding dependencies or scripts, ensure they align with the Turborepo caching and pipeline setup in `turbo.json`.

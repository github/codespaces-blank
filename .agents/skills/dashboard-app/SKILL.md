---
name: dashboard-app
description: Core guidelines and context for developing the WorldAutomate Dashboard Next.js app located in apps/dashboard. Use when tasks involve apps/dashboard, layout.tsx, page.tsx, routing, state management, or UI creation within the dashboard. Triggers on "dashboard", "apps/dashboard", "WorldAutomate app".
---

# Dashboard App Skill

This skill provides context and rules specifically for working within `apps/dashboard`.

## 1. Context
The Dashboard is the primary enterprise solution interface for WorldAutomate. It is built using:
- **Next.js App Router** (`apps/dashboard/src/app`)
- **React 19**
- **Tailwind CSS**
- **next-themes** (for Dark/Light mode, currently using `system` as default)
- **Firebase** (configured in `src/lib/firebase.ts`)

## 2. Directory Structure
- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable React components. Keep them modular.
- `src/lib/`: Utility functions and third-party initializations (e.g., `firebase.ts`).
- `src/styles/` or `src/app/globals.css`: Global styles and Tailwind directives.

## 3. Development Rules
- **Server Components by Default**: All components in `src/app` should be Server Components unless they require state (`useState`), effects (`useEffect`), or event listeners (`onClick`). Add `"use client";` at the very top of the file only when necessary.
- **Theme Support**: The dashboard uses `next-themes` (`ThemeProvider`). Ensure all custom components support dark mode using Tailwind's `dark:` variant.
- **Data Fetching**: Prefer Server Actions and Server Component data fetching over client-side `useEffect` fetching where possible to utilize Next.js caching (`next-cache-components` skill).
- **Styling**: Use Tailwind CSS utility classes. For complex dynamic class merging, use a utility like `clsx` and `tailwind-merge` if available in the project.
- **Firebase Integration**: When authenticating or accessing the database from the client, use the initialized app from `src/lib/firebase.ts`.

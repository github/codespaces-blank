# GEMINI.md - Project Context

## Project Overview

This is a personal dashboard application built with React, TypeScript, and Vite. It's designed to help users organize their day by tracking goals, habits, and tasks. The application uses Tailwind CSS for styling and is configured to be a Progressive Web App (PWA).

The core functionality is centered around task management. Users can:
- Create, edit, and delete tasks.
- Assign a date, time, and category to each task.
- Mark tasks as complete.
- Manage a custom list of categories, including adding and deleting them.

### Key Technologies

*   **Framework:** React
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Linting:** ESLint

### Architecture

The application follows a simple component-based architecture:

*   `src/main.tsx`: The entry point of the application.
*   `src/App.tsx`: The root component that renders the main `Dashboard`.
*   `src/components/Dashboard.tsx`: The primary component that manages the application's state for tasks and categories. It handles all the logic for adding, editing, and deleting tasks and categories. It renders the main UI, including goals, habits, and the task list.
*   `src/components/TaskCreateModal.tsx`: A versatile modal component used for both creating new tasks and editing existing ones. It contains the form for task details and the UI for managing categories.

## Building and Running

### Scripts

The following scripts are available in `package.json`:

*   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
*   `npm run build`: Compiles the TypeScript code and builds the application for production.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run preview`: Serves the production build locally for preview.

### Development Workflow

1.  Install dependencies: `npm install`
2.  Start the development server: `npm run dev`
3.  Open the application in your browser at the provided URL (usually `http://localhost:5173`).

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for utility-first styling. Custom styles and theme configurations are defined in `tailwind.config.js`.
*   **State Management:** State is managed in the `Dashboard.tsx` component using React's `useState` hook and passed down to child components as props.
*   **Typing:** TypeScript is used for static typing. Type definitions are co-located with the components or defined in relevant files.
*   **Linting:** ESLint is configured to enforce code quality and consistency. The configuration is in `eslint.config.js`.
*   **PWA:** The application is configured as a Progressive Web App using `vite-plugin-pwa`. The manifest and service worker settings are in `vite.config.ts`.

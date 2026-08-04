# ToDo Electron App

A Windows To-Do List application built with Electron, React, and Vite.

## Features

- **Categories**: Organize tasks with color-coded categories
- **Due Dates**: Set deadlines with visual overdue indicators
- **Search & Filter**: Find tasks quickly with search, status, and due date filters
- **Sort**: Sort by created date, due date, or alphabetically
- **Undo Delete**: Accidentally deleted a task? Undo within 3 seconds
- **Windows Notifications**: Get notified about overdue tasks on launch

## Tech Stack

- Electron 33 + Vite 5 + React 18
- TypeScript
- Tailwind CSS
- electron-store (native persistence)
- Electron Forge (packaging)

## Development

```bash
# Install dependencies
npm install

# Run in development mode with HMR
npm run dev

# Run tests
npm test
```

## Build for Windows

```bash
# Build and package (produces out/todolist-windows-x64/)
npm run package
```

## GitHub Actions

Two workflows are available:

- **build-windows** — runs on push to `main`, builds the app and uploads the `.exe` and `.zip` as artifacts
- **release-windows** — manual trigger to create a GitHub Release with the packaged installer

## Project Structure

```
├── electron/
│   ├── main.ts          # Main process: store, IPC, window management
│   └── preload.ts       # Preload script: IPC bridge to renderer
├── src/
│   ├── App.tsx          # Root component
│   ├── main.tsx         # React entry point
│   ├── types.ts         # TypeScript interfaces
│   ├── store/
│   │   └── useStore.ts  # electron-store React context
│   ├── lib/
│   │   └── filterSort.ts # Filter and sort logic
│   └── components/      # React components
├── .github/workflows/   # CI/CD workflows
└── docs/superpowers/    # Design specs and plans
```

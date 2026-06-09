# GEMINI.md

This file contains instructional context for the SaaS Microservices project.

## Project Overview
This project is a SaaS application demonstrating microservices architecture within a monorepo. It features:
- **Frontend**: Next.js 16 (App Router) at `apps/dashboard`.
- **Backend**: Express.js microservice at `apps/api`.
- **Monorepo Management**: Turborepo.
- **Styling**: Tailwind CSS + CSS Modules.
- **Microfrontends**: Vercel-based routing.

## Development & Execution

### Commands
- `pnpm install`: Install project dependencies.
- `pnpm dev`: Runs both dashboard and api services concurrently.
- `pnpm dev:dashboard`: Run only the dashboard service.
- `pnpm dev:api`: Run only the api service.
- `pnpm build`: Build all services.
- `pnpm typecheck`: Run type checking across the monorepo.

### Local Development
The project uses a local development proxy via Vercel microfrontends to stitch requests between the `dashboard` and `api` applications.
- **Dashboard**: http://localhost:3024
- **API**: http://localhost:3001

## Architecture & Conventions
- **Routing**: Next.js App Router for the dashboard. Express for backend API routes.
- **Authentication**: Cookie-based (`saas_microservices_authed_user`). Managed via Next.js middleware.
- **Components**: Shared UI components located in `apps/dashboard/src/components`.
- **Styling**: Utility-first with Tailwind CSS.
- **Standards**: React 19, Server Components for data fetching.

## Key Files
- `turbo.json`: Turborepo task definitions and pipeline.
- `pnpm-workspace.yaml`: Workspace configuration.
- `apps/dashboard/`: Next.js application root.
- `apps/api/`: Express.js backend root.
- `SAAS_ARCHITECTURE.md`: Detailed architectural design and design patterns.

## Best Practices
- **Performance**: Utilize server-side rendering, dynamic imports, and image/font optimization.
- **Microservices**: Independent builds and deployments with clear API contracts.
- **Monorepo**: Use `turbo run ... --affected` for efficient CI/CD.

---

**Note**: For detailed architectural design patterns and guidelines, refer to `SAAS_ARCHITECTURE.md`.

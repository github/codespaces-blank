# Welcome to React Router

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)
- 🏉 **Rugby match tracker** – an interactive page (`/tracker`) for journalists to record tries, penalties, conversions, drops, cards and substitutions with timestamps. The tracker supports player selection, concussion protocol flags, and exporting the summary to clipboard or PDF.
- 🗂 **Gestion des effectifs** – page `/roster` permet de :
  1. Constituer un *effectif global* de joueurs (prénom + nom), stocké côté serveur et réutilisable.
  2. Créer plusieurs rosters de match en sélectionnant des joueurs depuis cet effectif et en leur assignant un numéro de maillot (1‑15 titulaires, 16‑23 remplaçants).
Les rosters et l’effectif global sont sauvegardés via l’API `/api/rosters` et peuvent être modifiés sans toucher au JSON manuellement.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

### Render PostgreSQL Configuration

The app now stores rosters, match-day team selections, and summaries in PostgreSQL.

Set the environment variable below in Render (Service > Environment):

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME
```

Notes:

- Use the Render PostgreSQL "External Database URL" as `DATABASE_URL`.
- No local SQLite setup is needed in production.

### Environment Variables (Auth + Email)

Required:

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME
```

Optional (live tracking security):

```bash
LIVE_TOKEN_PEPPER=change-me
LIVE_SESSION_TTL_HOURS=12
```

Optional (emails sent when a new account is created):

```bash
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL="SidePitcher <onboarding@resend.dev>"
ADMIN_NOTIFICATION_EMAIL=admin@your-domain.com
```

Admin seed at first startup:

- Email: `mlpreira@gmail.com`
- Password: `test01`

Important:

- Connect once with this admin account, then immediately change the password from the app.
- If `RESEND_API_KEY` is missing, account creation still works but no emails are sent.
- With `RESEND_API_KEY` configured, two emails are sent on signup: one to the admin, one to the new user (pending validation notice).

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

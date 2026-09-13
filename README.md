# Rakatoss 🪙

> Coin-based toss betting platform — no real money, pure fun.  
> Built with **SvelteKit + Cloudflare Pages + Turso (libSQL) + Drizzle ORM**.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | SvelteKit (SSR + API routes) |
| Hosting | Cloudflare Pages + Workers |
| Database | Turso (libSQL / SQLite edge) + Drizzle ORM |
| Auth | Lucia v3 (7-day session, Cloudflare KV) |
| Admin 2FA | TOTP via `@oslojs/otp` (Google Authenticator / Authy) |
| Email | Brevo API (verification + password reset only) |
| Media | Cloudinary (deposit screenshots) |
| Real-time | SSE (Server-Sent Events) — free on Cloudflare Workers |
| UI | Tailwind CSS v4 + custom design system |
| Validation | Zod (all forms + API routes) |
| QR codes | `qrcode` (client-side UPI deep link generation) |

---

## Quick Start (local dev)

```bash
cd rakatoss
cp .env.example .env     # fill in your Turso + Brevo + Cloudinary keys
npm install
npm run dev
```

### Seed the DB

```bash
# Generate and apply migrations
npm run db:generate
npm run db:migrate

# Then in a Node shell seed the bonus tiers + superadmin:
node -e "
  import('./src/lib/db/client.js').then(({ getDb }) => {
    const db = getDb();
    import('./src/lib/server/bonus.js').then(({ seedDefaultBonusTiers }) => seedDefaultBonusTiers(db));
  });
"
```

---

## Deploy to Cloudflare Pages

1. Create a Turso database and KV namespace
2. Fill in `wrangler.toml` with your KV namespace ID and env vars
3. Set secrets: `wrangler secret put TURSO_AUTH_TOKEN`, `wrangler secret put TOTP_ENCRYPTION_KEY`

```bash
npm run deploy
```

---

## Feature Overview

### User side
| Feature | Route |
|---|---|
| Register / login | `/auth/register` `/auth/login` |
| Lobby (open matches) | `/` |
| Match detail + bet + SSE pool | `/matches/[id]` |
| Deposit via UPI QR | `/wallet/deposit` → `/wallet/deposit/[ref]` |
| Withdraw coins | `/wallet/withdraw` |
| Transaction history | `/wallet/history` |
| My bets | `/bets` |
| Profile + referral link | `/profile` |
| Notifications (full log) | `/notifications` |
| Support tickets | `/support` |

### Admin panel (`/admin`)
| Section | Features |
|---|---|
| Dashboard | KPI tiles, 7-day bet chart |
| Matches | Create, lock, declare winner (heads/tails), cancel + refund |
| Deposits | View UTR, confirm → coins credited, reject |
| Withdrawals | Approve, mark paid, reject + refund |
| Users | Search, view full history, block/unblock, add/deduct coins |
| Support | Ticket queue, reply, resolve |
| Settings | Bonus tiers (superadmin only) |

---

## Settlement Math

```
prize_pool = losing_side_total − (losing_side_total × houseEdge / 100)
each_winner = their_bet + (their_bet / winning_side_total) × prize_pool
```

---

## Design System

Dark + neon aesthetic (bet365-inspired, violet primary):
- Background: `#0a0e1a` (deepest navy)
- Cards: `#111827`
- Primary neon: `#7c3aed` (violet)
- Heads: `#f59e0b` (gold)
- Tails: `#06b6d4` (cyan)
- Font: Inter + JetBrains Mono (tabular amounts)

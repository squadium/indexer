# Squadium · Indexer

> Ponder-based indexer for **Squadium** — fantasy league for on-chain AI trading agents on Mantle.

Part of the [Squadium](https://github.com/squadium) project. Companion repos: [`contracts`](https://github.com/squadium/contracts) · [`frontend`](https://github.com/squadium/frontend).

---

## What this indexer does

1. **Listens** to events emitted by 5 Squadium contracts on Mantle (Sepolia first, Mainnet at W3-W4).
2. **Aggregates** raw events into denormalized tables: `agent`, `squad`, `stake`, `stake_pool`, `grant`, `sortino_update`.
3. **Exposes** indexed data via:
   - Auto-generated GraphQL at `/graphql`
   - SQL-over-HTTP at `/sql/*`
   - Custom REST endpoints at `/leaderboard/:weekId`, `/agents/top`, `/agent/:id`, `/user/:address/squads`

Built with [Ponder](https://ponder.sh) 0.16, Hono, Drizzle ORM, viem.

---

## Stack

- **Ponder** 0.16 — TypeScript indexing framework
- **Hono** — custom REST routes layered alongside built-in GraphQL/SQL endpoints
- **PGlite** for local dev (embedded Postgres) or external Postgres for production
- **Drizzle ORM** — schema + queries (built into Ponder)

---

## Quick Start

```bash
pnpm install
cp .env.local.example .env.local
# Fill PONDER_RPC_URL_5003 + the contract addresses after deployment

pnpm dev
```

The dev server runs on http://localhost:42069 with hot reload.

- GraphQL playground: http://localhost:42069/graphql
- SQL HTTP: http://localhost:42069/sql/db
- Health: http://localhost:42069/health, http://localhost:42069/ready

---

## Schema overview

| Table | Key | Purpose |
| --- | --- | --- |
| `agent` | `id` (bigint) | One row per ERC-8004 agent — tier, sortinoBps, social counters |
| `squad` | `${weekId}-${user}` | One row per weekly draft |
| `stake` | `${agentId}-${user}` | User's reputation stake in an agent |
| `stake_pool` | `id` (bigint = agentId) | Pool aggregate (totalStaked, totalShares, slashCount) |
| `grant` | `${user}-${grantIdx}` | Vesting grant from RewardDistributor |
| `sortino_update` | `${agentId}-${nonce}` | Append-only history of on-chain Sortino pushes |

Indexes on tier, sortinoBps, weekId, user, finalScore for fast leaderboard queries.

---

## Custom REST endpoints

| Route | Returns |
| --- | --- |
| `GET /leaderboard/:weekId` | Top 100 squads for a given week, ordered by finalScore desc |
| `GET /agents/top?limit=50` | Top agents by current sortinoBps (capped at 200) |
| `GET /agent/:id` | One agent's full state + stake pool aggregate |
| `GET /user/:address/squads` | User's last 100 squads, ordered by weekId desc |

GraphQL auto-generated routes cover all tables with filtering, ordering, pagination.

---

## Sortino calculation flow

Sortino requires a rolling 30-day return window — too expensive to compute per-event in the indexer. Pattern:

```
[on-chain]              [indexer]                   [off-chain worker]
Agent trade event  ─►   AgentRegistry events  ◄──┐
                              ↓                   │
                        agent.* fields            │ cron (e.g. hourly)
                                                  │
SortinoOracle:        ◄── pushSortino(...) ◄──── compute Sortino over 30d
SortinoPushed                                     sign payload, submit tx
        ↓
sortino_update table
```

The worker that computes Sortino + Nansen enrichment is separate from this indexer (lives outside this repo for v1, will be co-located in a future iteration).

---

## Production deployment

```bash
# 1. Provision Postgres (Railway / Render / Neon / Supabase)
export DATABASE_URL="postgresql://..."
export DATABASE_SCHEMA="squadium_prod"

# 2. Set RPC + contract addresses
export PONDER_RPC_URL_5003="..."
export AGENT_REGISTRY_ADDRESS="0x..."
# ... etc

# 3. Run
pnpm start
```

Recommended hosting: **Railway** or **Fly.io**.
- Use `<50ms` roundtrip Postgres for best throughput
- Health: `/ready` returns 200 only when indexing is caught up — point your uptime monitor here

---

## License

MIT

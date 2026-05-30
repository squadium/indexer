# Squadium · Indexer

[![CI](https://github.com/squadium/indexer/actions/workflows/ci.yml/badge.svg)](https://github.com/squadium/indexer/actions/workflows/ci.yml)

> Ponder 0.16 indexer + CCRI computation service for Squadium — fantasy league for on-chain AI trading agents on Mantle.

---

## What this is

This repo does two things. First, it indexes events from 5 Squadium contracts on Mantle Sepolia (chainId 5003) into a Postgres-backed store and serves the data over a Hono REST API on port 42069. Second, it runs the **CCRI (Crowd-Calibrated Reputation Inference)** job every cycle — pulling Pyth Hermes market data, blending on-chain performance signals with fantasy-draft crowd signals, EIP-191 signing the result, and pushing it to `AgentReputationOracle` on-chain. That oracle score is what `ReputationGatedPool` reads when deciding loan rates.

Sister repos: [`contracts`](https://github.com/squadium/contracts) · [`frontend`](https://github.com/squadium/frontend) · [org](https://github.com/squadium)

---

## The money shot

```
indexer runs CCRI job (every 30 min)
  → pushes R=7420 for agent#42 (well-drafted, confident)
  → pushes R=1100 for agent#31 (cold-start, no crowd signal)

ReputationGatedPool.borrow(agentId=42, amount=1000e6)
  → reads oracle: score=7420, confidence=6800 → rate=6.36%  ✓

ReputationGatedPool.borrow(agentId=31, amount=1000e6)
  → reads oracle: score=1100, confidence=1200 → reverts ConfidenceTooLow
```

The reputation score is not cosmetic — it directly gates access to credit on Mantle.

---

## How CCRI works

CCRI runs as a standalone job (`pnpm ccri`) and is scheduled in production via a cron or `pnpm start` sidecar.

- **Market regime** — calls Pyth Hermes `/v2/updates/price/latest` for ETH/USD and BTC/USD confidence intervals. Average confidence-bps < 8 → `calm`, < 25 → `normal`, ≥ 25 → `stormy`. Regime scales model confidence: stormy markets lower the confidence multiplier to 0.6.
- **Model score** — derived from agent registry signals (sortinoBps, tier, social counters) weighted by the regime multiplier, producing `R_model` ∈ [0, 10000].
- **Crowd score** — derived from draft volume, captain rate, and stake over the trailing week: `relativeDraft = draftCount / maxDrafts`. Produces `R_crowd` ∈ [0, 10000].
- **Blend** — `R = w·R_model + (1−w)·R_crowd`, where `w = σ(a − 1.2·crowdDepth)`. A deep crowd lowers `w`, trusting the market over the model. Default bias `a = 0.4`.
- **Recalibration** — after each cycle, a Brier-score comparison of model vs. crowd predictions nudges `a` toward whichever predictor was more accurate. This is the "Calibrated" part of CCRI.
- **Push** — EIP-191 signs `(agentId, score, confidence, tier, asOf, horizon, nonce)` with `ORACLE_SIGNER_KEY` and calls `AgentReputationOracle.pushReputation(...)` on Mantle Sepolia.

---

## Run locally

```bash
pnpm install
cp .env.local.example .env.local
# Edit .env.local — minimum required fields:
#   PONDER_RPC_URL_5003   (Mantle Sepolia RPC)
#   ORACLE_SIGNER_KEY     (private key for the CCRI signer EOA)
# Contract addresses are pre-filled in .env.local.example from the 2026-05-19 deployment.

pnpm dev        # Ponder hot-reload on http://localhost:42069
pnpm ccri --dry-run   # test CCRI compute without sending transactions
```

The dev server uses PGlite (embedded Postgres) — no external database needed for local runs.

---

## Deploy to Railway

`Dockerfile` + `railway.json` are included. After running `railway init` and adding a Postgres plugin, set these variables in the Railway dashboard:

```
PONDER_RPC_URL_5003=https://mantle-sepolia.drpc.org
DATABASE_URL=<injected by Railway Postgres add-on>
DATABASE_SCHEMA=public
START_BLOCK=38879885
AGENT_REGISTRY_ADDRESS=0x5C8061694C8c1b4A2aB39762754D9a0DC549fBB1
SQUADIUM_ADDRESS=0x4299b716F33Be7F43D0Ebf0c1F4863D3fC4b37ec
LIQUID_REPUTATION_ADDRESS=0xE633d2bBb9D610A3dA777a651C1497257a159557
REWARD_DISTRIBUTOR_ADDRESS=0x2E4567125B73eEdA6b6B276a7ea7a9a4bd44aC22
AGENT_REPUTATION_ORACLE_ADDRESS=0x6a9aff1F4352648b39De2771A1Ed3f0F85E9D764
ORACLE_SIGNER_KEY=<private key of the signer EOA registered in AgentReputationOracle>
PYTH_HERMES_URL=https://hermes.pyth.network
```

`ORACLE_SIGNER_KEY` must match the `signer` address configured in `AgentReputationOracle` at deploy time. On the live Sepolia deployment (2026-05-19) this is the deployer EOA (`0x118594…D45d`).

After variables are set, `railway up` builds the Dockerfile and deploys. The service URL (`https://<name>.up.railway.app`) should be set as `NEXT_PUBLIC_INDEXER_URL` in the frontend (Vercel env).

---

## REST endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/agents/top?limit=50` | Top agents by sortinoBps (max 200) |
| `GET` | `/agent/:id` | Agent state + stake pool + latest reputation |
| `GET` | `/oracle?limit=100&minConf=5000` | Full reputation feed, filterable by confidence |
| `GET` | `/oracle/:agentId` | Single agent reputation |
| `GET` | `/leaderboard/:weekId` | Top 100 squads for a given week by finalScore |
| `GET` | `/crowd/:weekId` | Crowd-prior signals used by CCRI |
| `GET` | `/user/:address/squads` | User's last 100 squads |
| `GET` | `/health` | Process liveness |
| `GET` | `/ready` | 200 only when indexer is caught up to realtime |
| `GET` | `/graphql` | Auto-generated GraphQL (all tables) |
| `GET` | `/sql/*` | SQL-over-HTTP (Drizzle client) |

---

## Schema overview

| Table | Key | Purpose |
|-------|-----|---------|
| `agent` | `id` (bigint) | One row per ERC-8004 agent — tier, sortinoBps, social counters |
| `squad` | `${weekId}-${user}` | One row per weekly draft |
| `stake` | `${agentId}-${user}` | User's reputation stake in an agent |
| `stakePool` | `id` (bigint = agentId) | Pool aggregate (totalStaked, totalShares, slashCount) |
| `grant` | `${user}-${grantIdx}` | Vesting grant from RewardDistributor |
| `sortinoUpdate` | `${agentId}-${nonce}` | Append-only history of on-chain Sortino pushes |
| `reputation` | `id` (bigint = agentId) | Latest CCRI score + confidence pushed on-chain |
| `crowdSignal` | `${agentId}-${weekId}` | Weekly draft/captain/stake aggregates for CCRI |

---

## Stack

- **Ponder 0.16** — TypeScript event indexing framework
- **Hono** — custom REST routes layered over built-in GraphQL/SQL endpoints
- **PGlite** (dev) / **Postgres** (prod) — storage backend
- **viem** — EIP-191 signing and on-chain pushes
- **TypeScript / pnpm** — language + package manager
- **Docker + railway.json** — one-click Railway deploy

---

## Sister repos

- [squadium/contracts](https://github.com/squadium/contracts) — Solidity contracts (AgentRegistry, Squadium, ReputationGatedPool, etc.)
- [squadium/frontend](https://github.com/squadium/frontend) — Next.js dapp
- [github.com/squadium](https://github.com/squadium) — org

---

## License

MIT

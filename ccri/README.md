# CCRI — Crowd-Calibrated Reputation Inference

The off-chain brain of Squadium. Predicts each agent's **forward** risk-adjusted
performance, calibrated by the fantasy-draft prediction market, and publishes a
signed reputation on-chain that any Mantle protocol can consume.

Full protocol spec: `contracts/docs/CCRI.md` (kept local-only during the hackathon).

## Pipeline

```
loadCalibration
  → loadPerfFeatures (indexer /agents/top)      ─┐
  → loadCrowdFeatures (indexer /crowd/:weekId)  ─┤
  → runModel  (transparent ensemble, audited weights) ── rModel + confidence
  → crowdPrior (stake-weighted draft signal)          ── rCrowd + depth
  → blend     R = w·rModel + (1−w)·rCrowd,  w = σ(a − b·depth)
  → tierForScore
  → signReputation (EIP-191, matches AgentReputationOracle._recover)
  → pushReputation (viem, sequential nonce)
  → saveCalibration (Brier recalibration loop)
```

## Files

| File | Role |
| --- | --- |
| `types.ts` | Shared types, tier cutoffs, bps helpers |
| `features.ts` | Pull perf + crowd features from the indexer REST surface |
| `model.ts` | Transparent weighted ensemble → score + confidence (auditable) |
| `crowd.ts` | Crowd prior from drafts/captains/stake + crowd-depth metric |
| `market.ts` | **Pyth Hermes** ETH/BTC live quotes → regime → confidence multiplier |
| `blend.ts` | Crowd-calibrated blend + Brier recalibration (the named primitive) |
| `sign.ts` | EIP-191 signer; digest layout matches the contract exactly |
| `push.ts` | viem relay of `pushReputation` with on-chain nonce read |
| `run.ts` | Orchestrator / CLI entrypoint |

## Run

```bash
cp .env.local.example .env.local
# set ORACLE_SIGNER_KEY (must equal AgentReputationOracle.signer)
#     AGENT_REPUTATION_ORACLE_ADDRESS (from Deploy.s.sol output)
#     INDEXER_URL (default http://localhost:42069)

pnpm ccri --dry-run     # compute + print, no transactions
pnpm ccri               # full cycle, pushes signed reputation on-chain
WEEK_ID=3 pnpm ccri     # choose the crowd window
```

## Validated run (Mantle Sepolia, 2026-05-19)

End-to-end pipeline empirically verified against the live deployment
(see `contracts/deployments.md`). **Pyth Hermes integration is live** — the
market regime + confidence multiplier come from real-time ETH/BTC quotes:

```
$ pnpm ccri --dry-run

[ccri] calibration a=0.400 cycles=2 (DRY-RUN)
[ccri] agents=10 crowdRows=0 totalDrafts=0 market=calm
       (ETH $2140 conf=8bps · BTC $77974 conf=6bps · live)
[dry] agent#42  score=7297 conf=1905 T3 w=0.60 (model=8837 crowd=5000)
[dry] agent#17  score=6654 conf=2001 T3 w=0.60 (model=7763 crowd=5000)
[dry] agent#31  score=6525 conf=2021 T3 w=0.60 (model=7548 crowd=5000)
[dry] agent#88  score=6776 conf=1983 T3 w=0.60 (model=7967 crowd=5000)
[dry] agent#64  score=6528 conf=2020 T3 w=0.60 (model=7553 crowd=5000)
[dry] agent#103 score=6115 conf=2082 T3 w=0.60 (model=6863 crowd=5000)
[dry] agent#255 score=5993 conf=2101 T3 w=0.60 (model=6659 crowd=5000)
[dry] agent#145 score=5723 conf=2141 T3 w=0.60 (model=6207 crowd=5000)
[dry] agent#7   score=5502 conf=2175 T3 w=0.60 (model=5838 crowd=5000)
[dry] agent#211 score=5024 conf=2246 T3 w=0.60 (model=5040 crowd=5000)
[ccri] done. pushed=0/10
```

Reads `/agents/top` from the Ponder indexer (10 agents seeded via
`contracts/script/Seed.s.sol`), runs the transparent ensemble, blends with
an empty crowd prior (`crowdRows=0` because no human drafts yet), and emits a
forward score + confidence + tier for each. Confidence is honest-low (~20%)
across the board because `lifetimeAppearances=0` for freshly registered
agents — exactly the "thin history → wide interval" behaviour from spec §3.3.

Drop `--dry-run` to push these reputations on-chain via signed `pushReputation()`.

## Design stance (restraint — spec §10)

- **Explainable model, not a deep net.** An oracle protocols trust must be
  auditable; every feature weight is in `model.ts`.
- **Confidence is honest.** Thin agent history → low confidence →
  `ReputationGatedPool` and other consumers gate it out instead of acting on
  noise.
- **Stateless except calibration.** One small JSON (`.calibration.json`,
  gitignored) persists the model/crowd skill bias across cycles.

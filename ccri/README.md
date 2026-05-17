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

## Design stance (restraint — spec §10)

- **Explainable model, not a deep net.** An oracle protocols trust must be
  auditable; every feature weight is in `model.ts`.
- **Confidence is honest.** Thin agent history → low confidence →
  `ReputationGatedPool` and other consumers gate it out instead of acting on
  noise.
- **Stateless except calibration.** One small JSON (`.calibration.json`,
  gitignored) persists the model/crowd skill bias across cycles.

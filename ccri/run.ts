/**
 * CCRI orchestrator (spec §5).
 *
 *   load calibration
 *     → pull perf features (indexer) + crowd features (on-chain derived)
 *     → per agent: model() + crowdPrior() → blend()
 *     → assemble Reputation → read nonce → sign → pushReputation()
 *     → persist calibration
 *
 * Usage:
 *   pnpm ccri              # full cycle, pushes on-chain
 *   pnpm ccri --dry-run    # compute + print, no transactions
 *   WEEK_ID=3 pnpm ccri    # crowd window (defaults to 1)
 */
import {blend, loadCalibration, saveCalibration, type Calibration} from "./blend";
import {crowdPrior} from "./crowd";
import {loadCrowdFeatures, loadPerfFeatures} from "./features";
import {runModel} from "./model";
import {currentNonce, pushReputation} from "./push";
import {signReputation} from "./sign";
import {HORIZON_7D, tierForScore, type Reputation} from "./types";

const DRY_RUN = process.argv.includes("--dry-run");
const WEEK_ID = BigInt(process.env.WEEK_ID ?? "1");

async function main() {
  const calib: Calibration = loadCalibration();
  console.log(`[ccri] calibration a=${calib.a.toFixed(3)} cycles=${calib.cycles} ${DRY_RUN ? "(DRY-RUN)" : ""}`);

  const perf = await loadPerfFeatures(200);
  const crowd = await loadCrowdFeatures(WEEK_ID);
  const totalDrafts = [...crowd.values()].reduce((a, c) => a + c.draftCount, 0);
  const uniqueDrafters = totalDrafts; // proxy; refined when per-manager index lands

  console.log(`[ccri] agents=${perf.length} crowdRows=${crowd.size} totalDrafts=${totalDrafts}`);

  const oracle = (process.env.AGENT_REPUTATION_ORACLE_ADDRESS ?? "0x0") as `0x${string}`;
  const asOf = BigInt(Math.floor(Date.now() / 1000));

  let pushed = 0;
  for (const f of perf) {
    const m = runModel(f);
    const cp = crowdPrior(crowd.get(f.agentId), totalDrafts, uniqueDrafters);
    const b = blend(m.rModel, m.confidence, cp.rCrowd, cp.depth, calib);

    const rep: Reputation = {
      score: b.score,
      confidence: b.confidence,
      tier: tierForScore(b.score),
      asOf,
      horizon: HORIZON_7D,
    };

    const line =
      `agent#${f.agentId} score=${rep.score} conf=${rep.confidence} ` +
      `T${rep.tier} w=${b.w.toFixed(2)} (model=${m.rModel} crowd=${cp.rCrowd})`;

    if (DRY_RUN) {
      console.log(`[dry] ${line}`);
      continue;
    }

    try {
      const nonce = (await currentNonce(f.agentId)) + 1n;
      const sig = await signReputation(f.agentId, rep, nonce, oracle);
      const tx = await pushReputation(f.agentId, rep, nonce, sig);
      console.log(`[push] ${line} tx=${tx}`);
      pushed++;
    } catch (e) {
      console.error(`[fail] agent#${f.agentId}:`, (e as Error).message);
    }
  }

  // Recalibration requires last cycle's realized winners. Until a settled-week
  // outcome feed is wired (P6), persist the cycle counter only — documented.
  saveCalibration({...calib, cycles: calib.cycles + 1});
  console.log(`[ccri] done. pushed=${pushed}/${perf.length}`);
}

main().catch((e) => {
  console.error("[ccri] fatal:", e);
  process.exit(1);
});

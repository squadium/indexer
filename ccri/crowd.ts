/**
 * CCRI crowd prior (spec §3.4).
 *
 * The fantasy drafts are a prediction market. Aggregate human behaviour —
 * weighted by mETH actually staked (sybil = expensive) — forms a prior on
 * agent quality. We also compute `crowdDepth`, which decides how much the
 * blend trusts the crowd vs the model (see blend.ts).
 */
import {toBps, type CrowdFeatures} from "./types";

const WEI = 1e18;

export interface CrowdOutput {
  rCrowd: number; // 0..10000 crowd-only score for this agent
  depth: number; // 0..1 crowd-confidence/participation for this agent
}

/**
 * @param cf            this agent's crowd features (may be undefined → no crowd)
 * @param totalDrafts   total draft picks across ALL agents this cycle (for share)
 * @param uniqueDrafters distinct managers this cycle (participation breadth)
 */
export function crowdPrior(
  cf: CrowdFeatures | undefined,
  totalDrafts: number,
  uniqueDrafters: number,
): CrowdOutput {
  if (!cf || totalDrafts === 0) return {rCrowd: 5_000, depth: 0};

  const draftShare = cf.draftCount / totalDrafts; // 0..1
  const captainRate = cf.draftCount > 0 ? cf.captainCount / cf.draftCount : 0;
  const stakeEth = Number(cf.stakeDepthWei) / WEI;
  const stakeBoost = Math.min(1, Math.log10(stakeEth + 1) / 2); // 100 mETH ⇒ ~1

  // Crowd score: blend of how often picked, how often trusted as captain,
  // and how much capital is behind it.
  const rCrowd01 = 0.45 * sat(draftShare * 6) + 0.3 * captainRate + 0.25 * stakeBoost;

  // Depth: confidence in the crowd signal itself. Needs breadth (many unique
  // drafters) AND skin in the game (stake). Herd of one wallet ⇒ shallow.
  const breadth = Math.min(1, uniqueDrafters / 25);
  const depth = Math.min(1, 0.6 * breadth + 0.4 * stakeBoost);

  return {rCrowd: toBps(rCrowd01), depth};
}

/** soft saturation to keep a runaway draft-share from pinning the score */
const sat = (x: number): number => x / (1 + x);

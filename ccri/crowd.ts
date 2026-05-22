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
 * @param maxDrafts     the highest draftCount in the field (for relative pick)
 * @param uniqueDrafters distinct managers this cycle (participation breadth)
 */
export function crowdPrior(
  cf: CrowdFeatures | undefined,
  maxDrafts: number,
  uniqueDrafters: number,
): CrowdOutput {
  if (!cf || maxDrafts === 0) return {rCrowd: 5_000, depth: 0};

  // Relative pick: how often drafted vs the field leader (0..1). Normalising to
  // the leader (not total) avoids dilution across a wide field — a heavily
  // drafted agent reads near 1.0 regardless of roster size.
  const relativeDraft = Math.min(1, cf.draftCount / maxDrafts);
  // Captain rate is the conviction signal: being captained = "I trust this one
  // most". Weighted equally with pick frequency.
  const captainRate = cf.draftCount > 0 ? cf.captainCount / cf.draftCount : 0;
  const stakeEth = Number(cf.stakeDepthWei) / WEI;
  const stakeBoost = Math.min(1, Math.log10(stakeEth + 1) / 2); // 100 mETH ⇒ ~1

  const rCrowd01 = 0.4 * relativeDraft + 0.4 * captainRate + 0.2 * stakeBoost;

  // Depth: confidence in the crowd signal itself. Needs breadth (many unique
  // drafters) AND skin in the game (stake). Herd of one wallet ⇒ shallow.
  const breadth = Math.min(1, uniqueDrafters / 25);
  const depth = Math.min(1, 0.6 * breadth + 0.4 * stakeBoost);

  return {rCrowd: toBps(rCrowd01), depth};
}

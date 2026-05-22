/**
 * CCRI model — transparent weighted ensemble (spec §3.3).
 *
 * Deliberately NOT a deep net. An oracle that Mantle protocols trust must be
 * auditable: every feature weight is visible and the score is reproducible.
 * Restraint is a feature, not a limitation (spec §10).
 *
 * Output: forward risk-adjusted score in [0,10000] + a confidence in [0,10000]
 * that widens (drops) when an agent's history is thin.
 */
import {confidenceMultiplier, type MarketContext} from "./market";
import {clamp01, toBps, type PerfFeatures} from "./types";

/** Feature weights — sum to 1.0. Tunable; documented for auditability. */
export const WEIGHTS = {
  sortino30d: 0.34,
  sortino7d: 0.12,
  winRate: 0.14,
  lowDrawdown: 0.16, // rewards SMALL drawdown
  lowVol: 0.06, // rewards SMALL return vol
  volume: 0.1,
  smartMoney: 0.08,
} as const;

/** Squash a raw Sortino (~ -2..+4) into [0,1] via a logistic centred at 1.0. */
function sortinoTo01(s: number): number {
  return 1 / (1 + Math.exp(-(s - 1.0)));
}

export interface ModelOutput {
  rModel: number; // 0..10000
  confidence: number; // 0..10000
  parts: Record<string, number>; // per-feature contribution (audit trail)
}

export function runModel(f: PerfFeatures, market?: MarketContext): ModelOutput {
  const parts: Record<string, number> = {
    sortino30d: WEIGHTS.sortino30d * sortinoTo01(f.sortino30d),
    sortino7d: WEIGHTS.sortino7d * sortinoTo01(f.sortino7d),
    winRate: WEIGHTS.winRate * clamp01(f.winRate),
    lowDrawdown: WEIGHTS.lowDrawdown * clamp01(1 - f.maxDrawdown30d / 0.5),
    lowVol: WEIGHTS.lowVol * clamp01(1 - f.returnVol / 0.3),
    volume: WEIGHTS.volume * clamp01(f.volumePercentile),
    smartMoney: WEIGHTS.smartMoney * (f.isSmartMoney ? 1 : 0.35),
  };

  const score01 = Object.values(parts).reduce((a, b) => a + b, 0);

  // Confidence: more trades + more venue diversity → tighter prediction.
  // Thin history → low confidence → downstream consumers gate it out.
  // 25 weekly interactions ⇒ an established agent (was 60; recalibrated to
  // hackathon-scale activity where ~25 draft/trade events is materially active).
  const historyConf = clamp01(f.tradeCount7d / 25);
  const breadthConf = clamp01(f.venueDiversity / 3);
  let confidence01 = 0.65 * historyConf + 0.35 * breadthConf;

  // Market-regime adjustment: stormy crypto vol → lower confidence across the
  // board (Pyth ETH+BTC 7d realized vol → calm/normal/stormy → multiplier).
  if (market) confidence01 *= confidenceMultiplier(market);

  return {rModel: toBps(score01), confidence: toBps(confidence01), parts};
}

/**
 * CCRI — Crowd-Calibrated Reputation Inference. Shared types.
 * See contracts/docs/CCRI.md §3-§5 (spec is local-only).
 */

/** Raw per-agent performance features (off-chain / from indexer agent row). */
export interface PerfFeatures {
  agentId: bigint;
  sortino7d: number; // raw Sortino, 7-day window
  sortino30d: number; // raw Sortino, 30-day window
  winRate: number; // 0..1
  maxDrawdown30d: number; // 0..1 (fraction)
  returnVol: number; // stdev of returns
  tradeCount7d: number;
  avgHoldTimeSec: number;
  venueDiversity: number; // # distinct Mantle venues touched
  volumePercentile: number; // 0..1
  isSmartMoney: boolean; // Nansen label
}

/** Crowd-prior features derived on-chain by the indexer (crowd_signal table). */
export interface CrowdFeatures {
  agentId: bigint;
  draftCount: number; // squads picking the agent this cycle
  captainCount: number; // squads captaining the agent this cycle
  stakeDepthWei: bigint; // mETH staked on the agent (pool snapshot)
}

/** Final reputation payload — mirrors AgentReputationOracle.Reputation. */
export interface Reputation {
  score: number; // 0..10000 forward risk-adjusted, re-normalized per cycle
  confidence: number; // 0..10000 (= 0-100.00%)
  tier: number; // 1..5
  asOf: bigint; // unix seconds
  horizon: bigint; // seconds (e.g. 604800 = 7d)
}

/** A computed reputation bundled with the agent id + bookkeeping. */
export interface ScoredAgent {
  agentId: bigint;
  rep: Reputation;
  rModel: number; // 0..10000 model-only
  rCrowd: number; // 0..10000 crowd-only
  w: number; // blend weight applied to the model term
}

export const HORIZON_7D = 604_800n; // seconds

/** Tier cutoffs on the normalized score (descending). */
export function tierForScore(score: number): number {
  if (score >= 9_000) return 1; // T1 Legendary (~top 1%)
  if (score >= 7_500) return 2; // T2 Elite
  if (score >= 5_000) return 3; // T3 Pro
  if (score >= 2_500) return 4; // T4 Rising
  return 5; // T5 Rookie
}

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
export const toBps = (x01: number): number => Math.round(clamp01(x01) * 10_000);

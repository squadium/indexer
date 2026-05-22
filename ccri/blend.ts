/**
 * CCRI blend + recalibration (spec §3.4) — the named primitive.
 *
 *   R_final = w · R_model + (1 − w) · R_crowd
 *   w       = sigmoid( a − b · crowdDepth )      // deeper crowd → trust crowd
 *
 * `a` (the model/crowd skill bias) is recalibrated every cycle from realized
 * outcomes with a Brier-style update: whichever signal predicted last cycle's
 * winners better earns more weight next cycle. This closed loop is what makes
 * it *Crowd-Calibrated* Reputation Inference.
 *
 * Calibration state persists to a small JSON file (no DB dependency — the
 * service is stateless otherwise). Documented choice for hackathon scope.
 */
import {existsSync, readFileSync, writeFileSync} from "node:fs";

import {clamp01} from "./types";

const CALIB_PATH = process.env.CCRI_CALIB_PATH ?? "./ccri/.calibration.json";
const B = 2.2; // crowd-depth slope

export interface Calibration {
  a: number; // skill bias; >0 favours model, <0 favours crowd
  cycles: number;
  lastModelBrier: number;
  lastCrowdBrier: number;
}

const DEFAULT_CALIB: Calibration = {a: 0.4, cycles: 0, lastModelBrier: 0.25, lastCrowdBrier: 0.25};

export function loadCalibration(): Calibration {
  if (!existsSync(CALIB_PATH)) return {...DEFAULT_CALIB};
  try {
    return {...DEFAULT_CALIB, ...JSON.parse(readFileSync(CALIB_PATH, "utf8"))};
  } catch {
    return {...DEFAULT_CALIB};
  }
}

export function saveCalibration(c: Calibration): void {
  writeFileSync(CALIB_PATH, JSON.stringify(c, null, 2));
}

const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));

export interface BlendOutput {
  score: number; // 0..10000
  confidence: number; // 0..10000
  w: number; // weight on the model term
}

/**
 * Blend one agent's model + crowd scores.
 * @param modelConf   model's own confidence (0..10000)
 * @param crowdDepth  crowd participation/confidence for this agent (0..1)
 */
export function blend(
  rModel: number,
  modelConf: number,
  rCrowd: number,
  crowdDepth: number,
  calib: Calibration,
): BlendOutput {
  const w = clamp01(sigmoid(calib.a - B * crowdDepth));
  const score = Math.round(w * rModel + (1 - w) * rCrowd);

  // Final confidence (spec §3.1 — honest uncertainty). Three independent
  // signals tighten the posterior:
  //   base       — model's own confidence, lifted by model↔crowd agreement
  //   crowdBonus — independent corroboration: a DEEP crowd that AGREES adds
  //                confidence; a thin or disagreeing crowd adds ~nothing.
  // This is what makes drafting *raise* an agent's confidence — the
  // calibration flywheel. Cold-start (no crowd) → base only → stays low.
  const agreement = 1 - Math.abs(rModel - rCrowd) / 10_000; // 0..1
  const base = (modelConf / 10_000) * (0.6 + 0.4 * agreement);
  const crowdBonus = 0.35 * crowdDepth * agreement;
  const confidence = Math.round(clamp01(base + crowdBonus) * 10_000);

  return {score, confidence, w};
}

/**
 * Brier-style recalibration from last cycle's realized winners.
 * @param realized  agentId → 1 if it actually performed top-tier, else 0
 * @param modelPred agentId → model score 0..10000
 * @param crowdPred agentId → crowd score 0..10000
 */
export function recalibrate(
  calib: Calibration,
  realized: Map<bigint, number>,
  modelPred: Map<bigint, number>,
  crowdPred: Map<bigint, number>,
): Calibration {
  if (realized.size === 0) return calib;

  let mB = 0;
  let cB = 0;
  let n = 0;
  for (const [id, y] of realized) {
    const mp = (modelPred.get(id) ?? 5_000) / 10_000;
    const cp = (crowdPred.get(id) ?? 5_000) / 10_000;
    mB += (mp - y) ** 2;
    cB += (cp - y) ** 2;
    n++;
  }
  mB /= n;
  cB /= n; // mean Brier (lower = better)

  // Nudge `a` toward whichever predictor had the lower Brier. Bounded step.
  const delta = clamp((cB - mB) * 1.5, -0.5, 0.5);
  return {
    a: clamp(calib.a + delta, -3, 3),
    cycles: calib.cycles + 1,
    lastModelBrier: mB,
    lastCrowdBrier: cB,
  };
}

const clamp = (x: number, lo: number, hi: number): number => (x < lo ? lo : x > hi ? hi : x);

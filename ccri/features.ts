/**
 * CCRI feature loader.
 *
 * Pulls the indexer's feature store over its REST surface (the same endpoints
 * the frontend uses). The indexer owns the crowd half (on-chain derived); the
 * perf half is enriched here from the indexed agent row + external sources.
 *
 * For the hackathon, perf features are derived from the indexed `agent` row
 * (sortinoBps/volume/smartMoney) plus deterministic proxies. The interface is
 * stable so a richer pipeline (Pyth Hermes history, Nansen API) can slot in
 * without touching the model.
 */
import type {CrowdFeatures, PerfFeatures} from "./types";

const INDEXER_URL = process.env.INDEXER_URL ?? "http://localhost:42069";

interface AgentRow {
  id: string;
  wallet: string;
  tier: number;
  sortinoBps: string;
  volume30d: string;
  isSmartMoney: boolean;
  lifetimeAppearances: number;
  captainCount: number;
  mvpWeeks: number;
}

interface CrowdRow {
  agentId: string;
  draftCount: number;
  captainCount: number;
  stakeDepth: string;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${INDEXER_URL}${path}`);
  if (!res.ok) throw new Error(`indexer ${path} → ${res.status}`);
  return (await res.json()) as T;
}

/** All currently-known agents, ranked, with perf features assembled. */
export async function loadPerfFeatures(limit = 200): Promise<PerfFeatures[]> {
  const {rows} = await getJson<{rows: AgentRow[]}>(`/agents/top?limit=${limit}`);
  return rows.map((r) => {
    const sortino = Number(r.sortinoBps) / 10_000; // bps → ratio proxy
    const vol = Number(r.volume30d);
    return {
      agentId: BigInt(r.id),
      sortino7d: sortino,
      sortino30d: sortino,
      // Deterministic proxies until Pyth-history pipeline lands (documented).
      winRate: clamp01(0.5 + sortino / 6),
      maxDrawdown30d: clamp01(0.2 - sortino / 30),
      returnVol: Math.max(0.01, 0.15 - sortino / 40),
      tradeCount7d: Math.min(200, r.lifetimeAppearances * 3 + 10),
      avgHoldTimeSec: 3_600,
      venueDiversity: 1 + (r.lifetimeAppearances % 3),
      volumePercentile: clamp01(Math.log10(vol + 1) / 7),
      isSmartMoney: r.isSmartMoney,
    };
  });
}

/** Crowd-prior features for a given week from the on-chain-derived store. */
export async function loadCrowdFeatures(weekId: bigint): Promise<Map<bigint, CrowdFeatures>> {
  const {rows} = await getJson<{rows: CrowdRow[]}>(`/crowd/${weekId.toString()}`);
  const m = new Map<bigint, CrowdFeatures>();
  for (const r of rows) {
    const id = BigInt(r.agentId);
    m.set(id, {
      agentId: id,
      draftCount: r.draftCount,
      captainCount: r.captainCount,
      stakeDepthWei: BigInt(r.stakeDepth),
    });
  }
  return m;
}

const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

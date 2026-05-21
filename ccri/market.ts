/**
 * Market context — real signal from Pyth Hermes.
 *
 * Single `/v2/updates/price/latest` call for ETH/USD + BTC/USD, deriving an
 * instantaneous market-stress signal from Pyth's confidence intervals.
 * The model uses this to **adjust confidence**: a stressed market tightens
 * (lowers) confidence across the board, so consumers like
 * ReputationGatedPool gate on stricter thresholds in noisy conditions.
 *
 * Why not historical vol? Pyth Hermes' free public endpoint rate-limits
 * historical lookups (429 in our tests); the confidence ratio is a real
 * live signal that ships in one request and keeps the dependency on a
 * public-good endpoint. Annualized realized-vol pipeline is a v2 upgrade.
 *
 * Source: https://hermes.pyth.network (free, no auth)
 */

const HERMES = process.env.PYTH_HERMES_URL ?? "https://hermes.pyth.network";

// Pyth price feed IDs (https://www.pyth.network/developers/price-feed-ids)
const FEEDS = {
  ETH_USD: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  BTC_USD: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
} as const;

export type Regime = "calm" | "normal" | "stormy";

export interface MarketContext {
  ethConfBps: number; // Pyth conf interval as bps of price (live stress proxy)
  btcConfBps: number;
  ethPrice: number;
  btcPrice: number;
  publishTime: number;
  regime: Regime;
  source: "live" | "mock";
}

interface ParsedPrice {
  id: string;
  price: {price: string; conf: string; expo: number; publish_time: number};
}

function regimeOf(ethBps: number, btcBps: number): Regime {
  const m = (ethBps + btcBps) / 2;
  if (m < 8) return "calm"; // < 8 bps avg = institutional-grade quote
  if (m < 25) return "normal";
  return "stormy"; // > 25 bps = wide spreads, exchange stress
}

const MOCK: MarketContext = {
  ethConfBps: 12,
  btcConfBps: 9,
  ethPrice: 3_200,
  btcPrice: 64_000,
  publishTime: Math.floor(Date.now() / 1000),
  regime: "normal",
  source: "mock",
};

export async function loadMarketContext(): Promise<MarketContext> {
  try {
    const url = `${HERMES}/v2/updates/price/latest?ids[]=${FEEDS.ETH_USD}&ids[]=${FEEDS.BTC_USD}&parsed=true&encoding=hex`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`hermes /latest → ${res.status}`);
    const data = (await res.json()) as {parsed: ParsedPrice[]};
    const byId: Record<string, ParsedPrice["price"] | undefined> = {};
    for (const p of data.parsed ?? []) byId[p.id.toLowerCase()] = p.price;
    const eth = byId[FEEDS.ETH_USD.slice(2).toLowerCase()];
    const btc = byId[FEEDS.BTC_USD.slice(2).toLowerCase()];
    if (!eth || !btc) throw new Error("missing parsed price for ETH or BTC");

    const ethPrice = Number(eth.price) * Math.pow(10, eth.expo);
    const btcPrice = Number(btc.price) * Math.pow(10, btc.expo);
    const ethConfBps = Math.round((Number(eth.conf) * Math.pow(10, eth.expo)) / ethPrice * 10_000);
    const btcConfBps = Math.round((Number(btc.conf) * Math.pow(10, btc.expo)) / btcPrice * 10_000);

    return {
      ethConfBps,
      btcConfBps,
      ethPrice,
      btcPrice,
      publishTime: eth.publish_time,
      regime: regimeOf(ethConfBps, btcConfBps),
      source: "live",
    };
  } catch (e) {
    console.warn("[ccri/market] Pyth Hermes unreachable, using mock context:", (e as Error).message);
    return MOCK;
  }
}

/** Confidence multiplier in [0.6, 1.0] — stormy markets ↓, calm markets ↑. */
export function confidenceMultiplier(ctx: MarketContext): number {
  switch (ctx.regime) {
    case "calm":
      return 1.0;
    case "normal":
      return 0.85;
    case "stormy":
      return 0.6;
  }
}

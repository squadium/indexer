/**
 * Market context — real signal from Pyth Hermes.
 *
 * We pull historical ETH/USD + BTC/USD prices and compute realized
 * volatility + a coarse regime indicator. The model uses this to
 * **adjust confidence**: a high-volatility regime tightens (lowers)
 * confidence across the board, so consumers like ReputationGatedPool
 * gate on stricter thresholds when markets are noisy.
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
  ethVol7d: number; // annualized stdev of daily log-returns
  btcVol7d: number;
  regime: Regime;
  source: "live" | "mock";
}

interface ParsedPrice {
  id: string;
  price: {price: string; expo: number; publish_time: number};
}

/** Daily samples for the last `days` days (00:00 UTC anchors). */
async function fetchDailyPrices(feedId: string, days: number): Promise<number[]> {
  const now = Math.floor(Date.now() / 1000);
  const day = 24 * 60 * 60;
  const prices: number[] = [];
  for (let i = days; i >= 0; i--) {
    const ts = now - i * day;
    const url = `${HERMES}/v2/updates/price/${ts}?ids[]=${feedId}&parsed=true&encoding=hex`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`hermes ${ts} → ${res.status}`);
    const data = (await res.json()) as {parsed: ParsedPrice[]};
    const p = data.parsed?.[0]?.price;
    if (!p) throw new Error(`no parsed price at ${ts}`);
    const raw = Number(p.price);
    const scaled = raw * Math.pow(10, p.expo); // expo is negative
    prices.push(scaled);
  }
  return prices;
}

/** Annualized realized vol from a series of daily prices. */
function realizedVol(prices: number[]): number {
  if (prices.length < 2) return 0;
  const rets: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    rets.push(Math.log(prices[i]! / prices[i - 1]!));
  }
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance = rets.reduce((a, r) => a + (r - mean) ** 2, 0) / rets.length;
  return Math.sqrt(variance * 365);
}

function regimeOf(ethVol: number, btcVol: number): Regime {
  const m = (ethVol + btcVol) / 2;
  if (m < 0.45) return "calm";
  if (m < 0.85) return "normal";
  return "stormy";
}

const MOCK: MarketContext = {ethVol7d: 0.62, btcVol7d: 0.48, regime: "normal", source: "mock"};

export async function loadMarketContext(): Promise<MarketContext> {
  try {
    const [eth, btc] = await Promise.all([fetchDailyPrices(FEEDS.ETH_USD, 7), fetchDailyPrices(FEEDS.BTC_USD, 7)]);
    const ethVol = realizedVol(eth);
    const btcVol = realizedVol(btc);
    return {ethVol7d: ethVol, btcVol7d: btcVol, regime: regimeOf(ethVol, btcVol), source: "live"};
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

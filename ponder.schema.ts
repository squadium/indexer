import {onchainTable, index, primaryKey} from "ponder";

// ────────────────────────────────────────────────────────────────────────
// Agent — one row per ERC-8004 registered agent
// ────────────────────────────────────────────────────────────────────────
export const agent = onchainTable(
  "agent",
  (t) => ({
    id: t.bigint().primaryKey(), // agentId
    wallet: t.hex().notNull(),
    erc8004TokenId: t.bigint().notNull(),
    tier: t.integer().notNull().default(5), // T1..T5 → 1..5
    sortinoBps: t.bigint().notNull().default(0n),
    volume30d: t.bigint().notNull().default(0n),
    isSmartMoney: t.boolean().notNull().default(false),
    lifetimeAppearances: t.integer().notNull().default(0),
    captainCount: t.integer().notNull().default(0),
    mvpWeeks: t.integer().notNull().default(0),
    lastUpdate: t.bigint().notNull(),
    createdAt: t.bigint().notNull(),
  }),
  (table) => ({
    tierIdx: index().on(table.tier),
    sortinoIdx: index().on(table.sortinoBps),
  }),
);

// ────────────────────────────────────────────────────────────────────────
// Squad — one row per (weekId, user)
// ────────────────────────────────────────────────────────────────────────
export const squad = onchainTable(
  "squad",
  (t) => ({
    id: t.text().primaryKey(), // `${weekId}-${user}`
    weekId: t.bigint().notNull(),
    user: t.hex().notNull(),
    agent0: t.bigint().notNull(),
    agent1: t.bigint().notNull(),
    agent2: t.bigint().notNull(),
    agent3: t.bigint().notNull(),
    agent4: t.bigint().notNull(),
    captainIdx: t.integer().notNull(),
    chip: t.integer().notNull(), // 0=None, 1=Wildcard, 2=TripleCaptain, 3=BenchBoost, 4=FreeHit
    locked: t.boolean().notNull().default(false),
    settled: t.boolean().notNull().default(false),
    finalScore: t.bigint().notNull().default(0n),
    draftedAt: t.bigint().notNull(),
  }),
  (table) => ({
    weekIdx: index().on(table.weekId),
    userIdx: index().on(table.user),
    scoreIdx: index().on(table.finalScore),
  }),
);

// ────────────────────────────────────────────────────────────────────────
// Stake — per (agentId, user) reputation stake position
// ────────────────────────────────────────────────────────────────────────
export const stake = onchainTable(
  "stake",
  (t) => ({
    id: t.text().primaryKey(), // `${agentId}-${user}`
    agentId: t.bigint().notNull(),
    user: t.hex().notNull(),
    shares: t.bigint().notNull().default(0n),
    updatedAt: t.bigint().notNull(),
  }),
  (table) => ({
    agentIdx: index().on(table.agentId),
    userIdx: index().on(table.user),
  }),
);

// ────────────────────────────────────────────────────────────────────────
// StakePool — per-agent pool aggregate (kept in sync with stake events)
// ────────────────────────────────────────────────────────────────────────
export const stakePool = onchainTable("stake_pool", (t) => ({
  id: t.bigint().primaryKey(), // agentId
  totalStaked: t.bigint().notNull().default(0n),
  totalShares: t.bigint().notNull().default(0n),
  slashCount: t.integer().notNull().default(0),
  lastSlashAt: t.bigint().notNull().default(0n),
}));

// ────────────────────────────────────────────────────────────────────────
// Grant — vesting tracker for RewardDistributor
// ────────────────────────────────────────────────────────────────────────
export const grant = onchainTable(
  "grant",
  (t) => ({
    id: t.text().primaryKey(), // `${user}-${grantIdx}`
    user: t.hex().notNull(),
    grantIdx: t.integer().notNull(),
    weekId: t.bigint().notNull(),
    totalAmount: t.bigint().notNull(),
    claimedAmount: t.bigint().notNull().default(0n),
    cliffEnd: t.bigint().notNull(),
    vestEnd: t.bigint().notNull(),
    createdAt: t.bigint().notNull(),
  }),
  (table) => ({
    userIdx: index().on(table.user),
    weekIdx: index().on(table.weekId),
  }),
);

// ────────────────────────────────────────────────────────────────────────
// SortinoUpdate — append-only history of on-chain Sortino pushes
// ────────────────────────────────────────────────────────────────────────
export const sortinoUpdate = onchainTable(
  "sortino_update",
  (t) => ({
    id: t.text().primaryKey(), // `${agentId}-${nonce}`
    agentId: t.bigint().notNull(),
    sortinoBps: t.bigint().notNull(),
    nonce: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
  }),
  (table) => ({
    agentIdx: index().on(table.agentId),
  }),
);

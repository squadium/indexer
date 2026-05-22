import {ponder} from "ponder:registry";
import {agent, crowdSignal, grant, reputation, sortinoUpdate, squad, stake, stakePool} from "ponder:schema";

// ════════════════════════════════════════════════════════════════════════
// AgentRegistry
// ════════════════════════════════════════════════════════════════════════

ponder.on("AgentRegistry:AgentRegistered", async ({event, context}) => {
  const {agentId, wallet, erc8004TokenId} = event.args;

  await context.db
    .insert(agent)
    .values({
      id: agentId,
      wallet,
      erc8004TokenId,
      tier: 5, // Rookie default
      sortinoBps: 0n,
      volume30d: 0n,
      isSmartMoney: false,
      lifetimeAppearances: 0,
      captainCount: 0,
      mvpWeeks: 0,
      lastUpdate: event.block.timestamp,
      createdAt: event.block.timestamp,
    })
    .onConflictDoNothing();
});

ponder.on("AgentRegistry:AgentUpdated", async ({event, context}) => {
  const {agentId, tier, sortinoBps, volume30d, isSmartMoney} = event.args;

  await context.db.update(agent, {id: agentId}).set({
    tier: Number(tier),
    sortinoBps,
    volume30d,
    isSmartMoney,
    lastUpdate: event.block.timestamp,
  });
});

// ════════════════════════════════════════════════════════════════════════
// Squadium — game core
// ════════════════════════════════════════════════════════════════════════

ponder.on("Squadium:SquadDrafted", async ({event, context}) => {
  const {user, weekId, agentIds, captainIdx, chip} = event.args;
  const id = `${weekId}-${user.toLowerCase()}`;

  await context.db
    .insert(squad)
    .values({
      id,
      weekId,
      user,
      agent0: agentIds[0]!,
      agent1: agentIds[1]!,
      agent2: agentIds[2]!,
      agent3: agentIds[3]!,
      agent4: agentIds[4]!,
      captainIdx: Number(captainIdx),
      chip: Number(chip),
      locked: false,
      settled: false,
      finalScore: 0n,
      draftedAt: event.block.timestamp,
    })
    .onConflictDoUpdate({
      agent0: agentIds[0]!,
      agent1: agentIds[1]!,
      agent2: agentIds[2]!,
      agent3: agentIds[3]!,
      agent4: agentIds[4]!,
      captainIdx: Number(captainIdx),
      chip: Number(chip),
      draftedAt: event.block.timestamp,
    });

  // Bump lifetime counters + accumulate weekly crowd signal per drafted agent
  for (let i = 0; i < 5; i++) {
    const drafted = agentIds[i]!;
    const isCaptain = i === Number(captainIdx);

    await context.db.update(agent, {id: drafted}).set((row) => ({
      lifetimeAppearances: row.lifetimeAppearances + 1,
      captainCount: row.captainCount + (isCaptain ? 1 : 0),
    }));

    // Snapshot current stake depth for the crowd-prior feature
    const pool = await context.db.find(stakePool, {id: drafted});
    const stakeDepth = pool?.totalStaked ?? 0n;

    const csId = `${weekId}-${drafted}`;
    await context.db
      .insert(crowdSignal)
      .values({
        id: csId,
        weekId,
        agentId: drafted,
        draftCount: 1,
        captainCount: isCaptain ? 1 : 0,
        stakeDepth,
        updatedAt: event.block.timestamp,
      })
      .onConflictDoUpdate((row) => ({
        draftCount: row.draftCount + 1,
        captainCount: row.captainCount + (isCaptain ? 1 : 0),
        stakeDepth,
        updatedAt: event.block.timestamp,
      }));
  }
});

ponder.on("Squadium:SquadScored", async ({event, context}) => {
  const {user, weekId, score} = event.args;
  const id = `${weekId}-${user.toLowerCase()}`;
  await context.db.update(squad, {id}).set({
    settled: true,
    finalScore: score,
  });
});

ponder.on("Squadium:WeekSettled", async ({event, context}) => {
  // No-op for now; placeholder for future leaderboard snapshot logic.
  // Could materialize a Leaderboard row per weekId.
  void event;
  void context;
});

// ════════════════════════════════════════════════════════════════════════
// LiquidReputation — staking
// ════════════════════════════════════════════════════════════════════════

ponder.on("LiquidReputation:Staked", async ({event, context}) => {
  const {agentId, user, amount, sharesMinted} = event.args;
  const id = `${agentId}-${user.toLowerCase()}`;

  await context.db
    .insert(stake)
    .values({
      id,
      agentId,
      user,
      shares: sharesMinted,
      updatedAt: event.block.timestamp,
    })
    .onConflictDoUpdate((row) => ({
      shares: row.shares + sharesMinted,
      updatedAt: event.block.timestamp,
    }));

  await context.db
    .insert(stakePool)
    .values({
      id: agentId,
      totalStaked: amount,
      totalShares: sharesMinted,
      slashCount: 0,
      lastSlashAt: 0n,
    })
    .onConflictDoUpdate((row) => ({
      totalStaked: row.totalStaked + amount,
      totalShares: row.totalShares + sharesMinted,
    }));
});

ponder.on("LiquidReputation:Unstaked", async ({event, context}) => {
  const {agentId, user, sharesBurned, amount} = event.args;
  const id = `${agentId}-${user.toLowerCase()}`;

  await context.db.update(stake, {id}).set((row) => ({
    shares: row.shares - sharesBurned,
    updatedAt: event.block.timestamp,
  }));

  await context.db.update(stakePool, {id: agentId}).set((row) => ({
    totalStaked: row.totalStaked - amount,
    totalShares: row.totalShares - sharesBurned,
  }));
});

ponder.on("LiquidReputation:Slashed", async ({event, context}) => {
  const {agentId, amount} = event.args;
  await context.db.update(stakePool, {id: agentId}).set((row) => ({
    totalStaked: row.totalStaked - amount,
    slashCount: row.slashCount + 1,
    lastSlashAt: event.block.timestamp,
  }));
});

// ════════════════════════════════════════════════════════════════════════
// RewardDistributor — vesting grants
// ════════════════════════════════════════════════════════════════════════

ponder.on("RewardDistributor:RewardDistributed", async ({event, context}) => {
  const {weekId, user, amount, grantIdx} = event.args;
  const id = `${user.toLowerCase()}-${grantIdx}`;
  const start = event.block.timestamp;

  await context.db.insert(grant).values({
    id,
    user,
    grantIdx: Number(grantIdx),
    weekId,
    totalAmount: amount,
    claimedAmount: 0n,
    cliffEnd: start + 7n * 24n * 60n * 60n, // 7d cliff
    vestEnd: start + 30n * 24n * 60n * 60n, // 30d total vest
    createdAt: start,
  });
});

ponder.on("RewardDistributor:RewardClaimed", async ({event, context}) => {
  const {user, grantIdx, amount} = event.args;
  const id = `${user.toLowerCase()}-${grantIdx}`;
  await context.db.update(grant, {id}).set((row) => ({
    claimedAmount: row.claimedAmount + amount,
  }));
});

// ════════════════════════════════════════════════════════════════════════
// AgentReputationOracle — CCRI reputation feed
// ════════════════════════════════════════════════════════════════════════

ponder.on("AgentReputationOracle:ReputationPushed", async ({event, context}) => {
  const {agentId, score, confidence, tier, asOf, horizon} = event.args;

  await context.db
    .insert(reputation)
    .values({
      id: agentId,
      score: Number(score),
      confidence: Number(confidence),
      tier: Number(tier),
      asOf,
      horizon,
      nonce: 0n, // filled from the paired SortinoPushed event below
      updatedAt: event.block.timestamp,
    })
    .onConflictDoUpdate({
      score: Number(score),
      confidence: Number(confidence),
      tier: Number(tier),
      asOf,
      horizon,
      updatedAt: event.block.timestamp,
    });

  // NOTE: do NOT overwrite agent.tier here. agent.tier is the REGISTRY
  // salary-cap tier (drives getAgentCost / draft cost) and is set by the
  // AgentRegistry events. The CCRI reputation tier is a *separate* concept
  // and lives only in the `reputation` table. Conflating them broke the
  // /draft cost display. Only bump the freshness marker.
  await context.db.update(agent, {id: agentId}).set({
    lastUpdate: event.block.timestamp,
  });
});

// Back-compat: AgentReputationOracle still emits SortinoPushed (score mirrored).
// Keep the append-only history table flowing without a pipeline rewrite.
ponder.on("AgentReputationOracle:SortinoPushed", async ({event, context}) => {
  const {agentId, sortinoBps, nonce} = event.args;

  await context.db.insert(sortinoUpdate).values({
    id: `${agentId}-${nonce}`,
    agentId,
    sortinoBps,
    nonce,
    timestamp: event.block.timestamp,
  });

  // Backfill the nonce on the latest reputation row
  await context.db.update(reputation, {id: agentId}).set({nonce});
});

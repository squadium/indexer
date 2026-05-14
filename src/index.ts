import {ponder} from "ponder:registry";
import {agent, grant, sortinoUpdate, squad, stake, stakePool} from "ponder:schema";

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

  // Bump lifetimeAppearances + captainCount for each drafted agent
  for (let i = 0; i < 5; i++) {
    const drafted = agentIds[i]!;
    const isCaptain = i === Number(captainIdx);
    await context.db.update(agent, {id: drafted}).set((row) => ({
      lifetimeAppearances: row.lifetimeAppearances + 1,
      captainCount: row.captainCount + (isCaptain ? 1 : 0),
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
// SortinoOracle — append-only history
// ════════════════════════════════════════════════════════════════════════

ponder.on("SortinoOracle:SortinoPushed", async ({event, context}) => {
  const {agentId, sortinoBps, nonce} = event.args;
  const id = `${agentId}-${nonce}`;

  await context.db.insert(sortinoUpdate).values({
    id,
    agentId,
    sortinoBps,
    nonce,
    timestamp: event.block.timestamp,
  });
});

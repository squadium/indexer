import {db} from "ponder:api";
import schema from "ponder:schema";
import {Hono} from "hono";
import {client, graphql, eq, desc} from "ponder";

const app = new Hono();

// Default Ponder routes — GraphQL + SQL-over-HTTP
app.use("/sql/*", client({db, schema}));
app.use("/", graphql({db, schema}));
app.use("/graphql", graphql({db, schema}));

// ────────────────────────────────────────────────────────────────────────
// Custom REST routes for the frontend
// ────────────────────────────────────────────────────────────────────────

/**
 * GET /leaderboard/:weekId — top 100 squads by finalScore for a given week.
 */
app.get("/leaderboard/:weekId", async (c) => {
  const weekId = BigInt(c.req.param("weekId"));
  const rows = await db
    .select()
    .from(schema.squad)
    .where(eq(schema.squad.weekId, weekId))
    .orderBy(desc(schema.squad.finalScore))
    .limit(100);
  return c.json({weekId: weekId.toString(), rows});
});

/**
 * GET /agents/top — top 50 agents by current Sortino.
 */
app.get("/agents/top", async (c) => {
  const limit = Math.min(Number(c.req.query("limit") ?? 50), 200);
  const rows = await db
    .select()
    .from(schema.agent)
    .orderBy(desc(schema.agent.sortinoBps))
    .limit(limit);
  return c.json({rows});
});

/**
 * GET /agent/:id — full profile for one agent (current state + pool).
 */
app.get("/agent/:id", async (c) => {
  const id = BigInt(c.req.param("id"));
  const [agentRow] = await db.select().from(schema.agent).where(eq(schema.agent.id, id)).limit(1);
  const [poolRow] = await db.select().from(schema.stakePool).where(eq(schema.stakePool.id, id)).limit(1);
  return c.json({agent: agentRow, stakePool: poolRow ?? null});
});

/**
 * GET /user/:address/squads — all squads drafted by a user (most recent first).
 */
app.get("/user/:address/squads", async (c) => {
  const user = c.req.param("address") as `0x${string}`;
  const rows = await db
    .select()
    .from(schema.squad)
    .where(eq(schema.squad.user, user))
    .orderBy(desc(schema.squad.weekId))
    .limit(100);
  return c.json({user, rows});
});

export default app;

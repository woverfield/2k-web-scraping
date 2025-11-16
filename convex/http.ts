/**
 * HTTP API Routes
 * REST API endpoints for NBA 2K player data
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono";
import { ActionCtx } from "./_generated/server";
import { api } from "./_generated/api";

const app: HonoWithConvex<ActionCtx> = new Hono();

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use("*", logger((...args) => console.log(...args)));

app.use("/api/*", cors({
  origin: process.env.CLIENT_ORIGIN || "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  credentials: true,
}));

// ============================================================================
// RESPONSE HELPERS
// ============================================================================

function successResponse<T>(data: T, meta?: any) {
  return {
    success: true,
    data,
    ...(meta && { meta: { ...meta, timestamp: new Date().toISOString() } }),
  };
}

function errorResponse(message: string, code = "UNKNOWN_ERROR", details?: any) {
  return {
    success: false,
    error: {
      message,
      code,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    },
  };
}

// ============================================================================
// ROUTES: PLAYERS
// ============================================================================

// GET /api/players - List players with filtering and pagination
app.get("/api/players",
  zValidator("query", z.object({
    teamType: z.enum(["curr", "class", "allt"]).optional(),
    team: z.string().optional(),
    minRating: z.coerce.number().min(0).max(99).optional(),
    maxRating: z.coerce.number().min(0).max(99).optional(),
    position: z.string().optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
  })),
  async (c) => {
    try {
      const params = c.req.valid("query");

      const result = await c.env.runQuery(api.players.getAllPlayers, {
        paginationOpts: params.cursor
          ? { numItems: params.limit, cursor: params.cursor }
          : { numItems: params.limit },
      });

      let filteredPage = result.page;

      if (params.teamType) {
        filteredPage = filteredPage.filter(p => p.teamType === params.teamType);
      }
      if (params.team) {
        filteredPage = filteredPage.filter(p => p.team === params.team);
      }
      if (params.minRating !== undefined) {
        filteredPage = filteredPage.filter(p => p.overall >= params.minRating!);
      }
      if (params.maxRating !== undefined) {
        filteredPage = filteredPage.filter(p => p.overall <= params.maxRating!);
      }
      if (params.position) {
        filteredPage = filteredPage.filter(p =>
          p.positions?.includes(params.position!)
        );
      }

      return c.json(successResponse(filteredPage, {
        pagination: {
          hasMore: !result.isDone,
          nextCursor: result.continueCursor,
          count: filteredPage.length,
          limit: params.limit,
        },
      }));
    } catch (error: any) {
      console.error("Error fetching players:", error);
      return c.json(errorResponse(
        "Failed to fetch players",
        "QUERY_ERROR",
        error.message
      ), 500);
    }
  }
);

// GET /api/players/search - Search players by name
// NOTE: This route MUST come before /api/players/:id to avoid matching "search" as an ID
app.get("/api/players/search",
  zValidator("query", z.object({
    q: z.string().min(1, "Search query is required"),
    teamType: z.enum(["curr", "class", "allt"]).optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
  })),
  async (c) => {
    try {
      const { q, teamType, limit } = c.req.valid("query");

      const results = await c.env.runQuery(api.players.searchPlayers, {
        query: q,
        teamType,
      });

      const limitedResults = results.slice(0, limit);

      return c.json(successResponse(limitedResults, {
        count: limitedResults.length,
        total: results.length,
        truncated: results.length > limit,
      }));
    } catch (error: any) {
      console.error("Search error:", error);
      return c.json(errorResponse(
        "Search failed",
        "SEARCH_ERROR",
        error.message
      ), 500);
    }
  }
);

// GET /api/players/:id - Get player by ID
app.get("/api/players/:id", async (c) => {
  try {
    const playerId = c.req.param("id");

    if (!playerId.startsWith("j") || playerId.length < 10) {
      return c.json(errorResponse(
        "Invalid player ID format",
        "INVALID_ID"
      ), 400);
    }

    const player = await c.env.runQuery(api.players.getPlayerById, {
      id: playerId as any,
    });

    if (!player) {
      return c.json(errorResponse(
        "Player not found",
        "NOT_FOUND",
        { playerId }
      ), 404);
    }

    return c.json(successResponse(player));
  } catch (error: any) {
    console.error("Error fetching player:", error);
    return c.json(errorResponse(
      "Failed to fetch player",
      "QUERY_ERROR",
      error.message
    ), 500);
  }
});

// ============================================================================
// ROUTES: TEAMS
// ============================================================================

// GET /api/teams - List all teams
app.get("/api/teams",
  zValidator("query", z.object({
    teamType: z.enum(["curr", "class", "allt"]).optional(),
  })),
  async (c) => {
    try {
      const { teamType } = c.req.valid("query");

      const teams = await c.env.runQuery(api.players.getTeams, {
        teamType,
      });

      return c.json(successResponse(teams, {
        count: teams.length,
      }));
    } catch (error: any) {
      console.error("Error fetching teams:", error);
      return c.json(errorResponse(
        "Failed to fetch teams",
        "QUERY_ERROR",
        error.message
      ), 500);
    }
  }
);

// GET /api/teams/:teamName/roster - Get team roster
app.get("/api/teams/:teamName/roster",
  zValidator("query", z.object({
    teamType: z.enum(["curr", "class", "allt"]).optional(),
  })),
  async (c) => {
    try {
      const teamName = decodeURIComponent(c.req.param("teamName"));
      const { teamType } = c.req.valid("query");

      const roster = await c.env.runQuery(api.players.getPlayersByTeam, {
        team: teamName,
        teamType,
      });

      if (roster.length === 0) {
        return c.json(errorResponse(
          `No players found for team: ${teamName}`,
          "NOT_FOUND",
          { teamName, teamType }
        ), 404);
      }

      return c.json(successResponse(roster, {
        team: teamName,
        teamType: teamType || "all",
        count: roster.length,
      }));
    } catch (error: any) {
      console.error("Error fetching roster:", error);
      return c.json(errorResponse(
        "Failed to fetch roster",
        "QUERY_ERROR",
        error.message
      ), 500);
    }
  }
);

// ============================================================================
// ROUTES: STATISTICS
// ============================================================================

// GET /api/stats - Get database statistics
app.get("/api/stats", async (c) => {
  try {
    const stats = await c.env.runQuery(api.players.getStats);
    return c.json(successResponse(stats));
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return c.json(errorResponse(
      "Failed to fetch statistics",
      "QUERY_ERROR",
      error.message
    ), 500);
  }
});

// ============================================================================
// ERROR HANDLERS
// ============================================================================

app.notFound((c) => {
  return c.json(errorResponse(
    "Endpoint not found",
    "NOT_FOUND",
    { path: c.req.path }
  ), 404);
});

app.onError((err, c) => {
  console.error("HTTP Error:", err);
  return c.json(errorResponse(
    "Internal server error",
    "INTERNAL_ERROR",
    process.env.CONVEX_CLOUD_URL?.includes("dev") ? err.message : undefined
  ), 500);
});

// ============================================================================
// EXPORT
// ============================================================================

export default new HttpRouterWithHono(app);

/**
 * Convex Database Schema for NBA 2K API
 * Defines tables for players, API keys, and request logs
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /**
   * Players table - stores comprehensive NBA 2K player data
   */
  players: defineTable({
    // Basic info
    name: v.string(),
    slug: v.string(), // URL-friendly name
    playerUrl: v.optional(v.string()),
    team: v.string(),
    teamType: v.union(v.literal("curr"), v.literal("class"), v.literal("allt")),
    overall: v.number(),
    positions: v.optional(v.array(v.string())), // Array for filtering: ["PG", "SG"]

    // Physical attributes
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    wingspan: v.optional(v.string()),

    // Build/archetype
    build: v.optional(v.string()),

    // Images
    playerImage: v.optional(v.string()),
    teamImg: v.optional(v.string()),

    // Detailed attributes (flat structure with all possible attributes)
    attributes: v.optional(v.any()),

    // Badges
    badges: v.optional(
      v.object({
        total: v.optional(v.number()),
        legendary: v.optional(v.number()),
        hallOfFame: v.optional(v.number()),
        gold: v.optional(v.number()),
        silver: v.optional(v.number()),
        bronze: v.optional(v.number()),
        list: v.optional(v.array(
          v.object({
            name: v.string(),
            tier: v.string(),
            category: v.optional(v.string()),
          })
        )),
      })
    ),

    // Timestamps
    lastUpdated: v.string(), // ISO timestamp
    createdAt: v.string(), // ISO timestamp
  })
    .index("by_name", ["name"])
    .index("by_team", ["team"])
    .index("by_slug", ["slug"])
    .index("by_teamType", ["teamType"])
    .index("by_overall", ["overall"])
    .index("by_team_and_type", ["team", "teamType"]),

  /**
   * API Keys table - stores user API keys for authentication
   */
  apiKeys: defineTable({
    key: v.string(), // Generated UUID
    email: v.string(),
    name: v.string(), // Developer/project name
    userId: v.optional(v.string()), // For future user accounts

    // Rate limiting
    requestCount: v.number(), // Total requests made
    lastRequest: v.optional(v.string()), // ISO timestamp
    rateLimit: v.number(), // Requests per hour

    // Status
    isActive: v.boolean(),

    // Timestamps
    createdAt: v.string(), // ISO timestamp
  })
    .index("by_key", ["key"])
    .index("by_email", ["email"])
    .index("by_isActive", ["isActive"]),

  /**
   * Request Logs table - stores API usage analytics
   */
  requestLogs: defineTable({
    apiKeyId: v.id("apiKeys"), // Reference to API key
    endpoint: v.string(), // Requested endpoint
    method: v.string(), // HTTP method (GET, POST, etc.)
    statusCode: v.number(), // Response status code
    responseTime: v.number(), // Response time in ms
    timestamp: v.string(), // ISO timestamp

    // Optional request details
    queryParams: v.optional(v.string()), // Stringified query params
    ipAddress: v.optional(v.string()),
  })
    .index("by_apiKeyId", ["apiKeyId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_endpoint", ["endpoint"]),
});

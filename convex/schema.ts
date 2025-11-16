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
    position: v.optional(v.string()),

    // Physical attributes
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    wingspan: v.optional(v.string()),

    // Build/archetype
    build: v.optional(v.string()),

    // Images
    playerImage: v.optional(v.string()),
    teamImg: v.optional(v.string()),

    // Detailed attributes
    attributes: v.optional(
      v.object({
        shooting: v.optional(
          v.object({
            closeShot: v.optional(v.number()),
            midRange: v.optional(v.number()),
            threePoint: v.optional(v.number()),
            freeThrow: v.optional(v.number()),
            shotIQ: v.optional(v.number()),
            offensiveConsistency: v.optional(v.number()),
          })
        ),
        finishing: v.optional(
          v.object({
            drivingLayup: v.optional(v.number()),
            drivingDunk: v.optional(v.number()),
            standingDunk: v.optional(v.number()),
            postHook: v.optional(v.number()),
            postFade: v.optional(v.number()),
            postControl: v.optional(v.number()),
            drawFoul: v.optional(v.number()),
            hands: v.optional(v.number()),
          })
        ),
        playmaking: v.optional(
          v.object({
            passAccuracy: v.optional(v.number()),
            ballHandle: v.optional(v.number()),
            passIQ: v.optional(v.number()),
            passVision: v.optional(v.number()),
            speedWithBall: v.optional(v.number()),
          })
        ),
        defense: v.optional(
          v.object({
            interiorDefense: v.optional(v.number()),
            perimeterDefense: v.optional(v.number()),
            steal: v.optional(v.number()),
            block: v.optional(v.number()),
            helpDefenseIQ: v.optional(v.number()),
            passPerception: v.optional(v.number()),
            defensiveConsistency: v.optional(v.number()),
          })
        ),
        athleticism: v.optional(
          v.object({
            speed: v.optional(v.number()),
            agility: v.optional(v.number()),
            strength: v.optional(v.number()),
            vertical: v.optional(v.number()),
            stamina: v.optional(v.number()),
            hustle: v.optional(v.number()),
            overallDurability: v.optional(v.number()),
          })
        ),
        rebounding: v.optional(
          v.object({
            offensiveRebound: v.optional(v.number()),
            defensiveRebound: v.optional(v.number()),
          })
        ),
        special: v.optional(
          v.object({
            intangibles: v.optional(v.number()),
            potential: v.optional(v.number()),
          })
        ),
      })
    ),

    // Badges
    badges: v.optional(
      v.object({
        total: v.number(),
        hallOfFame: v.number(),
        gold: v.number(),
        silver: v.number(),
        bronze: v.number(),
        list: v.array(
          v.object({
            name: v.string(),
            tier: v.string(),
            category: v.string(),
          })
        ),
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

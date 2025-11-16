/**
 * API Key Management
 * Mutations and queries for API key operations
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Generate a unique API key with 2k_ prefix
 */
function generateApiKey(): string {
  // Generate random string (32 chars)
  const randomPart = Array.from({ length: 32 }, () =>
    Math.random().toString(36).charAt(2)
  ).join("");

  return `2k_${randomPart}`;
}

/**
 * Create a new API key
 */
export const createApiKey = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    purpose: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error("Invalid email format");
    }

    // Generate unique API key
    const key = generateApiKey();

    // Create API key record
    const apiKeyId = await ctx.db.insert("apiKeys", {
      key,
      email: args.email,
      name: args.name,
      requestCount: 0,
      rateLimit: 100, // Default: 100 requests per hour
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    return {
      apiKey: key,
      id: apiKeyId,
      rateLimit: 100,
    };
  },
});

/**
 * Validate an API key
 */
export const validateApiKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const apiKey = await ctx.db
      .query("apiKeys")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (!apiKey) {
      return { valid: false, reason: "API key not found" };
    }

    if (!apiKey.isActive) {
      return { valid: false, reason: "API key is inactive" };
    }

    return { valid: true, apiKey };
  },
});

/**
 * Check if API key is under rate limit
 */
export const checkRateLimit = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const apiKey = await ctx.db
      .query("apiKeys")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (!apiKey) {
      return { allowed: false, reason: "API key not found" };
    }

    // Get request count in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const recentRequests = await ctx.db
      .query("requestLogs")
      .withIndex("by_apiKeyId", (q) => q.eq("apiKeyId", apiKey._id))
      .filter((q) => q.gte(q.field("timestamp"), oneHourAgo))
      .collect();

    const requestsInLastHour = recentRequests.length;
    const remaining = Math.max(0, apiKey.rateLimit - requestsInLastHour);

    if (requestsInLastHour >= apiKey.rateLimit) {
      // Calculate reset time (next hour boundary)
      const now = new Date();
      const resetTime = new Date(now);
      resetTime.setHours(now.getHours() + 1, 0, 0, 0);

      return {
        allowed: false,
        reason: "Rate limit exceeded",
        limit: apiKey.rateLimit,
        remaining: 0,
        reset: resetTime.toISOString(),
      };
    }

    // Calculate reset time (next hour boundary)
    const now = new Date();
    const resetTime = new Date(now);
    resetTime.setHours(now.getHours() + 1, 0, 0, 0);

    return {
      allowed: true,
      apiKeyId: apiKey._id,
      limit: apiKey.rateLimit,
      remaining,
      reset: resetTime.toISOString(),
    };
  },
});

/**
 * Log an API request
 */
export const logRequest = mutation({
  args: {
    apiKeyId: v.id("apiKeys"),
    endpoint: v.string(),
    method: v.string(),
    statusCode: v.number(),
    responseTime: v.number(),
    queryParams: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Create request log
    await ctx.db.insert("requestLogs", {
      apiKeyId: args.apiKeyId,
      endpoint: args.endpoint,
      method: args.method,
      statusCode: args.statusCode,
      responseTime: args.responseTime,
      timestamp: new Date().toISOString(),
      queryParams: args.queryParams,
    });

    // Update API key's last request time and total count
    const apiKey = await ctx.db.get(args.apiKeyId);
    if (apiKey) {
      await ctx.db.patch(args.apiKeyId, {
        lastRequest: new Date().toISOString(),
        requestCount: apiKey.requestCount + 1,
      });
    }
  },
});

/**
 * Deactivate an API key
 */
export const deactivateApiKey = mutation({
  args: { keyId: v.id("apiKeys") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.keyId, {
      isActive: false,
    });

    return { success: true };
  },
});

/**
 * Get API key statistics for dashboard
 */
export const getApiKeyStats = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const apiKey = await ctx.db
      .query("apiKeys")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (!apiKey) {
      throw new Error("API key not found");
    }

    // Get request count in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const recentRequests = await ctx.db
      .query("requestLogs")
      .withIndex("by_apiKeyId", (q) => q.eq("apiKeyId", apiKey._id))
      .filter((q) => q.gte(q.field("timestamp"), oneHourAgo))
      .collect();

    const requestsThisHour = recentRequests.length;
    const remaining = Math.max(0, apiKey.rateLimit - requestsThisHour);

    // Get last 10 requests
    const allRequests = await ctx.db
      .query("requestLogs")
      .withIndex("by_apiKeyId", (q) => q.eq("apiKeyId", apiKey._id))
      .order("desc")
      .take(10);

    // Calculate reset time (next hour boundary)
    const now = new Date();
    const resetTime = new Date(now);
    resetTime.setHours(now.getHours() + 1, 0, 0, 0);

    return {
      requestCount: requestsThisHour,
      totalRequests: apiKey.requestCount,
      lastRequest: apiKey.lastRequest,
      rateLimit: apiKey.rateLimit,
      requestsRemaining: remaining,
      resetAt: resetTime.toISOString(),
      recentRequests: allRequests.map((log) => ({
        endpoint: log.endpoint,
        method: log.method,
        statusCode: log.statusCode,
        responseTime: log.responseTime,
        timestamp: log.timestamp,
      })),
    };
  },
});

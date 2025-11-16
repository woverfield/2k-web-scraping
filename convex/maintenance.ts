/**
 * Maintenance Functions
 * Internal functions for cleanup and housekeeping
 */

import { internalMutation } from "./_generated/server";

/**
 * Clean up request logs older than 30 days
 */
export const cleanupOldLogs = internalMutation({
  handler: async (ctx) => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Find old logs
    const oldLogs = await ctx.db
      .query("requestLogs")
      .withIndex("by_timestamp")
      .filter((q) => q.lt(q.field("timestamp"), thirtyDaysAgo))
      .collect();

    // Delete them
    for (const log of oldLogs) {
      await ctx.db.delete(log._id);
    }

    console.log(`Cleaned up ${oldLogs.length} old request logs`);

    return { deleted: oldLogs.length };
  },
});

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import { connectCache } from "../config/cache.js";
import { cache } from "../config/cache.js";
import { CACHE_KEYS } from "../config/constants.js";
import Investment from "../models/Investment.js";
import Ledger from "../models/Ledger.js";
import logger from "../config/logger.js";

const BATCH_SIZE = 500;
const INTERVAL_MS = 5 * 60 * 1000;

const runCycle = async () => {
  logger.info("[WORKER] Growth cycle started");
  const start = Date.now();
  let lastId = null;
  let processed = 0;
  const affectedUsers = new Set();

  while (true) {
    const filter = { status: "active" };
    if (lastId) filter._id = { $gt: lastId };

    const batch = await Investment.find(filter).sort({ _id: 1 }).limit(BATCH_SIZE).lean({ virtuals: true });
    if (!batch.length) break;

    for (const inv of batch) {
      try {
        const lastGrowth = await Ledger.findOne({ investmentId: inv._id, type: "GROWTH" }).sort({ createdAt: -1 });
        const hoursSince = lastGrowth ? (Date.now() - new Date(lastGrowth.createdAt).getTime()) / 3600000 : Infinity;
        if (hoursSince < 1) continue;

        const growth = inv.currentValue - inv.amount;
        if (growth <= 0) continue;

        await Ledger.create({ type: "GROWTH", userId: inv.userId, investmentId: inv._id, projectId: inv.projectId, amount: parseFloat(growth.toFixed(2)), meta: { computedAt: new Date().toISOString() } });
        affectedUsers.add(inv.userId.toString());
        processed++;
      } catch (err) {
        logger.error("[WORKER] Error processing investment", { id: inv._id, error: err.message });
      }
    }

    lastId = batch[batch.length - 1]._id;
    if (batch.length < BATCH_SIZE) break;
  }

  for (const uid of affectedUsers) await cache.del(CACHE_KEYS.PORTFOLIO(uid));

  logger.info("[WORKER] Cycle complete", { durationMs: Date.now() - start, processed, usersAffected: affectedUsers.size });
};

const start = async () => {
  await connectDB();
  await connectCache();
  logger.info("[WORKER] Background growth worker running (interval: 5min)");
  await runCycle();
  setInterval(runCycle, INTERVAL_MS);
};

start().catch((err) => { logger.error("[WORKER] Fatal error", { error: err.message }); process.exit(1); });

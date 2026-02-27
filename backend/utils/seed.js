import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";
import Project from "../models/Project.js";
import Investment from "../models/Investment.js";
import Ledger from "../models/Ledger.js";
import AuditLog from "../models/AuditLog.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("[SEED] Connected to MongoDB");

  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Investment.deleteMany({}),
    Ledger.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);
  console.log("[SEED] Collections cleared");

  const admin = await User.create({ name: "Admin User", email: "admin@solarinvest.com", password: "Admin@123", role: "admin" });
  const investor = await User.create({ name: "Demo Investor", email: "investor@solarinvest.com", password: "Demo@123" });

  const projects = await Project.insertMany([
    { name: "Rajasthan Solar Park", description: "500-acre photovoltaic installation in the Thar Desert using bifacial panels for 15% higher yield.", location: "Jodhpur, Rajasthan", capacity: 150000, roi: 14.5, fundingGoal: 10000000, fundedAmount: 6500000 },
    { name: "Gujarat Rooftop Initiative", description: "2000 commercial rooftop installations across Ahmedabad. Fully funded and operational.", location: "Ahmedabad, Gujarat", capacity: 80000, roi: 12.8, fundingGoal: 5000000, fundedAmount: 5000000, status: "funded" },
    { name: "Maharashtra Wind-Solar Hybrid", description: "Combined wind and solar leveraging seasonal complementarity for stable returns.", location: "Pune, Maharashtra", capacity: 200000, roi: 15.2, fundingGoal: 15000000, fundedAmount: 3000000 },
    { name: "Tamil Nadu Coastal Solar", description: "Salt-resistant bifacial panels along the Coromandel coast with 25-year warranty.", location: "Chennai, Tamil Nadu", capacity: 100000, roi: 13.0, fundingGoal: 8000000, fundedAmount: 2400000 },
    { name: "Himachal Hydro-Solar Hybrid", description: "Micro-hydro combined with solar in high-altitude terrain for year-round generation.", location: "Shimla, Himachal Pradesh", capacity: 50000, roi: 11.5, fundingGoal: 3000000, fundedAmount: 900000 },
  ]);

  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const inv1 = await Investment.create({ userId: investor._id, projectId: projects[0]._id, amount: 50000, roiAtInvestment: projects[0].roi, createdAt: oneYearAgo });
  const inv2 = await Investment.create({ userId: investor._id, projectId: projects[2]._id, amount: 25000, roiAtInvestment: projects[2].roi, createdAt: sixMonthsAgo });
  const inv3 = await Investment.create({ userId: investor._id, projectId: projects[3]._id, amount: 15000, roiAtInvestment: projects[3].roi, createdAt: threeMonthsAgo });

  await Ledger.insertMany([
    { type: "INVEST", userId: investor._id, investmentId: inv1._id, projectId: projects[0]._id, amount: 50000, meta: { seeded: true } },
    { type: "INVEST", userId: investor._id, investmentId: inv2._id, projectId: projects[2]._id, amount: 25000, meta: { seeded: true } },
    { type: "INVEST", userId: investor._id, investmentId: inv3._id, projectId: projects[3]._id, amount: 15000, meta: { seeded: true } },
  ]);

  console.log("\n✅  Seed complete!");
  console.log("   Admin:    admin@solarinvest.com    / Admin@123");
  console.log("   Investor: investor@solarinvest.com / Demo@123\n");
  process.exit(0);
};

run().catch((err) => { console.error("[SEED] Error:", err.message); process.exit(1); });

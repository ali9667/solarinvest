import User from "../models/User.js";
import Investment from "../models/Investment.js";
import investmentRepo from "../repositories/investmentRepository.js";
import projectRepo from "../repositories/projectRepository.js";
import { cache } from "../config/cache.js";
import { CACHE_KEYS, CACHE_TTL } from "../config/constants.js";

const adminService = {
  getAnalytics: async () => {
    const cached = await cache.get(CACHE_KEYS.ANALYTICS);
    if (cached) return cached;

    const [totalUsers, investments, topProjects, monthlyActivity, roiDistribution] = await Promise.all([
      User.countDocuments({ role: "user", isActive: true, deletedAt: null }),
      Investment.find({ status: "active" }),
      projectRepo.topByFunding(5),
      investmentRepo.monthlyActivity(6),
      investmentRepo.roiDistribution(),
    ]);

    const totalCapital = investments.reduce((s, i) => s + i.amount, 0);
    const portfolioValue = investments.reduce((s, i) => s + i.currentValue, 0);
    const totalCo2 = investments.reduce((s, i) => s + i.co2OffsetTons, 0);

    const result = {
      kpis: {
        totalUsers,
        totalProjects: topProjects.length,
        totalCapital: parseFloat(totalCapital.toFixed(2)),
        portfolioValue: parseFloat(portfolioValue.toFixed(2)),
        totalReturns: parseFloat((portfolioValue - totalCapital).toFixed(2)),
        totalCo2Offset: parseFloat(totalCo2.toFixed(2)),
      },
      topProjects: topProjects.map((p) => ({
        name: p.name,
        location: p.location,
        fundedAmount: p.fundedAmount,
        fundingGoal: p.fundingGoal,
        fundingProgress: p.fundingProgress,
        status: p.status,
      })),
      monthlyActivity,
      roiDistribution,
    };

    await cache.set(CACHE_KEYS.ANALYTICS, result, CACHE_TTL.ANALYTICS);
    return result;
  },
};

export default adminService;

import investmentRepo from "../repositories/investmentRepository.js";
import projectRepo from "../repositories/projectRepository.js";
import ledgerRepo from "../repositories/ledgerRepository.js";
import auditRepo from "../repositories/auditRepository.js";
import { Errors } from "../utils/errors.js";
import { MIN_INVESTMENT, AUDIT } from "../config/constants.js";

const getMeta = (req) => ({ ip: req.ip, userAgent: req.get("user-agent") || "" });

const buildGrowthData = (investments) => {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const label = month.toLocaleString("default", { month: "short", year: "2-digit" });
    const value = investments.reduce((s, inv) => {
      const start = new Date(inv.createdAt);
      if (start > month) return s;
      const mElapsed = (month.getFullYear() - start.getFullYear()) * 12 + (month.getMonth() - start.getMonth());
      const rate = inv.roiAtInvestment / 100 / 12;
      return s + inv.amount * Math.pow(1 + rate, Math.max(0, mElapsed));
    }, 0);
    return { month: label, value: parseFloat(value.toFixed(2)) };
  });
};

const investmentService = {
  invest: async (req) => {
    const { projectId, amount } = req.body;
    const amt = Number(amount);
    if (!projectId || !amount || amt < MIN_INVESTMENT) throw Errors.validation(`Minimum investment is Rs ${MIN_INVESTMENT}`);

    const project = await projectRepo.findById(projectId);
    if (!project) throw Errors.notFound("Project");
    if (project.status !== "active") throw Errors.projectNotActive();

    const investment = await investmentRepo.create({ userId: req.user._id, projectId, amount: amt, roiAtInvestment: project.roi });
    await ledgerRepo.create({ type: "INVEST", userId: req.user._id, investmentId: investment._id, projectId, amount: amt, meta: { projectName: project.name } });
    await projectRepo.incrementFunded(projectId, amt);

    auditRepo.log(AUDIT.INVESTMENT_CREATED, { userId: req.user._id, resourceId: investment._id, resourceType: "Investment", ...getMeta(req), after: { projectId, amount: amt } });
    return investment;
  },

  withdraw: async (req) => {
    const investment = await investmentRepo.findById(req.params.id);
    if (!investment) throw Errors.notFound("Investment");
    if (investment.userId.toString() !== req.user._id.toString()) throw Errors.forbidden();
    if (investment.status === "withdrawn") throw Errors.alreadyWithdrawn();

    const payout = investment.currentValue;
    await investmentRepo.updateById(investment._id, { status: "withdrawn", withdrawnAt: new Date(), withdrawnValue: payout });
    await ledgerRepo.create({ type: "WITHDRAW", userId: req.user._id, investmentId: investment._id, projectId: investment.projectId, amount: payout, meta: { originalAmount: investment.amount } });
    await projectRepo.decrementFunded(investment.projectId, investment.amount);

    auditRepo.log(AUDIT.INVESTMENT_WITHDRAWN, { userId: req.user._id, resourceId: investment._id, resourceType: "Investment", ...getMeta(req), after: { payout } });
    return { payout: parseFloat(payout.toFixed(2)) };
  },

  getPortfolio: async (userId) => {
    const investments = await investmentRepo.findByUser(userId);
    const active = investments.filter((i) => i.status === "active");
    const totalInvested = active.reduce((s, i) => s + i.amount, 0);
    const portfolioValue = active.reduce((s, i) => s + i.currentValue, 0);
    const co2Offset = active.reduce((s, i) => s + i.co2OffsetTons, 0);

    const allocation = active.map((i) => ({ name: i.projectId?.name || "Unknown", value: parseFloat(i.currentValue.toFixed(2)), invested: i.amount }));
    const growthData = buildGrowthData(active);

    return {
      summary: {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        portfolioValue: parseFloat(portfolioValue.toFixed(2)),
        totalReturns: parseFloat((portfolioValue - totalInvested).toFixed(2)),
        co2Offset: parseFloat(co2Offset.toFixed(3)),
        activeCount: active.length,
        withdrawnCount: investments.filter((i) => i.status === "withdrawn").length,
      },
      investments: investments.map((i) => ({
        id: i._id,
        projectName: i.projectId?.name || "Deleted",
        projectLocation: i.projectId?.location || "",
        amount: i.amount,
        roi: i.roiAtInvestment,
        currentValue: parseFloat(i.currentValue.toFixed(2)),
        totalReturns: parseFloat(i.totalReturns.toFixed(2)),
        co2Offset: parseFloat(i.co2OffsetTons.toFixed(3)),
        status: i.status,
        investedAt: i.createdAt,
        withdrawnAt: i.withdrawnAt,
        monthsElapsed: parseFloat(i.monthsElapsed.toFixed(1)),
      })),
      growthData,
      allocation,
    };
  },

  getTransactions: async (userId) => {
    const investments = await investmentRepo.findByUser(userId);
    const txns = [];
    investments.forEach((inv) => {
      txns.push({ id: `${inv._id}-invest`, type: "investment", projectName: inv.projectId?.name || "Deleted", projectLocation: inv.projectId?.location || "", amount: inv.amount, date: inv.createdAt, status: "completed" });
      if (inv.status === "withdrawn" && inv.withdrawnAt) {
        txns.push({ id: `${inv._id}-withdraw`, type: "withdrawal", projectName: inv.projectId?.name || "Deleted", projectLocation: inv.projectId?.location || "", amount: parseFloat(inv.currentValue.toFixed(2)), date: inv.withdrawnAt, status: "completed" });
      }
    });
    return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  exportCSV: async (userId) => {
    const investments = await investmentRepo.findByUser(userId);
    const headers = ["Project", "Location", "Invested (Rs)", "ROI (%)", "Current Value (Rs)", "Returns (Rs)", "CO2 Offset (t)", "Status", "Date"];
    const rows = investments.map((i) => [i.projectId?.name || "Deleted", i.projectId?.location || "", i.amount, i.roiAtInvestment, i.currentValue.toFixed(2), i.totalReturns.toFixed(2), i.co2OffsetTons.toFixed(3), i.status, new Date(i.createdAt).toLocaleDateString("en-IN")]);
    return [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  },
};

export default investmentService;

import Project from "../models/Project.js";

const projectRepo = {
  findById: (id) => Project.findById(id),

  findPaginated: async ({ search = "", status = "", page = 1, limit = 12 }) => {
    const filter = { deletedAt: null };
    if (search) filter.$text = { $search: search };
    if (status && status !== "all") filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Project.countDocuments(filter),
    ]);
    return { projects, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 };
  },

  create: (data) => Project.create(data),

  updateById: (id, data) => Project.findByIdAndUpdate(id, data, { new: true, runValidators: true }),

  softDelete: (id) => Project.findByIdAndUpdate(id, { deletedAt: new Date(), status: "closed" }, { new: true }),

  incrementFunded: async (id, amount) => {
    const p = await Project.findByIdAndUpdate(id, { $inc: { fundedAmount: amount } }, { new: true });
    if (p && p.fundedAmount >= p.fundingGoal && p.status === "active") {
      return Project.findByIdAndUpdate(id, { status: "funded" }, { new: true });
    }
    return p;
  },

  decrementFunded: async (id, amount) => {
    const p = await Project.findByIdAndUpdate(id, { $inc: { fundedAmount: -Math.abs(amount) } }, { new: true });
    if (p && p.fundedAmount < p.fundingGoal && p.status === "funded") {
      return Project.findByIdAndUpdate(id, { status: "active" }, { new: true });
    }
    return p;
  },

  topByFunding: (limit = 5) => Project.find({ deletedAt: null }).sort({ fundedAmount: -1 }).limit(limit),
};

export default projectRepo;

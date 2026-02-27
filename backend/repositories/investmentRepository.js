import Investment from "../models/Investment.js";
import mongoose from "mongoose";

const investmentRepo = {
  findById: (id) => Investment.findById(id),

  findByUser: (userId) =>
    Investment.find({ userId }).populate("projectId", "name location roi capacity").sort({ createdAt: -1 }),

  findActiveByUser: (userId) =>
    Investment.find({ userId, status: "active" }).populate("projectId", "name location roi capacity"),

  create: (data) => Investment.create(data),

  updateById: (id, data) => Investment.findByIdAndUpdate(id, data, { new: true }),

  monthlyActivity: (months = 6) => {
    const since = new Date();
    since.setMonth(since.getMonth() - months);
    return Investment.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $project: { _id: 0, year: "$_id.year", month: "$_id.month", label: { $concat: [{ $arrayElemAt: [["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], "$_id.month"] }, " ", { $substr: [{ $toString: "$_id.year" }, 2, 2] }] }, totalAmount: 1, count: 1 } },
      { $sort: { year: 1, month: 1 } },
    ]);
  },

  roiDistribution: () =>
    Investment.aggregate([
      { $match: { status: "active" } },
      { $bucket: { groupBy: "$roiAtInvestment", boundaries: [0, 8, 10, 12, 15, 50], default: "Other", output: { count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } } },
      { $project: { range: { $switch: { branches: [{ case: { $eq: ["$_id", 0] }, then: "0-8%" }, { case: { $eq: ["$_id", 8] }, then: "8-10%" }, { case: { $eq: ["$_id", 10] }, then: "10-12%" }, { case: { $eq: ["$_id", 12] }, then: "12-15%" }, { case: { $eq: ["$_id", 15] }, then: "15%+" }], default: "Other" } }, count: 1, totalAmount: 1 } },
    ]),
};

export default investmentRepo;

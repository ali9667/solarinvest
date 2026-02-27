import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  location: { type: String, required: true, trim: true },
  capacity: { type: Number, required: true, min: 1 },
  roi: { type: Number, required: true, min: 0.1, max: 50 },
  fundingGoal: { type: Number, required: true, min: 1000 },
  fundedAmount: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["active", "funded", "closed"], default: "active" },
  deletedAt: { type: Date, default: null },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ name: "text" });

projectSchema.virtual("fundingProgress").get(function () {
  return this.fundingGoal > 0 ? Math.min(100, Math.round((this.fundedAmount / this.fundingGoal) * 100)) : 0;
});

const filterDeleted = function (next) {
  if (!this._conditions.includeDeleted) this.where({ deletedAt: null });
  next();
};
projectSchema.pre("find", filterDeleted);
projectSchema.pre("findOne", filterDeleted);
projectSchema.pre("findOneAndUpdate", filterDeleted);
projectSchema.pre("countDocuments", filterDeleted);

export default mongoose.model("Project", projectSchema);

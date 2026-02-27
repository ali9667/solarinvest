import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  amount: { type: Number, required: true, min: 100 },
  roiAtInvestment: { type: Number, required: true },
  status: { type: String, enum: ["active", "withdrawn"], default: "active" },
  withdrawnAt: { type: Date, default: null },
  withdrawnValue: { type: Number, default: null },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

investmentSchema.index({ userId: 1, status: 1 });
investmentSchema.index({ userId: 1, createdAt: -1 });
investmentSchema.index({ projectId: 1, status: 1 });

investmentSchema.virtual("monthsElapsed").get(function () {
  const ref = (this.status === "withdrawn" && this.withdrawnAt) ? this.withdrawnAt : new Date();
  return (ref.getTime() - new Date(this.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
});

investmentSchema.virtual("currentValue").get(function () {
  if (this.status === "withdrawn") return this.withdrawnValue || this.amount;
  const rate = this.roiAtInvestment / 100 / 12;
  return parseFloat((this.amount * Math.pow(1 + rate, this.monthsElapsed)).toFixed(2));
});

investmentSchema.virtual("totalReturns").get(function () {
  return parseFloat((this.currentValue - this.amount).toFixed(2));
});

investmentSchema.virtual("co2OffsetTons").get(function () {
  return parseFloat(((this.amount / 1000) * 2.5 * 0.5 * (this.monthsElapsed / 12)).toFixed(3));
});

export default mongoose.model("Investment", investmentSchema);

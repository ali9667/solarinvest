import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
  type: { type: String, enum: ["INVEST", "WITHDRAW", "GROWTH"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  investmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Investment", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  amount: { type: Number, required: true, min: 0 },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

ledgerSchema.index({ investmentId: 1, type: 1 });
ledgerSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Ledger", ledgerSchema);

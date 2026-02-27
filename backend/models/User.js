import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null },
  lastLogin: { type: Date, default: null },
  loginAttempts: { type: Number, default: 0, select: false },
  lockUntil: { type: Date, default: null, select: false },
  passwordResetToken: { type: String, default: null, select: false },
  passwordResetExpires: { type: Date, default: null, select: false },
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ passwordResetToken: 1 }, { sparse: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({ loginAttempts: 1, $unset: { lockUntil: 1 } });
  }
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + 15 * 60 * 1000) };
  }
  return this.updateOne(updates);
};

userSchema.methods.toSafeObject = function () {
  return { _id: this._id, name: this.name, email: this.email, role: this.role, lastLogin: this.lastLogin, createdAt: this.createdAt };
};

export default mongoose.model("User", userSchema);

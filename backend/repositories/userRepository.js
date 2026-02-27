import User from "../models/User.js";

const userRepo = {
  findById: (id) => User.findById(id),
  findByEmail: (email) => User.findOne({ email }).select("+password +loginAttempts +lockUntil"),
  findByEmailActive: (email) => User.findOne({ email, isActive: true, deletedAt: null }),
  findByResetToken: (hashedToken) =>
    User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } }).select("+password"),
  create: (data) => User.create(data),
  updateById: (id, update) => User.findByIdAndUpdate(id, update, { new: true, runValidators: true }),
  updateLastLogin: (id) => User.findByIdAndUpdate(id, { lastLogin: new Date(), loginAttempts: 0, $unset: { lockUntil: 1 } }),
  softDelete: (id) =>
    User.findByIdAndUpdate(id, { isActive: false, deletedAt: new Date(), email: `deleted_${id}@deleted.invalid` }, { new: true }),
};

export default userRepo;

import AuditLog from "../models/AuditLog.js";

const auditRepo = {
  log: (action, ctx = {}) => {
    const { userId = null, resourceId = null, resourceType = null, ip = null, userAgent = null, before = null, after = null, meta = {} } = ctx;
    return AuditLog.create({ action, userId, resourceId, resourceType, ip, userAgent, before, after, meta })
      .catch((err) => console.error("[AUDIT] Write failed:", err.message));
  },
  findByUser: (userId, limit = 50) => AuditLog.find({ userId }).sort({ createdAt: -1 }).limit(limit),
};

export default auditRepo;

import Ledger from "../models/Ledger.js";

const ledgerRepo = {
  create: (data) => Ledger.create(data),
  findByUser: (userId) => Ledger.find({ userId }).sort({ createdAt: -1 }),
  findByInvestment: (investmentId) => Ledger.find({ investmentId }).sort({ createdAt: 1 }),
};

export default ledgerRepo;

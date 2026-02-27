import investmentService from "../services/investmentService.js";
import { success } from "../utils/response.js";

export const invest = async (req, res, next) => {
  try {
    const investment = await investmentService.invest(req);
    return success(res, { investment }, 201);
  } catch (err) { next(err); }
};

export const withdraw = async (req, res, next) => {
  try {
    const result = await investmentService.withdraw(req);
    return success(res, result);
  } catch (err) { next(err); }
};

export const portfolio = async (req, res, next) => {
  try {
    const data = await investmentService.getPortfolio(req.user._id);
    return success(res, data);
  } catch (err) { next(err); }
};

export const transactions = async (req, res, next) => {
  try {
    const data = await investmentService.getTransactions(req.user._id);
    return success(res, data);
  } catch (err) { next(err); }
};

export const exportCSV = async (req, res, next) => {
  try {
    const csv = await investmentService.exportCSV(req.user._id);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="portfolio-${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) { next(err); }
};

import adminService from "../services/adminService.js";
import { success } from "../utils/response.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await adminService.getAnalytics();
    return success(res, data);
  } catch (err) { next(err); }
};

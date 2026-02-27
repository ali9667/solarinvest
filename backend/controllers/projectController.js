import projectService from "../services/projectService.js";
import { success, successPaginated } from "../utils/response.js";

export const list = async (req, res, next) => {
  try {
    const { search = "", status = "", page = 1, limit = 12 } = req.query;
    const result = await projectService.list({ search, status, page: Number(page), limit: Number(limit) });
    const { projects, total, ...pagination } = result;
    return successPaginated(res, projects, pagination);
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const project = await projectService.getById(req.params.id);
    return success(res, { project });
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const project = await projectService.create(req);
    return success(res, { project }, 201);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const project = await projectService.update(req);
    return success(res, { project });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await projectService.softDelete(req);
    return success(res, { message: "Project deleted" });
  } catch (err) { next(err); }
};

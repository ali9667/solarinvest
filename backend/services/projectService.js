import projectRepo from "../repositories/projectRepository.js";
import auditRepo from "../repositories/auditRepository.js";
import { cache } from "../config/cache.js";
import { CACHE_KEYS, CACHE_TTL, AUDIT } from "../config/constants.js";
import { Errors } from "../utils/errors.js";

const getMeta = (req) => ({ ip: req.ip, userAgent: req.get("user-agent") || "" });

const projectService = {
  list: async (filters) => {
    const cacheKey = `${CACHE_KEYS.PROJECTS_LIST}:${JSON.stringify(filters)}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
    const result = await projectRepo.findPaginated(filters);
    await cache.set(cacheKey, result, CACHE_TTL.PROJECTS_LIST);
    return result;
  },

  getById: async (id) => {
    const cacheKey = CACHE_KEYS.PROJECT_BY_ID(id);
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
    const project = await projectRepo.findById(id);
    if (!project) throw Errors.notFound("Project");
    await cache.set(cacheKey, project, CACHE_TTL.PROJECT_BY_ID);
    return project;
  },

  create: async (req) => {
    const { name, description, location, capacity, roi, fundingGoal } = req.body;
    if (!name || !location || !capacity || !roi || !fundingGoal) throw Errors.validation("All fields are required");
    const project = await projectRepo.create({ name, description: description || "", location, capacity: Number(capacity), roi: Number(roi), fundingGoal: Number(fundingGoal) });
    await cache.clear(CACHE_KEYS.PROJECTS_LIST);
    auditRepo.log(AUDIT.PROJECT_CREATED, { userId: req.user._id, resourceId: project._id, resourceType: "Project", ...getMeta(req), after: { name } });
    return project;
  },

  update: async (req) => {
    const { id } = req.params;
    const existing = await projectRepo.findById(id);
    if (!existing) throw Errors.notFound("Project");
    const project = await projectRepo.updateById(id, req.body);
    await cache.del(CACHE_KEYS.PROJECT_BY_ID(id));
    await cache.clear(CACHE_KEYS.PROJECTS_LIST);
    auditRepo.log(AUDIT.PROJECT_UPDATED, { userId: req.user._id, resourceId: id, resourceType: "Project", ...getMeta(req), before: { name: existing.name, status: existing.status }, after: req.body });
    return project;
  },

  softDelete: async (req) => {
    const { id } = req.params;
    const existing = await projectRepo.findById(id);
    if (!existing) throw Errors.notFound("Project");
    await projectRepo.softDelete(id);
    await cache.del(CACHE_KEYS.PROJECT_BY_ID(id));
    await cache.clear(CACHE_KEYS.PROJECTS_LIST);
    auditRepo.log(AUDIT.PROJECT_DELETED, { userId: req.user._id, resourceId: id, resourceType: "Project", ...getMeta(req), before: { name: existing.name } });
  },
};

export default projectService;

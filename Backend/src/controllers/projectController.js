const Project = require("../models/Project");
const User = require("../models/User");
const { ApiError } = require("../utils/ApiError");
const { logActivity } = require("../utils/activityLogger");

const canManageProject = (project, user) => {
  if (user.role === "admin") return true; //admin can manage anything
  if (
    user.role === "manager" &&
    project.members.some((id) => id.equals(user._id))
  ) {
    return true; //manager should be a member in the project
  }
  return project.createdBy.equals(user._id); //creator should manage his project
};

const createProject = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return next(new ApiError("Project name is required", 400));
    }

    const memberIds = Array.isArray(members) ? members : []; //making sure passed members is array
    const uniqueMembers = [req.user._id, ...memberIds].filter(
      (value, index, self) =>
        self.findIndex((id) => id.toString() === value.toString()) === index,
    ); //extracting unique ids + the creator id

    const project = await Project.create({
      name,
      description: description || "",
      createdBy: req.user._id,
      members: uniqueMembers,
    });

    await logActivity({
      action: "project_created",
      entityType: "Project",
      entityId: project._id,
      performedBy: req.user._id,
      metadata: { name: project.name },
    });

    return res.status(201).json({ project });
  } catch (err) {
    return next(err);
  }
};

const listProjects = async (req, res, next) => {
  try {
    //admin have no restrictions and sees all projects.
    //non admin only see the projects he's a member in
    const filter = req.user.role === "admin" ? {} : { members: req.user._id };

    const projects = await Project.find(filter)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    return res.json({ projects });
  } catch (err) {
    return next(err);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return next(new ApiError("Project not found", 404));
    }

    if (
      req.user.role !== "admin" &&
      !project.members.some((id) => id.equals(req.user._id))
    ) {
      return next(new ApiError("Forbidden", 403));
    }

    return res.json({ project });
  } catch (err) {
    return next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ApiError("Project not found", 404));
    }

    if (!canManageProject(project, req.user)) {
      return next(new ApiError("Forbidden", 403));
    }

    const { name, description, members, isArchived } = req.body;

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (typeof isArchived === "boolean") project.isArchived = isArchived;

    if (Array.isArray(members)) {
      const uniqueMembers = [project.createdBy, ...members].filter(
        (value, index, self) =>
          self.findIndex((id) => id.toString() === value.toString()) === index,
      );
      project.members = uniqueMembers;
    }

    await project.save();

    await logActivity({
      action: "project_updated",
      entityType: "Project",
      entityId: project._id,
      performedBy: req.user._id,
      metadata: { name: project.name },
    });

    const populated = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    return res.json({ project: populated });
  } catch (err) {
    return next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return next(new ApiError("userId is required", 400));
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ApiError("Project not found", 404));
    }

    if (!canManageProject(project, req.user)) {
      return next(new ApiError("Forbidden", 403));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    if (!project.members.some((id) => id.equals(user._id))) {
      project.members.push(user._id);
      await project.save();

      await logActivity({
        action: "project_member_added",
        entityType: "Project",
        entityId: project._id,
        performedBy: req.user._id,
        metadata: { userId: user._id },
      });
    }

    const populated = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    return res.json({ project: populated });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  addMember,
};

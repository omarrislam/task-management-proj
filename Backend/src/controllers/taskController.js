const Task = require("../models/Task");
const Project = require("../models/Project");
const { ApiError } = require("../utils/ApiError");
const { logActivity } = require("../utils/activityLogger");

const isProjectMember = (project, user) =>
  project.members.some((id) => id.equals(user._id)) ||
  project.createdBy.equals(user._id);

const canManageTask = (task, user) => {
  if (user.role === "admin" || user.role === "manager") return true;
  if (task.assignedTo && task.assignedTo.equals(user._id)) return true;
  return task.createdBy.equals(user._id);
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, deadline, projectId, assignedTo } =
      req.body;

    if (!title || !projectId) {
      return next(new ApiError("Title and projectId are required", 400));
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ApiError("Project not found", 404));
    }

    if (req.user.role !== "admin" && !isProjectMember(project, req.user)) {
      return next(new ApiError("Forbidden", 403));
    }

    const task = await Task.create({
      title,
      description: description || "",
      status: status || "todo",
      deadline: deadline ? new Date(deadline) : undefined,
      project: project._id,
      assignedTo: assignedTo || undefined,
      createdBy: req.user._id,
    });

    await logActivity({
      action: "task_created",
      entityType: "Task",
      entityId: task._id,
      performedBy: req.user._id,
      metadata: { title: task.title, projectId: project._id },
    });

    return res.status(201).json({ task });
  } catch (err) {
    return next(err);
  }
};

const listTasks = async (req, res, next) => {
  try {
    const { projectId, assignedTo, status } = req.query;

    const filter = {};
    if (projectId) filter.project = projectId;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    return res.json({ tasks });
  } catch (err) {
    return next(err);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name members createdBy")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return next(new ApiError("Task not found", 404));
    }

    const project = task.project;
    if (req.user.role !== "admin" && !isProjectMember(project, req.user)) {
      return next(new ApiError("Forbidden", 403));
    }

    return res.json({ task });
  } catch (err) {
    return next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new ApiError("Task not found", 404));
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return next(new ApiError("Project not found", 404));
    }

    if (req.user.role !== "admin" && !isProjectMember(project, req.user)) {
      return next(new ApiError("Forbidden", 403));
    }

    if (!canManageTask(task, req.user)) {
      return next(new ApiError("Forbidden", 403));
    }

    const { title, description, status, deadline, assignedTo } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined)
      task.deadline = deadline ? new Date(deadline) : null;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

    await task.save();

    await logActivity({
      action: "task_updated",
      entityType: "Task",
      entityId: task._id,
      performedBy: req.user._id,
      metadata: { title: task.title, projectId: task.project },
    });

    const populated = await Task.findById(task._id)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    return res.json({ task: populated });
  } catch (err) {
    return next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new ApiError("Task not found", 404));
    }

    if (req.user.role !== "admin" && !task.createdBy.equals(req.user._id)) {
      return next(new ApiError("Forbidden", 403));
    }

    await task.deleteOne();

    await logActivity({
      action: "task_deleted",
      entityType: "Task",
      entityId: task._id,
      performedBy: req.user._id,
      metadata: { title: task.title, projectId: task.project },
    });

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
};

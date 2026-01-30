const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { ApiError } = require('../utils/ApiError');
const { logActivity } = require('../utils/activityLogger');

const createComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return next(new ApiError('Comment text is required', 400));
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return next(new ApiError('Task not found', 404));
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return next(new ApiError('Project not found', 404));
    }

    if (req.user.role !== 'admin' && !project.members.some((id) => id.equals(req.user._id))) {
      return next(new ApiError('Forbidden', 403));
    }

    const comment = await Comment.create({
      task: task._id,
      text,
      createdBy: req.user._id,
    });

    await logActivity({
      action: 'comment_created',
      entityType: 'Comment',
      entityId: comment._id,
      performedBy: req.user._id,
      metadata: { taskId: task._id },
    });

    const populated = await Comment.findById(comment._id).populate('createdBy', 'name email');

    return res.status(201).json({ comment: populated });
  } catch (err) {
    return next(err);
  }
};

const listComments = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return next(new ApiError('Task not found', 404));
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return next(new ApiError('Project not found', 404));
    }

    if (req.user.role !== 'admin' && !project.members.some((id) => id.equals(req.user._id))) {
      return next(new ApiError('Forbidden', 403));
    }

    const comments = await Comment.find({ task: task._id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: 1 });

    return res.json({ comments });
  } catch (err) {
    return next(err);
  }
};

module.exports = { createComment, listComments };

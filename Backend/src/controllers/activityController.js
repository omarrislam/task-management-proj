const ActivityLog = require('../models/ActivityLog');

const listActivity = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.query;
    const filter = {};
    if (entityType) filter.entityType = entityType;
    if (entityId) filter.entityId = entityId;

    const logs = await ActivityLog.find(filter)
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.json({ logs });
  } catch (err) {
    return next(err);
  }
};

module.exports = { listActivity };

const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ action, entityType, entityId, performedBy, metadata }) => {
  try {
    await ActivityLog.create({
      action,
      entityType,
      entityId,
      performedBy,
      metadata: metadata || {},
    });
  } catch (err) {
    // Avoid failing the main request when logging fails.
  }
};

module.exports = { logActivity };

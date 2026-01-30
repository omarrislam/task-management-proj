const express = require('express');
const { listActivity } = require('../controllers/activityController');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.use(auth, requireRole('admin', 'manager'));

router.get('/', listActivity);

module.exports = router;

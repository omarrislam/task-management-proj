const express = require('express');
const { createComment, listComments } = require('../controllers/commentController');
const { auth } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.use(auth);

router.get('/', listComments);
router.post('/', createComment);

module.exports = router;

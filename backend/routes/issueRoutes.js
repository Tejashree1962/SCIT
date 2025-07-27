const express = require('express');
const router = express.Router();
const {
  createIssue,
  getAllIssues,
  updateIssueStatus,
} = require('../controllers/issueController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createIssue);
router.get('/', protect, getAllIssues);
router.patch('/:id/status', protect, adminOnly, updateIssueStatus);

module.exports = router;

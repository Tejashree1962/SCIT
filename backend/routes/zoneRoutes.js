const express = require('express');
const router = express.Router();
const {
  createZone,
  getAllZones,
} = require('../controllers/zoneController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('admin'), createZone);
router.get('/', protect, getAllZones);

module.exports = router;

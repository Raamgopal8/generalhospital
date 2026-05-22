const express = require('express');
const router = express.Router();
const { getDuties, addDuty, updateDuty, deleteDuty } = require('../controllers/dutyController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, adminOnly, getDuties)
  .post(protect, adminOnly, addDuty);

router.route('/:id')
  .put(protect, adminOnly, updateDuty)
  .delete(protect, adminOnly, deleteDuty);

module.exports = router;

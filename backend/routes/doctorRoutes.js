const express = require('express');
const router = express.Router();
const { getDoctors, addDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getDoctors)
  .post(protect, adminOnly, addDoctor);

router.route('/:id')
  .put(protect, adminOnly, updateDoctor)
  .delete(protect, adminOnly, deleteDoctor);

module.exports = router;

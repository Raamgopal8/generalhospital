const express = require('express');
const router = express.Router();
const { getMedicines, addMedicine, updateMedicine, deleteMedicine } = require('../controllers/medicineController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, getMedicines)
  .post(protect, adminOnly, addMedicine);

router.route('/:id')
  .put(protect, adminOnly, updateMedicine)
  .delete(protect, adminOnly, deleteMedicine);

module.exports = router;

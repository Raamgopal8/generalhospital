const express = require('express');
const router = express.Router();
const { getBeds, addBed, toggleBedOccupancy, deleteBed } = require('../controllers/bedController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, getBeds)
  .post(protect, adminOnly, addBed);

router.route('/:id')
  .put(protect, toggleBedOccupancy) // Authenticated users can occupy/vacate beds
  .delete(protect, adminOnly, deleteBed);

module.exports = router;

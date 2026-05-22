const express = require('express');
const router = express.Router();
const { getAppointments, getMyAppointments, createAppointment, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, adminOnly, getAppointments) // Only admins can see all appointments
  .post(protect, createAppointment); // Patients can book appointments

router.get('/my', protect, getMyAppointments); // Patients can fetch their scheduled visits
router.put('/:id', protect, updateAppointmentStatus); // Both patient and admin can cancel/confirm

module.exports = router;

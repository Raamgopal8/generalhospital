const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('user', 'name email')
      .populate('doctor', 'name specialization department')
      .sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user appointments
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('doctor', 'name specialization department phone')
      .sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Please provide doctor, date, and timeslot' });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if the doctor is already booked for that date and timeslot
    const alreadyBooked = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $ne: 'Cancelled' } // If cancelled, the slot is open again
    });

    if (alreadyBooked) {
      return res.status(400).json({ message: 'This timeslot is already booked for this doctor. Please pick another time or date.' });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      status: 'Pending' // Initial state is Pending, can be confirmed by Admin
    });

    // Populate doctor details in response
    const populated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name specialization department phone');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Please provide status' });
    }

    // Authorization checks:
    // Only Admin can confirm or cancel any appointment.
    // Patients can cancel their own appointments.
    if (req.user.role !== 'admin' && appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this appointment' });
    }

    if (req.user.role !== 'admin' && status === 'Confirmed') {
      return res.status(403).json({ message: 'Only Admins can confirm appointments' });
    }

    appointment.status = status;
    const updated = await appointment.save();

    // Populate for complete API response
    const populated = await Appointment.findById(updated._id)
      .populate('user', 'name email')
      .populate('doctor', 'name specialization department phone');

    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  getMyAppointments,
  createAppointment,
  updateAppointmentStatus,
};

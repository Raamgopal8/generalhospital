const Duty = require('../models/Duty');
const Doctor = require('../models/Doctor');

// @desc    Get all duty schedules
// @route   GET /api/duties
// @access  Private/Admin
const getDuties = async (req, res) => {
  try {
    const duties = await Duty.find({})
      .populate('doctor')
      .sort({ date: 1, shift: 1 });
    res.status(200).json(duties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a duty schedule
// @route   POST /api/duties
// @access  Private/Admin
const addDuty = async (req, res) => {
  try {
    const { doctor, date, shift, room, notes } = req.body;

    if (!doctor || !date || !shift || !room) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Verify doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({ message: 'Selected doctor not found' });
    }

    const duty = await Duty.create({
      doctor,
      date,
      shift,
      room,
      notes: notes || '',
    });

    // Populate doctor details before returning
    const populatedDuty = await Duty.findById(duty._id).populate('doctor');

    res.status(201).json(populatedDuty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a duty schedule
// @route   PUT /api/duties/:id
// @access  Private/Admin
const updateDuty = async (req, res) => {
  try {
    const { doctor, date, shift, room, notes } = req.body;
    const duty = await Duty.findById(req.params.id);

    if (!duty) {
      return res.status(404).json({ message: 'Duty schedule not found' });
    }

    if (doctor) {
      const doctorExists = await Doctor.findById(doctor);
      if (!doctorExists) {
        return res.status(404).json({ message: 'Selected doctor not found' });
      }
    }

    const updatedDuty = await Duty.findByIdAndUpdate(
      req.params.id,
      { doctor, date, shift, room, notes },
      { new: true }
    ).populate('doctor');

    res.status(200).json(updatedDuty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a duty schedule
// @route   DELETE /api/duties/:id
// @access  Private/Admin
const deleteDuty = async (req, res) => {
  try {
    const duty = await Duty.findById(req.params.id);

    if (!duty) {
      return res.status(404).json({ message: 'Duty schedule not found' });
    }

    await Duty.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Duty schedule removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDuties,
  addDuty,
  updateDuty,
  deleteDuty,
};

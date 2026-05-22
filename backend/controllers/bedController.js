const Bed = require('../models/Bed');

// @desc    Get all beds
// @route   GET /api/beds
// @access  Private
const getBeds = async (req, res) => {
  try {
    const beds = await Bed.find({}).populate('occupiedBy', 'name email').sort({ bedNumber: 1 });
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a bed
// @route   POST /api/beds
// @access  Private/Admin
const addBed = async (req, res) => {
  try {
    const { bedNumber, type } = req.body;

    if (!bedNumber || !type) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if bed exists
    const bedExists = await Bed.findOne({ bedNumber });
    if (bedExists) {
      return res.status(400).json({ message: 'Bed with this identifier already exists' });
    }

    const bed = await Bed.create({
      bedNumber,
      type,
      isOccupied: false,
      occupiedBy: null,
      admittedDate: null,
    });

    res.status(201).json(bed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle bed occupancy / Assign patient
// @route   PUT /api/beds/:id
// @access  Private
const toggleBedOccupancy = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);

    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    const { isOccupied, occupiedBy } = req.body;

    if (isOccupied) {
      // Assign patient to bed
      bed.isOccupied = true;
      bed.occupiedBy = occupiedBy || req.user._id; // If not provided, assign to self
      bed.admittedDate = new Date();
    } else {
      // Discharge patient
      bed.isOccupied = false;
      bed.occupiedBy = null;
      bed.admittedDate = null;
    }

    const updatedBed = await bed.save();
    
    // Populate user info for returned payload
    const populatedBed = await Bed.findById(updatedBed._id).populate('occupiedBy', 'name email');

    res.status(200).json(populatedBed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bed
// @route   DELETE /api/beds/:id
// @access  Private/Admin
const deleteBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);

    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    await Bed.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Bed removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBeds,
  addBed,
  toggleBedOccupancy,
  deleteBed,
};

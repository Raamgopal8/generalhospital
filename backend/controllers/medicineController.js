const Medicine = require('../models/Medicine');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({}).sort({ name: 1 });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a medicine
// @route   POST /api/medicines
// @access  Private/Admin
const addMedicine = async (req, res) => {
  try {
    const { name, category, stock, price, minThreshold } = req.body;

    if (!name || !category || stock === undefined || !price) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if medicine exists
    const medicineExists = await Medicine.findOne({ name });
    if (medicineExists) {
      return res.status(400).json({ message: 'Medicine with this name already exists in inventory' });
    }

    const medicine = await Medicine.create({
      name,
      category,
      stock,
      price,
      minThreshold: minThreshold || 10,
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a medicine (stock/details)
// @route   PUT /api/medicines/:id
// @access  Private/Admin
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    await Medicine.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Medicine removed from inventory' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
};

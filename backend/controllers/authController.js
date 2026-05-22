const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Medicine = require('../models/Medicine');
const Bed = require('../models/Bed');
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'premium_hospital_management_secret_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user', // Defaults to 'user' if empty
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/auth/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: 'user' });
    const doctorCount = await Doctor.countDocuments({});
    
    // Low stock medicines (stock <= minThreshold)
    const medicines = await Medicine.find({});
    const lowStockCount = medicines.filter(med => med.stock <= med.minThreshold).length;
    const medicineCount = medicines.length;

    // Bed statistics
    const totalBeds = await Bed.countDocuments({});
    const occupiedBeds = await Bed.countDocuments({ isOccupied: true });
    const availableBeds = totalBeds - occupiedBeds;

    // Appointments count
    const appointmentCount = await Appointment.countDocuments({});
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });

    res.status(200).json({
      users: userCount,
      doctors: doctorCount,
      medicines: {
        total: medicineCount,
        lowStock: lowStockCount
      },
      beds: {
        total: totalBeds,
        occupied: occupiedBeds,
        available: availableBeds
      },
      appointments: {
        total: appointmentCount,
        pending: pendingAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users (patients)
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getStats,
  getUsers,
};

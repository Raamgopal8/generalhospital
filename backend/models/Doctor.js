const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a doctor name'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please add a specialization'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please add experience in years'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a contact phone number'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    availableSlots: {
      type: [String],
      default: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);

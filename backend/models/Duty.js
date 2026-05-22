const mongoose = require('mongoose');

const dutySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Please associate a medical staff/doctor'],
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: [true, 'Please add a duty date'],
    },
    shift: {
      type: String,
      enum: ['Morning (08:00 AM - 04:00 PM)', 'Afternoon (04:00 PM - 12:00 AM)', 'Night (12:00 AM - 08:00 AM)'],
      required: [true, 'Please select a shift'],
    },
    room: {
      type: String,
      required: [true, 'Please add a room, ward, or department location'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Duty', dutySchema);

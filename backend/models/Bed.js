const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: [true, 'Please add a bed number'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify bed type'],
      enum: ['General', 'ICU', 'Semi-Private', 'Private'],
      default: 'General',
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    occupiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    admittedDate: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bed', bedSchema);

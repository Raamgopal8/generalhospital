const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a medicine name'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please add a unit price'],
      min: [0, 'Price cannot be negative'],
    },
    minThreshold: {
      type: Number,
      default: 10,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Medicine', medicineSchema);

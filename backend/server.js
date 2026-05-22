require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = async () => {
  const c = require('./config/db');
  await c();
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect Database
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Hospital Management System API' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const bedRoutes = require('./routes/bedRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const dutyRoutes = require('./routes/dutyRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/duties', dutyRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

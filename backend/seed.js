require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Medicine = require('./models/Medicine');
const Bed = require('./models/Bed');
const Appointment = require('./models/Appointment');
const Duty = require('./models/Duty');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Medicine.deleteMany({});
    await Bed.deleteMany({});
    await Appointment.deleteMany({});
    await Duty.deleteMany({});
    console.log('Cleared existing hospital database records.');

    // 1. Create Admins & Users
    const admin = await User.create({
      name: 'Admin Director',
      email: 'admin@hospital.com',
      password: 'password123',
      role: 'admin',
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'user@hospital.com',
      password: 'password123',
      role: 'user',
    });

    console.log('Accounts created successfully:');
    console.log('  Admin: admin@hospital.com (password123)');
    console.log('  User:  user@hospital.com (password123)');

    // 2. Create Doctors
    const doctors = [
      {
        name: 'Dr. Sarah Jenkins',
        specialization: 'Cardiologist',
        department: 'Cardiology',
        experience: 12,
        phone: '+1 (555) 019-2834',
        available: true,
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
      },
      {
        name: 'Dr. Robert Chen',
        specialization: 'Pediatrician',
        department: 'Pediatrics',
        experience: 8,
        phone: '+1 (555) 014-9842',
        available: true,
        availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
      },
      {
        name: 'Dr. Emily Watson',
        specialization: 'Neurologist',
        department: 'Neurology',
        experience: 15,
        phone: '+1 (555) 012-7634',
        available: true,
        availableSlots: ['09:00 AM', '10:00 AM', '03:00 PM', '04:00 PM']
      },
      {
        name: 'Dr. Alistair Vance',
        specialization: 'Orthopedic Surgeon',
        department: 'Orthopedics',
        experience: 10,
        phone: '+1 (555) 016-1934',
        available: true,
        availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
      },
      {
        name: 'Dr. Lisa Kudrow',
        specialization: 'General Physician',
        department: 'Outpatient Care',
        experience: 6,
        phone: '+1 (555) 011-8899',
        available: false, // Currently not available
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
      }
    ];

    await Doctor.insertMany(doctors);
    console.log(`Inserted ${doctors.length} doctor profile records.`);

    // 3. Create Medicines
    const medicines = [
      { name: 'Paracetamol 500mg', category: 'Analgesics', stock: 120, price: 0.15, minThreshold: 15 },
      { name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 85, price: 1.20, minThreshold: 10 },
      { name: 'Lipitor (Atorvastatin)', category: 'Cardiovascular', stock: 45, price: 2.50, minThreshold: 10 },
      { name: 'Metformin 500mg', category: 'Antidiabetics', stock: 150, price: 0.40, minThreshold: 20 },
      { name: 'Ibuprofen 400mg', category: 'Analgesics', stock: 8, price: 0.25, minThreshold: 10 }, // Low Stock Alert
      { name: 'Ventolin (Albuterol) Inhaler', category: 'Respiratory', stock: 5, price: 12.00, minThreshold: 8 }, // Low Stock Alert
      { name: 'Insulin Glargine', category: 'Antidiabetics', stock: 3, price: 35.00, minThreshold: 5 } // Low Stock Alert
    ];

    await Medicine.insertMany(medicines);
    console.log(`Inserted ${medicines.length} medicine stock items.`);

    // 4. Create Beds
    const beds = [];
    
    // Add General Beds
    for (let i = 1; i <= 8; i++) {
      beds.push({ bedNumber: `G-0${i}`, type: 'General', isOccupied: false });
    }
    // Add ICU Beds
    for (let i = 1; i <= 4; i++) {
      beds.push({ bedNumber: `ICU-0${i}`, type: 'ICU', isOccupied: false });
    }
    // Add Semi-Private Beds
    for (let i = 1; i <= 4; i++) {
      beds.push({ bedNumber: `SP-0${i}`, type: 'Semi-Private', isOccupied: false });
    }
    // Add Private Beds
    for (let i = 1; i <= 4; i++) {
      beds.push({ bedNumber: `P-0${i}`, type: 'Private', isOccupied: false });
    }

    // Set a couple of beds as occupied to make dashboard statistics more interesting
    beds[0].isOccupied = true;
    beds[0].occupiedBy = user._id;
    beds[0].admittedDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago

    beds[8].isOccupied = true; // ICU-01
    beds[8].occupiedBy = user._id;
    beds[8].admittedDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000); // 1 day ago

    await Bed.insertMany(beds);
    console.log(`Inserted ${beds.length} hospital beds (2 occupied).`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();

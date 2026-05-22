General Hospital — HOSPITAL MANAGEMENT SYSTEM

Hospital   : General Hospital
Address    : Near MB Park, Main Road,
             Ariyalur, Tamil Nadu 621704
Emergency  : +91 6369610667
OPD        : +91 6369610667
Timings    : OPD: 8:00 AM – 8:00 PM | Emergency: 24 × 7

GitHub     : https://github.com/Raamgopal8/generalhospital

**TECH STACK**

  Frontend  : React (Vite), Vanilla CSS, Lucide Icons
  Backend   : Node.js, Express.js
  Database  : MongoDB Atlas (Cloud)
              URI: reactjscluster.3jmtfcp.mongodb.net
  Auth      : JWT-based authentication (Role: admin / user)

**PROJECT STRUCTURE**

  Hospital/
  ├── backend/
  │   ├── controllers/
  │   │   ├── authController.js
  │   │   ├── doctorController.js
  │   │   ├── medicineController.js
  │   │   ├── bedController.js
  │   │   ├── appointmentController.js
  │   │   └── dutyController.js          ← NEW
  │   ├── models/
  │   │   ├── User.js
  │   │   ├── Doctor.js
  │   │   ├── Medicine.js
  │   │   ├── Bed.js
  │   │   ├── Appointment.js
  │   │   └── Duty.js                    ← NEW
  │   ├── routes/
  │   │   ├── authRoutes.js
  │   │   ├── doctorRoutes.js
  │   │   ├── medicineRoutes.js
  │   │   ├── bedRoutes.js
  │   │   ├── appointmentRoutes.js
  │   │   └── dutyRoutes.js              ← NEW
  │   ├── seed.js
  │   ├── server.js
  │   └── .env
  ├── frontend/
  │   ├── index.html
  │   └── src/
  │       ├── components/
  │       │   ├── Header.jsx             ← UPDATED
  │       │   └── Sidebar.jsx            ← UPDATED
  │       ├── pages/
  │       │   ├── Auth.jsx               ← UPDATED
  │       │   ├── AdminDashboard.jsx     ← UPDATED
  │       │   └── UserDashboard.jsx
  │       └── utils/
  │           └── api.js                 ← UPDATED
  ├── package.json
  └── README.txt                         ← THIS FILE

**HOW TO RUN**

  1. Install dependencies:
       npm install
       cd backend && npm install
       cd ../frontend && npm install

  2. Configure environment (backend/.env):
       MONGO_URI=*******************
       JWT_SECRET=******
       PORT=3001

  3. Seed the database (optional):
       cd backend && node seed.js

  4. Start backend:
       cd backend && npm start   (runs on port 3001)

  5. Start frontend:
       cd frontend && npm run dev   (runs on port 5173)

  6. Open browser:
       

  Default Admin Login:
       Email    : admin@lakshmi.com
       Password : admin123

**UPDATE HISTORY**

**[v1.0] — Initial Build**
  • Full hospital management system created from scratch
  • React frontend with glassmorphism dark-mode UI
  • Express.js backend REST API
  • MongoDB Atlas cloud database integration
  • JWT authentication with role-based access (Admin / Patient)
  • Core modules:
      - Doctor management (CRUD)
      - Medicine inventory
      - Bed management
      - Appointment booking
      - User authentication & registration

**[v1.1] — Staff Duty Management Feature**
  NEW FEATURE: Staff Duty Scheduler (Admin Only)

  Backend:
  • Created Duty model (Duty.js)
      - Fields: doctor (ObjectId ref), date, shift, room, notes
      - Shift enum: Morning | Afternoon | Night
  • Created dutyController.js — full CRUD operations
  • Created dutyRoutes.js — admin-protected endpoints
  • Mounted at /api/duties in server.js
  • Updated seed.js to reset Duty collection on re-seed

  Frontend:
  • Added 'duties' module to api.js utility
  • Added "Assign Duty" nav item in Sidebar.jsx
  • Built Staff Duty Scheduler tab in AdminDashboard.jsx:
      - Glassmorphic split-layout with reactive CRUD form
      - Real-time double-booking conflict detector (isDoubleBooked)
      - Shift color coding:
          Morning   → Cyan
          Afternoon → Amber
          Night     → Purple
      - Leave-status indicators for doctors

  Bug Fixes:
  • Resolved React CSS rerender warnings in AdminDashboard.jsx
    (replaced inline borderColor with full border shorthand)

**[v1.2] — MongoDB Atlas Migration**
  • Migrated from local MongoDB to MongoDB Atlas cloud cluster
  • Updated backend/.env with Atlas connection string:
      reactjscluster.3jmtfcp.mongodb.net
  • Re-seeded production database with:
      - Admin user accounts
      - Doctor profiles
      - Medicine records
      - Bed registry


**[v1.3] — Hospital Rebranding** 

BRANDING: Full conversion from generic portal to Lakshmi Hospitals

  Auth.jsx (Login Page):
  • Renamed portal from "Aura Care" → "Lakshmi Hospitals"
  • Added two-column layout with hospital info panel on the left:
      - Full address display
      - Emergency & OPD phone numbers
      - OPD timings and emergency hours
      - Trust badges: NABH | ISO 9001 | 24/7 ICU
      - Tagline: "Caring for Life Since 1998"

  Sidebar.jsx:
  • Logo updated: "Lakshmi Hospitals"
  • Added location tagline: "Perambalur, Tamil Nadu"
  • Full hospital address pinned in footer with MapPin icon

  Header.jsx (Dashboard Header):
  • Added info bar strip showing:
      - NABH Accredited badge
      - Emergency contact number (green)
      - Live clock in Indian locale (en-IN)
  • Welcome message: "— Lakshmi Hospitals, Perambalur"

  index.html:
  • Updated browser tab title
  • Added SEO meta description, keywords, author, OG tags

**FEATURES SUMMARY**

  ADMIN DASHBOARD:
  ✓ Overview stats (Doctors, Beds, Medicines, Appointments)
  ✓ Doctor management — Add / Edit / Delete
  ✓ Staff Duty Scheduler — Assign shifts with conflict detection
  ✓ Medicine inventory management
  ✓ Bed status management (Available / Occupied / Maintenance)

  USER / PATIENT DASHBOARD:
  ✓ Book appointments with available doctors
  ✓ View bed availability
  ✓ View booking history

  AUTHENTICATION:
  ✓ Register as Patient or Administrator
  ✓ JWT login with role-based redirect
  ✓ Secure logout

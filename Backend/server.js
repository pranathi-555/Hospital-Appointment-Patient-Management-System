const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const doctorRoutes = require('./routes/doctor.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const queueRoutes = require('./routes/queue.routes');
const recordRoutes = require('./routes/record.routes');
const prescriptionRoutes = require('./routes/prescription.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminRoutes = require('./routes/admin.routes');

const labTestRoutes = require('./routes/LabTest.routes');
const feedbackRoutes = require('./routes/Feedback.routes');
const questionRoutes = require('./routes/Question.routes');
const feedRoutes = require('./routes/Feed.routes');

const { errorHandler } = require('./middleware/error.middleware');

const app = express();


// =======================
// ✅ FIX 1: CORS SETUP
// =======================
app.use(cors({
  origin: [
    "https://hospital-appointment-patient-management-system-pvqo-6m7yql7gs.vercel.app",
    "https://hospital-appointment-patient-manage-three.vercel.app"
  ],
  credentials: true
}));


// Middleware
app.use(express.json());
app.use(cookieParser());


// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const recordsDir = path.join(__dirname, 'uploads/records');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(recordsDir)) fs.mkdirSync(recordsDir, { recursive: true });


// Serve uploads statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// =======================
// ✅ FIX 2: ROOT ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("🏥 Hospital Management API is Running");
});


// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/lab-tests', labTestRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/feed', feedRoutes);


// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: 'HealthSync API running' })
);


// Global Error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

 mongoose.connection.once("open", () => {
  console.log("🔥 DB NAME:", mongoose.connection.db.databaseName);
  console.log("🔥 DB HOST:", mongoose.connection.host);
});


module.exports = app;
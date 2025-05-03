const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'http://192.168.29.156:5173', 
  'http://192.168.29.156:3001'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Routes
const courseRoutes = require("./routes/courses");
const enquiryRoutes = require("./routes/enquiry");
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const franchiseeRoutes = require("./routes/franchisee");
const transactionRoutes = require("./routes/transaction");
const certificateRequestRoutes = require("./routes/certificateRequests");
const issuedCertificatesRoutes = require("./routes/issuedCertificates"); // Added the new route
const adminCertiRoutes = require("./routes/admin-certi"); // Added admin-certi route
const settingsRoutes = require("./routes/settings");
const courierRoutes = require('./routes/courier');
const fraCertificateRoute = require("./routes/fraCertificate");
const marqueeRoutes = require('./routes/marqueeRoutes'); // Correct the path to your routes
const cardRoutes = require('./routes/cardRoutes');
const contactRoutes = require('./routes/contactRoutes');
const resetRoute = require('./routes/reset');
const carouselRoute = require('./routes/carouselRoutes'); 
const agreementRoutes = require('./routes/agreement');

// API Endpoints
app.use("/api/franchisee", franchiseeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/certificateRequests", certificateRequestRoutes);
app.use("/api/issuedCertificates", issuedCertificatesRoutes); // Added the new route for issued certificates
app.use("/api/admin-certi", adminCertiRoutes); // Added admin-certi endpoint
app.use("/api/settings", settingsRoutes);
app.use('/api/courier', courierRoutes);
app.use("/api/fra-certificates", fraCertificateRoute);
app.use('/api/marquee', marqueeRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reset', resetRoute);
app.use('/api/carousel', carouselRoute);
app.use('/api/agreement', agreementRoutes);

// Serve static files (e.g. uploaded certificate images)
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
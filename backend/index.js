const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const authMiddleware = require('./middleware/authMiddleware');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS Middleware with origin whitelist and logging
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'http://192.168.29.156:5173',
  'http://192.168.29.156:3001',
  'http://localhost:5000',
  'http://168.231.102.114:5000',
  'http://168.231.102.114:5173',
  'http://168.231.102.114:3001',
  'http://rvtps.com:5000', 
  'http://rvtps.com:5173',
  'http://rvtps.com:3001', 
  'https://147.93.28.36:5000',
  'http://www.rvtps.com',
  'https://www.rvtps.com', 
  'http://rvtps.com',
  'https://rvtps.com',
  'http://168.231.102.114',
  'https://168.231.102.114',
  'http://192.168.29.156:5000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming Origin:", origin);

      if (!origin) {
        // Allow requests with no origin like Postman, curl
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS Error: Origin ${origin} is not allowed by CORS.`));
    },
    credentials: true,
  })
);

// Body parser middleware
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
const issuedCertificatesRoutes = require("./routes/issuedCertificates");
const adminCertiRoutes = require("./routes/admin-certi");
const settingsRoutes = require("./routes/settings");
const courierRoutes = require('./routes/courier');
const fraCertificateRoute = require("./routes/fracertificate");
const marqueeRoutes = require('./routes/marqueeRoutes');
const cardRoutes = require('./routes/cardRoutes');
const contactRoutes = require('./routes/contactRoutes');
const resetRoute = require('./routes/reset');
const carouselRoute = require('./routes/carouselRoutes');
const agreementRoutes = require('./routes/agreement');
const manualCertiRoute = require('./routes/manualcerti');
const paymentsRoutes = require('./routes/payments');

// API Endpoints
app.use("/api/franchisee", franchiseeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/certificateRequests", certificateRequestRoutes);
app.use("/api/issuedCertificates", issuedCertificatesRoutes);
app.use("/api/admin-certi", adminCertiRoutes);
app.use("/api/settings", settingsRoutes);
app.use('/api/courier', courierRoutes);
app.use("/api/fra-certificates", fraCertificateRoute);
app.use('/api/marquee', marqueeRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reset', resetRoute);
app.use('/api/carousel', carouselRoute);
app.use('/api/agreement', agreementRoutes);
app.use('/api/manualcerti', manualCertiRoute);
app.use('/api/payments', paymentsRoutes);

// Serve Frontend Build
app.use('/', express.static(path.join(__dirname, 'dist-frontend')));
app.get(/^(?!\/api|\/uploads|\/dashboard).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist-frontend', 'index.html'));
});

// ✅ Protect admin panel assets
const adminPanelPath = path.join(__dirname, 'dist-adminpanel');
app.use('/dashboard', authMiddleware, express.static(adminPanelPath));
// ✅ Protect dashboard routes (SPA fallback)
app.get(/^\/dashboard(\/.*)?$/, authMiddleware, (req, res) => {
  res.sendFile(path.join(adminPanelPath, 'index.html'));
});
{/*// Serve Admin Panel Build
app.use('/dashboard', express.static(path.join(__dirname, 'dist-adminpanel')));
app.get(/^\/dashboard(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist-adminpanel', 'index.html'));
}); */}

app.get('/error', (req, res) => {
  if (req.originalUrl.startsWith('/dashboard/')) {
    // Do nothing – skip sending error page
    return res.end(); // or just silently end the response
  }

  const filePath = path.join(__dirname, 'dist-frontend', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving ${filePath}:`, err);
      res.status(500).send('Server Error');
    }
  });
});

// Catch-all route for frontend SPA (excluding API, uploads, dashboard)


// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`🟢 Frontend → http://localhost:${port}/`);
  console.log(`🟢 Admin Panel → http://localhost:${port}`);
});

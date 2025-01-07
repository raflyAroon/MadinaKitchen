import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js"; // Konfigurasi database
import authRoutes from "./routes/authRoutes.js"; // Route untuk autentikasi
import userRoutes from "./routes/userRoutes.js"; // Route untuk user
import orderRoutes from "./routes/orderRoutes.js"; // Route untuk katalog (order)
import onlineClassRoutes from "./routes/onlineClassRoutes.js"; // Route untuk kelas online
import cartRoutes from "./routes/cartRoutes.js"; // Route untuk keranjang belanja
import errorMiddleware from "./middleware/errorMiddleware.js"; // Middleware untuk error handling
import errorHandler from './middleware/errorMiddleware.js';
import payOnlineRoutes from "./routes/payOnlineRoutes.js"; // Route untuk pembayaran online

// Load environment variables
dotenv.config();

// Inisialisasi aplikasi
const app = express();

// Konfigurasi CORS yang lebih spesifik
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware global
app.use(express.json({ limit: '10mb' })); // Untuk membaca JSON di request body dengan limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Untuk membaca URL-encoded data dengan limit

// Test koneksi ke database
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("Connected to the database!");
  connection.release();
});

// Route utama untuk cek server
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Route
app.use("/api/auth", authRoutes); // Endpoint untuk login & signup
app.use("/api/users", userRoutes); // Endpoint untuk user-related operations
app.use("/api/order", orderRoutes); // Endpoint untuk katalog produk
app.use("/api/onlineClass", onlineClassRoutes); // Endpoint untuk kelas online
app.use("/api/cart", cartRoutes); // Endpoint untuk keranjang belanja
app.use("/api/pay-online", payOnlineRoutes); // Endpoint untuk pembayaran online

// Middleware untuk error handling
app.use(errorMiddleware);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        // Hanya tampilkan detail error jika dalam mode development
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.use(errorHandler);

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

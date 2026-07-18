const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes"); 
const addressRoutes = require("./routes/addressRoutes"); // Added: Step 5 Import
const userRoutes = require("./routes/userRoutes"); // ✅ Added: Step 5 Import for User Profile management
const favoriteRoutes = require("./routes/favoriteRoutes"); // ✅ STEP 6 — Added Favorites route import
const reviewRoutes = require("./routes/reviewRoutes"); // ✅ STEP 6 — Added Reviews route import
const couponRoutes = require("./routes/couponRoutes"); // ✅ STEP 6 — Added Coupons route import
const paymentRoutes = require("./routes/paymentRoutes"); // ✅ STEP 4 — Added Payment route import
const adminRoutes = require("./routes/adminRoutes"); // ✅ Added: Admin Dashboard route import

const app = express();

app.use(cors());
app.use(express.json());

// Serve Static Uploads Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Base route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Food Delivery API Running 🚀"
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // ✅ Added: Step 5 Mount for User Profile utility mappings
app.use("/api/favorites", favoriteRoutes); // ✅ STEP 6 — Mounted Favorites pipeline sub-resource maps
app.use("/api/reviews", reviewRoutes); // ✅ STEP 6 — Mounted Reviews pipeline endpoint maps
app.use("/api/coupons", couponRoutes); // ✅ STEP 6 — Mounted Coupons management sub-resource maps
app.use("/api/payment", paymentRoutes); // ✅ STEP 4 — Mounted Payment execution subsystem routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes); 
app.use("/api/addresses", addressRoutes); // Added: Step 5 Mount
app.use("/api/admin", adminRoutes); // ✅ Added: Admin Dashboard mount

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
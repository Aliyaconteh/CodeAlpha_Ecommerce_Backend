const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cartRoutes = require("./routes/cartRoutes");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes"); // ✅ ADD THIS
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets/images", express.static("assets/images"));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes); // ✅ ADD THIS
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

// Example: orderRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const { placeOrder, getOrders, getUserOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController");

const router = express.Router();

router.post("/", auth, placeOrder);
router.get("/", auth, getOrders); // optional status query
router.get("/my-orders", auth, getUserOrders);
router.put("/:id/status", auth, updateOrderStatus);
router.delete("/:id", auth, deleteOrder);

module.exports = router;

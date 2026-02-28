const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const cartController = require("../controllers/cartController");

// All cart routes require authentication
router.use(auth);

// Get user's cart
router.get("/", cartController.getCart);

// Add item to cart
router.post("/add", cartController.addItem);

// Update cart item quantity
router.put("/update/:cartItemId", cartController.updateItem);

// Remove item from cart
router.delete("/remove/:cartItemId", cartController.removeItem);

// Clear cart
router.delete("/clear", cartController.clearCart);

// Get cart count
router.get("/count", cartController.getCartCount);

module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Import controller functions (make sure this path is correct!)
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/images"); // make sure folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", auth, upload.single("image"), addProduct);
router.put("/:id", auth, upload.single("image"), updateProduct); // ✅ must pass function reference
router.delete("/:id", auth, deleteProduct);

module.exports = router;

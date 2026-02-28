// controllers/productController.js
const db = require("../config/db"); // just require the db
const fs = require("fs");
const path = require("path");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products"); // no .promise()
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get single product by id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await db.query(
      "INSERT INTO products (name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, quantity, image]
    );

    res.status(201).json({ message: "Product added", productId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;
    const image = req.file ? req.file.filename : null;

    const query = image
      ? "UPDATE products SET name=?, description=?, price=?, quantity=?, image=? WHERE id=?"
      : "UPDATE products SET name=?, description=?, price=?, quantity=? WHERE id=?";

    const params = image
      ? [name, description, price, quantity, image, id]
      : [name, description, price, quantity, id];

    await db.query(query, params);

    res.json({ message: "Product updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM products WHERE id=?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

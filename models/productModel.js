const db = require("../config/db");

exports.getAllProducts = () => {
  return db.execute("SELECT * FROM products");
};

exports.getProductById = (id) => {
  return db.execute("SELECT * FROM products WHERE id = ?", [id]);
};

// 🔹 Add this function
exports.createProduct = (name, description, price, image) => {
  return db.execute(
    "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)",
    [name, description, price, image]
  );
};

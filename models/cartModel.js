const db = require("../config/db");

// Create or get user's cart
exports.getOrCreateCart = (userId) => {
  return db.execute(
    `INSERT INTO carts (user_id) 
     VALUES (?) 
     ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP`,
    [userId]
  ).then(() => {
    return db.execute(
      "SELECT id FROM carts WHERE user_id = ? AND order_id IS NULL",
      [userId]
    );
  });
};

// Get user's cart with items
exports.getCartWithItems = (userId) => {
  return db.execute(
    `SELECT 
      ci.cart_item_id AS cart_item_id,
      ci.quantity,
      p.id AS product_id,
      p.name,
      p.price,
      p.image AS image,
      (ci.quantity * p.price) AS item_total
     FROM carts c
     JOIN cart_items ci ON c.id = ci.cart_id
     JOIN products p ON ci.product_id = p.id
     WHERE c.user_id = ? AND c.order_id IS NULL
     ORDER BY ci.created_at DESC`,
    [userId]
  );
};

// Add item to cart - THIS SHOULD WORK WITH YOUR STRUCTURE
exports.addToCart = (cartId, productId, quantity = 1) => {
  return db.execute(
    `INSERT INTO cart_items (cart_id, product_id, quantity) 
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE 
     quantity = quantity + VALUES(quantity)`,
    [cartId, productId, quantity]
  );
};

// Update cart item quantity - FIXED (matches your cart_item_id column)
exports.updateCartItem = (cartItemId, quantity) => {
  if (quantity <= 0) {
    return db.execute(
      "DELETE FROM cart_items WHERE cart_item_id = ?",
      [cartItemId]
    );
  }
  
  return db.execute(
    "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
    [quantity, cartItemId]
  );
};

// Remove item from cart - FIXED
exports.removeFromCart = (cartItemId) => {
  return db.execute(
    "DELETE FROM cart_items WHERE cart_item_id = ?",
    [cartItemId]
  );
};

// Clear user's cart
exports.clearCart = (userId) => {
  return db.execute(
    `DELETE ci FROM cart_items ci
     JOIN carts c ON ci.cart_id = c.id
     WHERE c.user_id = ? AND c.order_id IS NULL`,
    [userId]
  );
};

// Get cart item count
exports.getCartItemCount = (userId) => {
  return db.execute(
    `SELECT COALESCE(SUM(ci.quantity), 0) as item_count
     FROM carts c
     LEFT JOIN cart_items ci ON c.id = ci.cart_id
     WHERE c.user_id = ? AND c.order_id IS NULL`,
    [userId]
  );
};
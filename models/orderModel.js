const db = require("../config/db");

exports.createOrder = (userId, total) => {
  return db.execute(
    "INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)",
    [userId, total, 'pending']
  );
};

exports.addOrderItem = (orderId, productId, quantity, price) => {
  return db.execute(
    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
    [orderId, productId, quantity, price]
  );
};

exports.getOrdersWithItems = async (status) => {
  // Return orders joined with their items and user info; controller will group them
  let query = `
    SELECT o.*, oi.product_id, oi.quantity, oi.price, u.name as user_name, u.email as user_email, p.name as product_name, p.image as product_image
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN products p ON oi.product_id = p.id
  `;
  const params = [];
  
  if (status) {
    query += ' WHERE o.status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY o.id DESC';
  
  return db.execute(query, params);
};

exports.getUserOrdersWithItems = async (userId) => {
  // Return user's orders joined with their items and product info
  return db.execute(
    `SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name as product_name, p.image, u.email as user_email
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN products p ON oi.product_id = p.id
     LEFT JOIN users u ON o.user_id = u.id
     WHERE o.user_id = ?
     ORDER BY o.id DESC`,
    [userId]
  );
};

exports.updateOrderStatus = (orderId, status) => {
  return db.execute(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, orderId]
  );
};

exports.deleteOrder = async (orderId) => {
  // First delete order items, then the order
  await db.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);
  return db.execute('DELETE FROM orders WHERE id = ?', [orderId]);
};


const Order = require("../models/orderModel");

// Place a new order. Expects req.user provided by auth middleware and items in req.body.items
exports.placeOrder = async (req, res) => {
  try {
    const user = req.user || {};
    const userId = user.id || user.userId || user.uid;
    if (!userId) return res.status(401).json({ message: 'User not authenticated' });

    const items = req.body.items || req.body.cart || [];
    const total = req.body.total || req.body.amount || 0;

    const [result] = await Order.createOrder(userId, total);
    const orderId = result.insertId || result.insert_id || result.insertId;

    for (let item of items) {
      const productId = item.productId ?? item.id ?? item.product_id;
      const quantity = item.quantity ?? item.qty ?? 1;
      const price = item.price ?? 0;
      await Order.addOrderItem(orderId, productId, quantity, price);
    }

    return res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    console.error('Place order error:', err);
    return res.status(500).json({ message: 'Failed to place order' });
  }
};

// Get current user's orders with items
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await Order.getUserOrdersWithItems(userId);

    // Group rows by order id
    const ordersMap = new Map();
    rows.forEach(r => {
      const id = r.id;
      if (!ordersMap.has(id)) {
        ordersMap.set(id, {
          id: r.id,
          total: r.total,
          status: r.status,
          created_at: r.created_at,
          user_email: r.user_email,
          user_address: r.user_address || '', // Handle missing address column
          items: []
        });
      }
      if (r.product_id) {
        ordersMap.get(id).items.push({
          productId: r.product_id,
          name: r.product_name,
          description: r.product_description || 'No description available', // Handle missing description column
          price: r.price,
          quantity: r.quantity,
          image: r.image
        });
      }
    });

    const orders = Array.from(ordersMap.values());
    res.json(orders);
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ message: 'Failed to get orders' });
  }
};

// Get orders, optionally filtered by status. Returns orders grouped with items.
exports.getOrders = async (req, res) => {
  try {
    const status = req.query.status;
    const [rows] = await Order.getOrdersWithItems(status);

    // Group rows by order id
    const ordersMap = new Map();
    rows.forEach(r => {
      const id = r.id;
      if (!ordersMap.has(id)) {
        ordersMap.set(id, { 
          id: r.id, 
          user_id: r.user_id, 
          user_name: r.user_name, 
          user_email: r.user_email,
          total: r.total, 
          status: r.status, 
          created_at: r.created_at, 
          items: [] 
        });
      }
      if (r.product_id) {
        ordersMap.get(id).items.push({ 
          productId: r.product_id, 
          name: r.product_name, 
          quantity: r.quantity, 
          price: r.price,
          image: r.product_image
        });
      }
    });

    const orders = Array.from(ordersMap.values());
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) return res.status(400).json({ message: 'Order id and status required' });
    await Order.updateOrderStatus(id, status);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Order id required' });
    
    await Order.deleteOrder(id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};

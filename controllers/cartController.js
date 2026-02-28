const cartModel = require("../models/cartModel");

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get or create cart
    await cartModel.getOrCreateCart(userId);
    
    // Get cart with items
    const [cartItems] = await cartModel.getCartWithItems(userId);
    
    // Calculate totals
    let subtotal = 0;
    const items = cartItems.map(item => {
      const itemTotal = parseFloat(item.item_total) || 0;
      subtotal += itemTotal;
      
      return {
        id: item.cart_item_id,
        productId: item.product_id,
        name: item.name,
        price: parseFloat(item.price) || 0,
        quantity: item.quantity,
        image: item.image,
        itemTotal: itemTotal.toFixed(2)
      };
    });
    
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    res.json({
      success: true,
      cart: {
        items,
        summary: {
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
    });
    
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to get cart" 
    });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }
    
    // Get or create cart
    const [cartResult] = await cartModel.getOrCreateCart(userId);
    const cartId = cartResult[0].id;
    
    // Add item to cart
    await cartModel.addToCart(cartId, productId, quantity);
    
    // Get updated cart count
    const [countResult] = await cartModel.getCartItemCount(userId);
    const itemCount = countResult[0].item_count;
    
    res.json({
      success: true,
      message: "Item added to cart",
      itemCount
    });
    
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart"
    });
  }
};

// Update cart item quantity
exports.updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required"
      });
    }
    
    await cartModel.updateCartItem(cartItemId, quantity);
    
    // Get updated cart
    const [cartItems] = await cartModel.getCartWithItems(userId);
    
    res.json({
      success: true,
      message: "Cart updated",
      items: cartItems
    });
    
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart"
    });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.user.id;
    
    await cartModel.removeFromCart(cartItemId);
    
    // Get updated cart
    const [cartItems] = await cartModel.getCartWithItems(userId);
    
    res.json({
      success: true,
      message: "Item removed from cart",
      items: cartItems
    });
    
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart"
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await cartModel.clearCart(userId);
    
    res.json({
      success: true,
      message: "Cart cleared"
    });
    
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart"
    });
  }
};

// Get cart item count
exports.getCartCount = async (req, res,) => {
  try {
    const userId = req.user.id;
    
    const [result] = await cartModel.getCartItemCount(userId);
    const itemCount = result[0].item_count;
    
    res.json({
      success: true,
      itemCount
    });
    
  } catch (error) {
    console.error("Get cart count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart count"
    });
  }
};
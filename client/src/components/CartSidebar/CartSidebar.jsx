import { useCart } from "../../context/CartContext"; // Step 3: Added context import
import "./CartSidebar.css";

function CartSidebar() {
  // Step 3: Destructured reactive properties from useCart global state
  const { cartItems, totalPrice } = useCart();

  return (
    <aside className="cart-sidebar">
      <h2>Your Order</h2>

      {/* Step 3: Implemented dynamic evaluation conditional layout block */}
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0" }}>
            No items in cart
          </p>
        ) : (
          cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div>
                <h4>{item.food_name}</h4>
                <span>
                  ₹{item.price} × {item.quantity}
                </span>
              </div>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))
        )}
      </div>

      <div className="cart-total">
        <div>
          <span>Subtotal</span>
          <span>₹{totalPrice}</span>
        </div>

        <div>
          <span>Delivery</span>
          <span style={{ color: "#22c55e", fontWeight: "600" }}>FREE</span>
        </div>

        <div>
          <span>GST</span>
          <span>₹0</span> {/* Modifiable dynamically if calculation exists */}
        </div>

        <hr />

        <div className="grand-total">
          <strong>Total</strong>
          {/* Step 3: Replaced hardcoded total price node element */}
          <strong>₹{totalPrice}</strong>
        </div>
      </div>

      <button className="checkout-btn" disabled={cartItems.length === 0}>
        Checkout →
      </button>
    </aside>
  );
}

export default CartSidebar;
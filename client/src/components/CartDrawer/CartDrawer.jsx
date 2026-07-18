import "./CartDrawer.css";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();

  const {
    cartItems,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="cart-overlay"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`cart-drawer ${
          isOpen ? "open" : ""
        }`}
      >
        <div className="drawer-header">

          <h2>
            Your Cart ({totalItems})
          </h2>

          <FaTimes
            className="close-icon"
            onClick={onClose}
          />

        </div>

        <div className="drawer-items">

          {cartItems.length === 0 ? (

            <p className="empty-cart">
              Your cart is empty.
            </p>

          ) : (

            cartItems.map(item => (

              <div
                className="drawer-item"
                key={item.id}
              >

                <div>

                  <h4>{item.food_name}</h4>

                  <span>
                    ₹{item.price} × {item.quantity}
                  </span>

                </div>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

              </div>

            ))

          )}

        </div>

        <div className="drawer-footer">

          <div className="total">

            <span>Total</span>

            <strong>
              ₹{totalPrice}
            </strong>

          </div>

          <button
            className="checkout-button"
            onClick={() => {
              onClose();
              navigate("/checkout");
            }}
          >
            Proceed to Checkout →
          </button>

        </div>

      </div>
    </>
  );
}

export default CartDrawer;
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar/Navbar";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice
  } = useCart();

  return (
    <>
      <Navbar />

    <div style={{ padding: "40px", color: "white" }}>

      <h1>My Cart</h1>

      {cartItems.length === 0 ? (

        <p>Your cart is empty.</p>

      ) : (

        <>
          {cartItems.map(item => (

            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                background: "#1e293b",
                padding: "20px",
                borderRadius: "10px"
              }}
            >

              <div>

                <h3>{item.food_name}</h3>

                <p>₹{item.price}</p>

              </div>

              <div>

                <button onClick={() => decreaseQuantity(item.id)}>
                  -
                </button>

                <span style={{ margin: "0 15px" }}>
                  {item.quantity}
                </span>

                <button onClick={() => increaseQuantity(item.id)}>
                  +
                </button>

              </div>

              <button
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>

            </div>

          ))}

          <h2>Total : ₹{totalPrice}</h2>

          <button
            onClick={() => navigate("/checkout")}
            style={{
              marginTop: "10px",
              padding: "12px 24px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Proceed to Checkout →
          </button>

        </>

      )}

    </div>
    </>

  );

}

export default Cart;
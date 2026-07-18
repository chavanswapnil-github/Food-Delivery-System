import { useCart } from "../../context/CartContext"; // Added: Context Import
import "./QuantityButton.css";

function QuantityButton({ food }) { // Updated: Destructured food prop
    // Added: Destructured cart methods from context
    const {
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        cartItems
    } = useCart();

    // Added: Dynamic calculation of item quantity from global store matrix
    const item = cartItems.find(
        i => i.id === food.id
    );
    const quantity = item ? item.quantity : 0;

    // Updated: Checked global quantity tracking reference 
    if (quantity === 0) {
        return (
            <button
                className="add-btn"
                onClick={() => addToCart(food)} // Updated: Added payload handler
            >
                + Add
            </button>
        );
    }

    return (
        <div className="quantity-box">
            <button
                onClick={() => decreaseQuantity(food.id)} // Updated: Decrement method
            >
                -
            </button>

            {/* Updated: Live dynamic quantity integer node value */}
            <span>{quantity}</span>

            <button
                onClick={() => increaseQuantity(food.id)} // Updated: Increment method
            >
                +
            </button>
        </div>
    );
}

export default QuantityButton;
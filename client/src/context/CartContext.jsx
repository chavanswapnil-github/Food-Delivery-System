import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === food.id);

      if (existing) {
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItems = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [cartItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
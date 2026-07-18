import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./responsive.css";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// 1. Import the provider from the library
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 2. Wrap everything with the GoogleOAuthProvider and pass your Client ID */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <CartProvider>
        <App />

        {/* Step 2: Injected fully-configured ToastContainer layout settings */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </CartProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
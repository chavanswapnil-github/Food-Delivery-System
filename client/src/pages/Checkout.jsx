import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../utils/leafletIcons";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderService";
import { getAddresses } from "../services/addressService";
// ✅ Step 2 — Injected the dynamic coupon validator service link
import { applyCoupon } from "../services/couponService";
// ✅ STEP 7 — Imported interactive payment gateway orchestrations
import { createPayment, verifyPayment } from "../services/paymentService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar/Navbar";
import "./Checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // ✅ Step 2 — Registered core functional coupon tracking states
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const total = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // ✅ Step 2 — Dynamic deduction calculator mapping row
  const finalTotal = total - discount;

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await getAddresses();
      const list = res.addresses || [];
      setAddresses(list);

      const def = list.find((a) => a.is_default);
      if (def) {
        setSelectedAddress(def);
      } else if (list.length > 0) {
        setSelectedAddress(list[0]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to load addresses");
    }
  };

  // ✅ Step 2 — Added handles for interactive coupon evaluation
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning("Enter coupon code");
      return;
    }

    try {
      const res = await applyCoupon(couponCode, total);
      setDiscount(res.discount);
      setAppliedCoupon(res.coupon);
      toast.success("Coupon Applied");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid Coupon"
      );
    }
  };

  // ✅ Core Order Placement Engine Wrapper
  const submitOrderRecord = async () => {
    await placeOrder({
      user_id: user.id,
      restaurant_id: cartItems[0].restaurant_id,
      address_id: selectedAddress.id,
      delivery_address: `${selectedAddress.address_line}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.pincode}`,
      payment_method: paymentMethod,
      total_amount: finalTotal,
      coupon: appliedCoupon?.code || null,
      discount,
      items: cartItems,
    });

    clearCart();
    navigate("/order-success");
  };

  // ✅ STEP 7 — Enhanced structural submission gate handler to manage both COD and Razorpay execution paths
  const handleOrder = async () => {
    if (cartItems.length === 0) {
      toast.warning("Cart is empty");
      return;
    }

    if (!selectedAddress) {
      toast.warning("Please select a delivery address");
      return;
    }

    try {
      // Direct pass-through route for Cash On Delivery transactions
      if (paymentMethod === "COD") {
        await submitOrderRecord();
        toast.success("Order placed successfully");
        return;
      }

      // Online Gateway workflow branch execution
      const payment = await createPayment(finalTotal);
      
      const options = {
        key: payment.key,
        amount: payment.order.amount,
        currency: payment.order.currency,
        name: "FoodHub",
        description: "Food Order",
        order_id: payment.order.id,
        handler: async function (response) {
          try {
            const verify = await verifyPayment(response);

            if (verify.success) {
              await submitOrderRecord();
              toast.success("Payment & Order Placement Successful");
            } else {
              toast.error("Payment Verification Failed");
            }
          } catch (verifyErr) {
            console.log(verifyErr);
            toast.error("Error verifying payment transaction status");
          }
        },
        theme: {
          color: "#ef4444",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to process transaction workflow");
    }
  };

  return (
    <>
      <Navbar />

      <section className="checkout-page">

        <div className="checkout-left">

          <Link to="/cart" style={{ display: "inline-block", marginBottom: "10px" }}>
            ← Back to Cart
          </Link>

          <h1>Checkout</h1>

          <div className="checkout-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Delivery Address</h2>
              <Link to="/addresses">Manage Addresses</Link>
            </div>

            {addresses.length === 0 ? (
              <div className="address-box">
                <p>No address found.</p>
                <Link to="/addresses">Add Address</Link>
              </div>
            ) : (
              addresses.map((address) => (
                <label
                  key={address.id}
                  className="address-box"
                  style={{
                    display: "block",
                    cursor: "pointer",
                    marginBottom: "15px",
                  }}
                >
                  <input
                    type="radio"
                    checked={selectedAddress?.id === address.id}
                    onChange={() => setSelectedAddress(address)}
                  />

                  <strong>
                    {address.address_type}
                    {address.is_default ? " (Default)" : ""}
                  </strong> 

                  <p>{address.full_name}</p>
                  <p>{address.phone}</p>
                  <p>{address.address_line}</p>
                  <p>{address.city}, {address.state}</p>
                  <p>{address.pincode}</p>

                  {selectedAddress?.id === address.id &&
                    address.latitude != null &&
                    address.longitude != null && (
                      <div className="checkout-mini-map">
                        <MapContainer
                          center={[address.latitude, address.longitude]}
                          zoom={15}
                          scrollWheelZoom={false}
                          dragging={false}
                          doubleClickZoom={false}
                          zoomControl={false}
                          attributionControl={false}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={[address.latitude, address.longitude]} />
                        </MapContainer>
                      </div>
                    )}
                </label>
              ))
            )}
          </div>

          <div className="checkout-card">
            <h2>Payment Method</h2>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
              />
              UPI
            </label>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "CARD"}
                onChange={() => setPaymentMethod("CARD")}
              />
              Credit / Debit Card
            </label>
          </div>

        </div>

        <div className="checkout-right">

          {/* ✅ Step 3 — Injected visual coupon input fields panel */}
          <div className="checkout-card">
            <h2>Coupon</h2>
            <div className="coupon-box">
              <input
                type="text"
                placeholder="Enter Coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={handleApplyCoupon}>Apply</button>
            </div>

            {appliedCoupon && (
              <p
                style={{
                  marginTop: "10px",
                  color: "#16a34a",
                  fontWeight: 600
                }}
              >
                Coupon Applied (-₹{discount})
              </p>
            )}
          </div>

          <div className="summary-card">
            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div className="summary-item" key={item.id}>
                <span>
                  {item.food_name} × {item.quantity}
                </span>
                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            <hr />

            {/* ✅ Step 4 — Replaced simple layout block with exact subtotal and reduction metrics summary row updates */}
            <div className="summary-item">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            
            <div className="summary-item">
              <span>Discount</span>
              <span style={{ color: "#16a34a" }}>-₹{discount}</span>
            </div>

            <div className="summary-item">
              <span>Delivery</span>
              <span style={{ color: "#22c55e", fontWeight: 600 }}>FREE</span>
            </div>

            <div className="summary-item">
              <strong>Total</strong>
              <strong>₹{finalTotal}</strong>
            </div>

            <button
              className="place-order-btn"
              onClick={handleOrder}
            >
              Place Order →
            </button>
          </div>

        </div>

      </section>
    </>
  );
}

export default Checkout;
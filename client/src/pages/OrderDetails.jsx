import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { getOrderById } from "../services/orderService";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();

  const [items, setItems] = useState([]);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const data = await getOrderById(id);

      if (data.length > 0) {
        setItems(data);
        setOrder(data[0]);
      }

    } catch (err) {
      console.log(err);
    }
  };

  if (!order) {
    return (
      <>
        <Navbar />
        <h2 style={{ padding: 40 }}>Loading...</h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="order-details-page">

        <div className="order-header">

          <h1>Order #{order.id}</h1>

          <span className="status">
            {order.order_status}
          </span>

        </div>

        <div className="summary-card">

          <h2>Order Summary</h2>

          <p>
            <strong>Date :</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>

          <p>
            <strong>Payment :</strong>{" "}
            {order.payment_method}
          </p>

          <p>
            <strong>Payment Status :</strong>{" "}
            {order.payment_status}
          </p>

          <p>
            <strong>Total :</strong> ₹
            {order.total_amount}
          </p>

        </div>

        <div className="timeline">

          <div className="step active">
            Order Placed
          </div>

          <div
            className={
              order.order_status !== "PLACED"
                ? "step active"
                : "step"
            }
          >
            Preparing
          </div>

          <div
            className={
              order.order_status ===
                "OUT_FOR_DELIVERY" ||
              order.order_status ===
                "DELIVERED"
                ? "step active"
                : "step"
            }
          >
            Out for Delivery
          </div>

          <div
            className={
              order.order_status ===
              "DELIVERED"
                ? "step active"
                : "step"
            }
          >
            Delivered
          </div>

        </div>

        <h2>Ordered Items</h2>

        {items.map((item) => (

          <div
            className="food-item"
            key={item.food_id}
          >

            <img
              src={`${API_BASE_URL}/uploads/${item.image}`}
              alt={item.food_name}
            />

            <div>

              <h3>{item.food_name}</h3>

              <p>
                Quantity :
                {item.quantity}
              </p>

            </div>

            <strong>
              ₹
              {item.price * item.quantity}
            </strong>

          </div>

        ))}

      </div>

    </>
  );
}

export default OrderDetails;
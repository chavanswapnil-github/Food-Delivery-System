import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import {
  getMyOrders,
  cancelOrder,
} from "../services/orderService";
import { toast } from "react-toastify";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.log(err);
      toast.error("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await cancelOrder(id);
      toast.success("Order Cancelled");
      loadOrders();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to cancel order"
      );
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "#16a34a";

      case "CANCELLED":
        return "#dc2626";

      case "OUT_FOR_DELIVERY":
        return "#2563eb";

      case "PREPARING":
        return "#f59e0b";

      default:
        return "#64748b";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <h2 style={{ padding: 40 }}>
          Loading Orders...
        </h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="orders-page">

        <div className="orders-header">

          <h1>My Orders</h1>

          <p>
            Track your previous food orders
          </p>

        </div>

        {orders.length === 0 ? (

          <div className="empty-orders">

            <h2>No Orders Yet</h2>

            <p>
              Start ordering delicious food.
            </p>

            <Link
              className="shop-btn"
              to="/restaurants"
            >
              Browse Restaurants
            </Link>

          </div>

        ) : (

          orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              <div className="order-top">

                <div>

                  <h3>
                    Order #{order.id}
                  </h3>

                  <small>
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </small>

                </div>

                <span
                  className="status"
                  style={{
                    background:
                      badgeColor(
                        order.order_status
                      ),
                  }}
                >
                  {order.order_status}
                </span>

              </div>

              <div className="order-info">

                <div>

                  <strong>
                    Payment
                  </strong>

                  <p>
                    {order.payment_method}
                  </p>

                </div>

                <div>

                  <strong>
                    Payment Status
                  </strong>

                  <p>
                    {order.payment_status}
                  </p>

                </div>

                <div>

                  <strong>
                    Total
                  </strong>

                  <p>
                    ₹{order.total_amount}
                  </p>

                </div>

              </div>

              <div className="order-buttons">

                <Link
                  className="view-btn"
                  to={`/orders/${order.id}`}
                >
                  View Details
                </Link>

                {order.order_status ===
                  "PLACED" && (

                  <button
                    className="cancel-btn"
                    onClick={() =>
                      handleCancel(order.id)
                    }
                  >
                    Cancel Order
                  </button>

                )}

              </div>

            </div>

          ))

        )}

      </div>

    </>
  );
}

export default MyOrders;
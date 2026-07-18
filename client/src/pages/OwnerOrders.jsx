import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
// 🚀 Step 1 & Step 2 – Updated Parameter Hook and Core Service Imports
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout";
import "./OwnerOrders.css";

// ✅ Step 5.2 — Updated imports to include getOrderItems alongside details hooks
import {
  getRestaurantOrders,
  updateOrderStatus,
  getOrderDetails,
  getOrderItems,
} from "../services/orderService";
import { toast } from "react-toastify";

function OwnerOrders() {
  const { restaurantId } = useParams(); // 🚀 Step 2 – Extract contextual identifier parameter from route pathing
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  
  // ✅ Step 6 & Step 5.3 — Injected modal toggle, single context item, and arrays state tracks
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // 🚀 Step 3 – Swapped Out Mock Hooks with Live REST Endpoint Fetching Routines
  useEffect(() => {
    loadOrders();
  }, [restaurantId]);

  // ✅ Cleaned up frontend debug logs inside loadOrders
  const loadOrders = async () => {
    try {
      const res = await getRestaurantOrders(restaurantId);

      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to load orders");
    }
  };

  // 🚀 Step 4 – Added Live Pipeline State Transmitters to Sync Data Modifications
  const changeStatus = async (id, newStatus) => {
    try {
      const res = await updateOrderStatus(id, newStatus);
      if (res.success) {
        toast.success("Order Updated");
        loadOrders(); // Instantly refreshes list states
      }
    } catch {
      toast.error("Update Failed");
    }
  };

  // ✅ Step 5.4 — Updated handleViewDetails function to fetch both targets concurrently
  const handleViewDetails = async (id) => {
    try {
      const orderRes = await getOrderDetails(id);
      const itemsRes = await getOrderItems(id);

      if (orderRes.success) {
        setSelectedOrder(orderRes.order);
      }

      if (itemsRes.success) {
        setOrderItems(itemsRes.items);
      }

      setShowModal(true);
    } catch (err) {
      console.log(err);
      toast.error("Unable to load order details");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Dynamic fallback mappings to prevent undefined data execution exceptions
      const orderStatus = order.status || "PLACED";
      
      // ✅ Change 2 — Replaced ID parsing strings with name and phone values
      const orderIdString = (order.id || "").toString();
      const customerName = (order.customer_name || "").toLowerCase();
      const customerPhone = (order.phone || "");

      // Normalize internal matching state to respect standardized uppercase rules
      const matchStatus = status === "All" || orderStatus === status;

      // ✅ Change 3 — Updated conditional search matrix logic rules to use text keys
      const matchSearch =
        orderIdString.includes(search) ||
        customerName.includes(search.toLowerCase()) ||
        customerPhone.includes(search);

      return matchStatus && matchSearch;
    });
  }, [orders, status, search]);

  return (
    <DashboardLayout>
      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders</p>
        </div>
      </div>

      <div className="orders-toolbar">
        <input
          placeholder="Search order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filters">
          {["All", "PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map(item => (
            <button
              key={item}
              className={status === item ? "active" : ""}
              onClick={() => setStatus(item)}
            >
              {item === "OUT_FOR_DELIVERY" ? "Out For Delivery" : item.charAt(0) + item.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div style={{ color: "#94a3b8", textAlign: "center", padding: "40px", width: "100%" }}>
            <h3>No matching orders found.</h3>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div className="order-card" key={order.id}>
              {/* ✅ Change 1 — Restored human-readable values to UI display view cards */}
              <div>
                <h3>Order #{order.id}</h3>
                <p>{order.customer_name}</p>
                <span>{order.phone}</span>
                <small style={{ display: "block", color: "#94a3b8", marginTop: "4px" }}>
                  {order.delivery_address || "No address provided"}
                </small>
              </div>

              {/* ✅ STEP 1 — Swapped display hook to strictly reference order.total_amount */}
              <div>
                <strong>₹{order.total_amount}</strong>
              </div>

              <div>
                <span className={`status ${(order.status || "PLACED").toLowerCase().replace(/_/g, "-")}`}>
                  {order.status || "PLACED"}
                </span>
              </div>

              <div className="order-actions-buttons" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {/* ✅ Step 5 — Injected primary details inspector action button wrapper link */}
                <button onClick={() => handleViewDetails(order.id)}>
                  View Details
                </button>

                {/* 🚀 Step 1, 2 & 3 – Placed Action Conditions Uppercased */}
                {order.status === "PLACED" && (
                  <>
                    <button onClick={() => changeStatus(order.id, "PREPARING")}>
                      Accept
                    </button>
                    <button className="reject" onClick={() => changeStatus(order.id, "CANCELLED")}>
                      Reject
                    </button>
                  </>
                )}

                {/* 🚀 Step 4 & 5 – Preparing Action Conditions Uppercased */}
                {order.status === "PREPARING" && (
                  <button onClick={() => changeStatus(order.id, "OUT_FOR_DELIVERY")}>
                    Out For Delivery
                  </button>
                )}

                {/* 🚀 Step 6 & 7 – Out For Delivery Action Conditions Uppercased */}
                {order.status === "OUT_FOR_DELIVERY" && (
                  <button onClick={() => changeStatus(order.id, "DELIVERED")}>
                    Mark Delivered
                  </button>
                )}

                {/* 🚀 Step 8 — Delivered Terminal Condition Uppercased */}
                {order.status === "DELIVERED" && (
                  <span
                    style={{
                      color: "#22c55e",
                      fontWeight: "bold",
                    }}
                  >
                    ✅ Completed
                  </span>
                )}

                {/* 🚀 Step 9 — Cancelled Terminal Condition Uppercased */}
                {order.status === "CANCELLED" && (
                  <span
                    style={{
                      color: "#ef4444",
                      fontWeight: "bold",
                    }}
                  >
                    ❌ Cancelled
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Step 10 — Injected relational details popup portal node right before layout boundary closes */}
      {showModal && selectedOrder && (
        <div className="edit-modal">
          <div className="edit-box">
            <h2>Order Details</h2>

            <p>
              <strong>Customer:</strong>{" "}
              {selectedOrder.customer_name}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {selectedOrder.phone}
            </p>

            <p>
              <strong>Delivery Address:</strong>{" "}
              {selectedOrder.delivery_address}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {selectedOrder.payment_method}
            </p>

            <p>
              <strong>Total:</strong> ₹
              {selectedOrder.total_amount}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedOrder.status}
            </p>

            {/* ✅ Step 6 — Ordered food item mapping card components injected underneath primary metrics wrapper layout */}
            <hr style={{ margin: "20px 0" }} />
            <h3>Ordered Items</h3>
            <div className="order-items">
              {orderItems.length === 0 ? (
                <p>No items found.</p>
              ) : (
                orderItems.map((item) => (
                  <div key={item.id} className="order-item-card">
                    <img
                      src={`${API_BASE_URL}/uploads/${item.image}`}
                      alt={item.food_name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80";
                      }}
                    />
                    <div className="order-item-info">
                      <h4>{item.food_name}</h4>
                      <p>{item.category}</p>
                      <p>Qty : {item.quantity}</p>
                    </div>
                    <strong>₹{item.price}</strong>
                  </div>
                ))
              )}
            </div>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default OwnerOrders;
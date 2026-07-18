import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout";
import AdminSidebar from "../components/Dashboard/AdminSidebar/AdminSidebar";
import { getAllOrdersAdmin, getOrderItemsAdmin } from "../services/adminService";
import "./Admin.css";

const STATUS_FILTERS = ["All", "PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getAllOrdersAdmin();
      if (res.success) setOrders(res.orders);
    } catch {
      toast.error("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      const matchSearch =
        String(o.id).includes(search) ||
        o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.restaurant_name?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  const viewItems = async (order) => {
    setActiveOrder(order);
    setItemsLoading(true);
    try {
      const res = await getOrderItemsAdmin(order.id);
      if (res.success) setOrderItems(res.items);
    } catch {
      toast.error("Unable to load order items");
    } finally {
      setItemsLoading(false);
    }
  };

  const closeModal = () => {
    setActiveOrder(null);
    setOrderItems([]);
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="admin-header">
        <div>
          <h1>Orders</h1>
          <p>Every order placed across all restaurants.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by order ID, customer, or restaurant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="admin-filter-pills">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={statusFilter === s ? "active" : ""}
              onClick={() => setStatusFilter(s)}
            >
              {s === "All" ? "All" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="admin-loading">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <div className="admin-table-wrap">
          <p className="admin-empty">No orders found.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Placed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>
                    {o.customer_name || "—"}
                    <div className="admin-muted">{o.customer_email}</div>
                  </td>
                  <td>{o.restaurant_name || "—"}</td>
                  <td>₹{o.total_amount}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        o.payment_status === "PAID" ? "paid" : "pending"
                      }`}
                    >
                      {o.payment_status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${(o.status || "placed").toLowerCase()}`}
                    >
                      {(o.status || "PLACED").replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="admin-muted">
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn-view" onClick={() => viewItems(o)}>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeOrder && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Order #{activeOrder.id} — Items</h2>

            {itemsLoading ? (
              <p className="admin-muted">Loading items...</p>
            ) : orderItems.length === 0 ? (
              <p className="admin-muted">No items found for this order.</p>
            ) : (
              orderItems.map((item, i) => (
                <div className="admin-modal-item" key={i}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {item.image && (
                      <img
                        src={`${API_BASE_URL}/uploads/${item.image}`}
                        alt={item.food_name}
                      />
                    )}
                    <div>
                      <div>{item.food_name}</div>
                      <div className="admin-muted">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))
            )}

            <button className="admin-modal-close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminOrders;

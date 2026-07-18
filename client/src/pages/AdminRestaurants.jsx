import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout";
import AdminSidebar from "../components/Dashboard/AdminSidebar/AdminSidebar";
import {
  getAllRestaurantsAdmin,
  setRestaurantStatus,
  deleteRestaurantAdmin,
} from "../services/adminService";
import "./Admin.css";

function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await getAllRestaurantsAdmin();
      if (res.success) setRestaurants(res.restaurants);
    } catch {
      toast.error("Unable to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return restaurants.filter(
      (r) =>
        r.restaurant_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.city?.toLowerCase().includes(search.toLowerCase()) ||
        r.owner_name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [restaurants, search]);

  const toggleStatus = async (restaurant) => {
    const nextStatus = restaurant.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";

    const result = await Swal.fire({
      title: nextStatus === "BLOCKED" ? "Block this restaurant?" : "Unblock this restaurant?",
      text:
        nextStatus === "BLOCKED"
          ? "It will be hidden from customers until unblocked."
          : "It will become visible to customers again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nextStatus === "BLOCKED" ? "#ef4444" : "#22c55e",
      cancelButtonColor: "#64748b",
      confirmButtonText: nextStatus === "BLOCKED" ? "Block" : "Unblock",
      background: "#1e293b",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      await setRestaurantStatus(restaurant.id, nextStatus);
      toast.success(
        `Restaurant ${nextStatus === "BLOCKED" ? "blocked" : "unblocked"}`
      );
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === restaurant.id ? { ...r, status: nextStatus } : r
        )
      );
    } catch {
      toast.error("Action failed");
    }
  };

  const removeRestaurant = async (restaurant) => {
    const result = await Swal.fire({
      title: "Delete this restaurant?",
      text: "This will also remove its foods. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
      background: "#1e293b",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteRestaurantAdmin(restaurant.id);
      toast.success("Restaurant deleted");
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
    } catch {
      toast.error("Delete failed — it may still have linked orders or foods.");
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="admin-header">
        <div>
          <h1>Restaurants</h1>
          <p>Manage every restaurant on the platform.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by name, city, or owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="admin-loading">Loading restaurants...</p>
      ) : filtered.length === 0 ? (
        <div className="admin-table-wrap">
          <p className="admin-empty">No restaurants found.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Owner</th>
                <th>City</th>
                <th>Foods</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.restaurant_name}</td>
                  <td>
                    {r.owner_name || "—"}
                    <div className="admin-muted">{r.owner_email}</div>
                  </td>
                  <td>{r.city}</td>
                  <td>{r.foodCount}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        r.status === "BLOCKED" ? "blocked" : "active"
                      }`}
                    >
                      {r.status || "ACTIVE"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className={r.status === "BLOCKED" ? "btn-unblock" : "btn-block"}
                        onClick={() => toggleStatus(r)}
                      >
                        {r.status === "BLOCKED" ? "Unblock" : "Block"}
                      </button>
                      <button className="btn-delete" onClick={() => removeRestaurant(r)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminRestaurants;

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout";
import AdminSidebar from "../components/Dashboard/AdminSidebar/AdminSidebar";
import {
  getAllUsers,
  setUserStatus,
  deleteUser,
} from "../services/adminService";
import "./Admin.css";

const ROLE_FILTERS = ["All", "CUSTOMER", "OWNER", "ADMIN"];

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      if (res.success) setUsers(res.users);
    } catch {
      toast.error("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === "All" || u.role === roleFilter;
      const matchSearch =
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, search, roleFilter]);

  const toggleStatus = async (user) => {
    const nextStatus = user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";

    const result = await Swal.fire({
      title: nextStatus === "BLOCKED" ? "Block this user?" : "Unblock this user?",
      text:
        nextStatus === "BLOCKED"
          ? "They won't be able to use their account until unblocked."
          : "They will regain access to their account.",
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
      await setUserStatus(user.id, nextStatus);
      toast.success(`User ${nextStatus === "BLOCKED" ? "blocked" : "unblocked"}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
    } catch {
      toast.error("Action failed");
    }
  };

  const removeUser = async (user) => {
    const result = await Swal.fire({
      title: "Delete this user?",
      text: "This action cannot be undone.",
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
      await deleteUser(user.id);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="admin-header">
        <div>
          <h1>Users</h1>
          <p>Manage every customer and restaurant owner account.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="admin-filter-pills">
          {ROLE_FILTERS.map((r) => (
            <button
              key={r}
              className={roleFilter === r ? "active" : ""}
              onClick={() => setRoleFilter(r)}
            >
              {r === "All" ? "All" : r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="admin-loading">Loading users...</p>
      ) : filtered.length === 0 ? (
        <div className="admin-table-wrap">
          <p className="admin-empty">No users found.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    <span className={`admin-badge ${u.role?.toLowerCase()}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${
                        u.status === "BLOCKED" ? "blocked" : "active"
                      }`}
                    >
                      {u.status || "ACTIVE"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      {u.role !== "ADMIN" && (
                        <button
                          className={u.status === "BLOCKED" ? "btn-unblock" : "btn-block"}
                          onClick={() => toggleStatus(u)}
                        >
                          {u.status === "BLOCKED" ? "Unblock" : "Block"}
                        </button>
                      )}
                      {u.role !== "ADMIN" && (
                        <button className="btn-delete" onClick={() => removeUser(u)}>
                          Delete
                        </button>
                      )}
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

export default AdminUsers;

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout";
import AdminSidebar from "../components/Dashboard/AdminSidebar/AdminSidebar";
import StatsCard from "../components/Dashboard/StatsCard/StatsCard";
import { getAnalytics } from "../services/adminService";
import { toast } from "react-toastify";
import "./Admin.css";

const STATUS_COLORS = {
  PLACED: "#f59e0b",
  PREPARING: "#3b82f6",
  OUT_FOR_DELIVERY: "#8b5cf6",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
};

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getAnalytics();
      if (res.success) setAnalytics(res.analytics);
    } catch {
      toast.error("Unable to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const overview = analytics?.overview || {};

  const revenueTrend = (analytics?.revenueTrend || []).map((r) => ({
    day: new Date(r.day).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    revenue: Number(r.revenue),
  }));

  const statusData = (analytics?.statusBreakdown || []).map((s) => ({
    name: s.status,
    value: s.count,
  }));

  const topRestaurants = analytics?.topRestaurants || [];

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Platform-wide overview of users, restaurants, and orders.</p>
        </div>
      </div>

      {loading ? (
        <p className="admin-loading">Loading analytics...</p>
      ) : (
        <>
          <div className="admin-stats-grid">
            <StatsCard title="Restaurants" value={overview.totalRestaurants ?? 0} color="#22c55e" />
            <StatsCard title="Foods" value={overview.totalFoods ?? 0} color="#3b82f6" />
            <StatsCard title="Orders" value={overview.totalOrders ?? 0} color="#f59e0b" />
            <StatsCard title="Revenue" value={`₹${overview.revenue ?? 0}`} color="#ef4444" />
            <StatsCard title="Pending" value={overview.pendingOrders ?? 0} color="#8b5cf6" />
          </div>

          <div className="admin-stats-grid">
            <StatsCard title="Total Users" value={overview.totalUsers ?? 0} color="#22c55e" />
            <StatsCard title="Customers" value={overview.totalCustomers ?? 0} color="#3b82f6" />
            <StatsCard title="Owners" value={overview.totalOwners ?? 0} color="#8b5cf6" />
            <StatsCard title="Delivered" value={overview.deliveredOrders ?? 0} color="#22c55e" />
            <StatsCard title="Cancelled" value={overview.cancelledOrders ?? 0} color="#ef4444" />
          </div>

          <div className="admin-bottom-grid">
            <div className="admin-card">
              <h2>Revenue — Last 14 Days</h2>
              {revenueTrend.length === 0 ? (
                <p className="admin-muted">No orders in this period yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueTrend}>
                    <CartesianGrid stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#ff6b35"
                      strokeWidth={4}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="admin-card">
              <h2>Order Status Breakdown</h2>
              {statusData.length === 0 ? (
                <p className="admin-muted">No orders placed yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                    >
                      {statusData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={STATUS_COLORS[entry.name] || "#64748b"}
                        />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="admin-card">
            <h2>Top Restaurants by Revenue</h2>
            {topRestaurants.length === 0 ? (
              <p className="admin-muted">No sales data yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topRestaurants.map((r) => (
                      <tr key={r.id}>
                        <td>{r.restaurant_name}</td>
                        <td>{r.orders}</td>
                        <td>₹{r.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;

import { useEffect, useState } from "react";
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout";
import StatsCard from "../components/Dashboard/StatsCard/StatsCard";
import QuickActions from "../components/Dashboard/QuickActions/QuickActions";
import { getDashboardStats } from "../services/dashboardService";

// Step 3: Imported Analytics and Recent Orders Components
import RevenueChart from "../components/Dashboard/RevenueChart/RevenueChart";
import RecentOrders from "../components/Dashboard/RecentOrders/RecentOrders";
import "./OwnerDashboard.css";

function OwnerDashboard() {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalFoods: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboardStats();

      if (res.success) {
        setStats(res.stats);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back! Here's what's happening with your restaurants today.
          </p>
        </div>
        <button className="dashboard-btn">
          + Add Restaurant
        </button>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Restaurants"
          value={stats.totalRestaurants}
          color="#22c55e"
        />

        <StatsCard
          title="Foods"
          value={stats.totalFoods}
          color="#3b82f6"
        />

        <StatsCard
          title="Orders"
          value={stats.totalOrders}
          color="#f59e0b"
        />

        <StatsCard
          title="Revenue"
          value={`₹${stats.revenue}`}
          color="#ef4444"
        />

        <StatsCard
          title="Pending"
          value={stats.pendingOrders}
          color="#8b5cf6"
        />
      </div>

      <QuickActions />

      {/* Step 3: Integrated bottom grid layout for tracking metrics and orders */}
      <div className="dashboard-bottom">
        <RevenueChart />
        <RecentOrders />
      </div>

    </DashboardLayout>
  );
}

export default OwnerDashboard;
import "./Sidebar.css";
import { Link } from "react-router-dom";
// Step 5.1: Expanded icons import matrix list
import {
  FaHome,
  FaStore,
  FaUtensils,
  FaClipboardList,
  FaChartPie,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">
        Food<span>Hub</span>
      </h2>

      <nav>
        <Link to="/owner/dashboard">
          <FaHome />
          Dashboard
        </Link>

        {/* Updated Route Path */}
        <Link to="/owner/restaurants">
          <FaStore />
          My Restaurants
        </Link>

        <Link to="/owner/add-restaurant">
          <FaStore />
          Add Restaurant
        </Link>

        {/* Added Manage Foods Link */}
        <Link to="/owner/foods">
          <FaUtensils />
          Manage Foods
        </Link>

        <Link to="/owner/add-food">
          <FaUtensils />
          Add Food
        </Link>

        {/* ✅ FILE 2 — Commented out flat Orders link block to favor restaurant-wise navigation rules */}
        {/*
        <Link to="/owner/orders">
          <FaClipboardList />
          Orders
        </Link>
        */}

        {/* Step 5.2: Injected core system configuration menu pathways */}
        <Link to="/owner/analytics">
          <FaChartPie />
          Analytics
        </Link>

        <Link to="/owner/settings">
          <FaCog />
          Settings
        </Link>
      </nav>

      {/* Step 5.3: Replaced raw interactive elements with structured profile layout block */}
      <div className="sidebar-footer">
        
        <div className="owner-profile">
          <div className="owner-avatar">
            S
          </div>
          <div className="owner-info">
            <h4>Swapnil</h4>
            <p>Restaurant Owner</p>
          </div>
        </div>

        <button className="logout-btn">
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
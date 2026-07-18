import "../Sidebar/Sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaStore,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import { getUser, logout } from "../../../utils/auth";

function AdminSidebar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.full_name?.trim()?.[0]?.toUpperCase() || "A";

  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">
        Food<span>Hub</span>
      </h2>

      <nav>
        <Link to="/admin/dashboard">
          <FaHome />
          Dashboard
        </Link>

        <Link to="/admin/users">
          <FaUsers />
          Users
        </Link>

        <Link to="/admin/restaurants">
          <FaStore />
          Restaurants
        </Link>

        <Link to="/admin/orders">
          <FaClipboardList />
          Orders
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="owner-profile">
          <div className="owner-avatar">{initial}</div>
          <div className="owner-info">
            <h4>{user?.full_name || "Admin"}</h4>
            <p>Administrator</p>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;

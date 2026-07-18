import "./StatsCard.css";
import {
  FaStore,
  FaUtensils,
  FaClipboardList,
  FaRupeeSign,
  FaClock
} from "react-icons/fa";

function StatsCard({ title, value, color }) {

  const getIcon = () => {
    switch (title) {
      case "Restaurants":
        return <FaStore />;
      case "Foods":
        return <FaUtensils />;
      case "Orders":
        return <FaClipboardList />;
      case "Revenue":
        return <FaRupeeSign />;
      case "Pending":
      case "Pending Orders":
        return <FaClock />;
      default:
        return <FaStore />;
    }
  };

  return (
    <div
      className="stats-card"
      style={{ "--accent": color }}
    >
      <div className="stats-top">
        <div className="stats-icon">
          {getIcon()}
        </div>

        <span className="stats-badge">
          +12%
        </span>
      </div>

      <h2>{value}</h2>

      <h4>{title}</h4>

      <p>Updated just now</p>
    </div>
  );
}

export default StatsCard;
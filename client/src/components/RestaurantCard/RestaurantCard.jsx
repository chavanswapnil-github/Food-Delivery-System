import "./RestaurantCard.css";
import { API_BASE_URL } from "../../config";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaClock,
  FaHeart,
  FaMapMarkerAlt
} from "react-icons/fa";

function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="restaurant-card"
    >
      <div className="restaurant-image">

        <img
          src={`${API_BASE_URL}/uploads/${restaurant.logo}`}
          alt={restaurant.restaurant_name}
        />

        <span className="rating">
          <FaStar />
          4.8
        </span>

        <span className="delivery">
          <FaClock />
          30 min
        </span>

        <button className="wishlist">
          <FaHeart />
        </button>

      </div>

      <div className="restaurant-content">

        <h3>{restaurant.restaurant_name}</h3>

        <p className="description">
          {restaurant.description}
        </p>

        <div className="restaurant-footer">

          <span>
            <FaMapMarkerAlt />
            {restaurant.city}
          </span>

          <span className="price">
            ₹200 for two
          </span>

        </div>

        <button>
          View Menu →
        </button>

      </div>

    </Link>
  );
}

export default RestaurantCard;
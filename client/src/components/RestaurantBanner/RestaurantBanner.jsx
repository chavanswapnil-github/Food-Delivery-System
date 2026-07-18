import "./RestaurantBanner.css";
import { API_BASE_URL } from "../../config";
import {
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaMotorcycle
} from "react-icons/fa";

function RestaurantBanner({ restaurant }) {

  if (!restaurant) return null;

  return (

    <section className="restaurant-banner">

      <div className="banner-overlay">

        <div className="restaurant-left">

          <img
            className="restaurant-logo"
            src={`${API_BASE_URL}/uploads/${restaurant.logo}`}
            alt={restaurant.restaurant_name}
          />

          <div>

            <h1>{restaurant.restaurant_name}</h1>

            <p>{restaurant.description}</p>

            <div className="restaurant-meta">

              <span>
                <FaStar />
                4.8
              </span>

              <span>
                <FaClock />
                25-30 min
              </span>

              <span>
                <FaMotorcycle />
                Free Delivery
              </span>

              <span>
                <FaMapMarkerAlt />
                {restaurant.city}
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}

export default RestaurantBanner;
import "./FeaturedRestaurants.css";
import { useEffect, useState } from "react";
import RestaurantCard from "../RestaurantCard/RestaurantCard";
import { getRestaurants } from "../../services/restaurantService";

function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();

        // FIX
        setRestaurants(data.restaurants || []);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <section className="featured">
        {/* Updated header section for loading state */}
        <div className="featured-header">
          <h2>Featured Restaurants</h2>
          <p>Discover the highest rated restaurants near you</p>
        </div>
        <p style={{ color: "white", textAlign: "center" }}>
          Loading restaurants...
        </p>
      </section>
    );
  }

  return (
    <section className="featured">
      {/* Updated header section for default state */}
      <div className="featured-header">
        <h2>Featured Restaurants</h2>
        <p>Discover the highest rated restaurants near you</p>
      </div>

      <div className="featured-grid">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedRestaurants;
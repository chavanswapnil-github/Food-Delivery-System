import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import RestaurantCard from "../components/RestaurantCard/RestaurantCard";
import { searchRestaurants } from "../services/restaurantService";

function Search() {
  const { keyword } = useParams();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    loadResults();
  }, [keyword]);

  const loadResults = async () => {
    try {
      const res = await searchRestaurants(keyword);

      if (res.success) {
        setRestaurants(res.restaurants);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <h2>Search Results for "{keyword}"</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))
          ) : (
            <h3>No restaurants found.</h3>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
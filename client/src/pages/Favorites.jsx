import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Navbar from "../components/Navbar/Navbar";
import { getFavorites } from "../services/favoriteService";
import "./Favorites.css";

function Favorites() {

  const [foods, setFoods] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await getFavorites();
      setFoods(res.favorites || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="favorites-page">

        <h1>❤️ My Favorites</h1>

        <div className="favorite-grid">

          {foods.length === 0 ? (

            <div className="empty-favorite">
              No favorite foods yet.
            </div>

          ) : (

            foods.map(food => (

              <div className="favorite-card" key={food.id}>

                <img
                  src={`${API_BASE_URL}/uploads/${food.image}`}
                  alt={food.food_name}
                />

                <h3>{food.food_name}</h3>

                <p>{food.restaurant_name}</p>

                <strong>₹{food.price}</strong>

              </div>

            ))

          )}

        </div>

      </div>

    </>
  );
}

export default Favorites;
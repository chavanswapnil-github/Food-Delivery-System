import { useEffect, useState, useMemo, useRef } from "react"; 
import { API_BASE_URL } from "../config";
import { useParams } from "react-router-dom";
import { getRestaurantById } from "../services/restaurantService";
import { getFoodsByRestaurant } from "../services/foodService";

// ✅ Step 1 — Imported UI icons, core favorite workflow pipelines, and layout notifications
import { FaHeart, FaStar } from "react-icons/fa";
import { toggleFavorite } from "../services/favoriteService";
import { toast } from "react-toastify";

// ✅ Step 2.1 — Imported Review interaction ecosystem APIs
import {
  addReview,
  getRestaurantReviews,
  deleteReview,
} from "../services/reviewService";

// Layout Components and Stylesheets Imports
import Navbar from "../components/Navbar/Navbar";
import RestaurantBanner from "../components/RestaurantBanner/RestaurantBanner";
import CategoryTabs from "../components/CategoryTabs/CategoryTabs"; 
import CartSidebar from "../components/CartSidebar/CartSidebar"; 
import QuantityButton from "../components/QuantityButton/QuantityButton"; 
import "./RestaurantDetails.css";

function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All"); 

  // ✅ Step 2.2 — Injected local variables for review arrays and metrics engines
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState({ rating: 0, total: 0 });
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const restaurantData = await getRestaurantById(id);
      setRestaurant(restaurantData);

      const foodData = await getFoodsByRestaurant(id);
      setFoods(foodData);

      // ✅ Step 2.3 — Appended async payload receivers to load runtime customer feedback
      const reviewData = await getRestaurantReviews(id);
      setReviews(reviewData.reviews || []);
      setAverage(reviewData.average || { rating: 0, total: 0 });
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Step 2.4 — Injected review pipeline compilation submission handler
  const submitReview = async () => {
    try {
      await addReview({
        restaurant_id: id,
        rating,
        review,
      });

      toast.success("Review Submitted");
      setReview("");
      loadData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to submit"
      );
    }
  };

  const filteredFoods = useMemo(() => {
    if (activeCategory === "All") return foods;

    return foods.filter((food) => {
      if (!food.category) return true;
      return food.category === activeCategory;
    });
  }, [foods, activeCategory]);

  if (!restaurant) {
    return <h2 style={{ color: "white", padding: "40px" }}>Loading...</h2>;
  }

  return (
    <>
      <Navbar />

      <RestaurantBanner restaurant={restaurant} />

      <section className="restaurant-page">
        <div className="menu-header">
          <h2>Our Menu</h2>
          <p>
            Freshly prepared dishes made with premium ingredients.
          </p>
        </div>

        <CategoryTabs
          active={activeCategory}
          setActive={setActiveCategory}
        />

        {/* Opened the modern two-column layout wrapper */}
        <div className="restaurant-layout">
          
          <div className="foods-grid">
            {filteredFoods.map((food) => (
              /* ✅ Step 2 — Replaced food-card mapping wrapper block to hook up favorite action controls */
              <div className="food-card" key={food.id}>
                <button
                  className="favorite-btn"
                  onClick={async () => {
                    try {
                      const res = await toggleFavorite(food.id);
                      toast.success(
                        res.removed
                          ? "Removed from Favorites"
                          : "Added to Favorites"
                      );
                    } catch {
                      toast.error("Login to add favorites");
                    }
                  }}
                >
                  <FaHeart />
                </button>

                <img
                  src={`${API_BASE_URL}/uploads/${food.image}`}
                  alt={food.food_name}
                />

                <div className="food-content">
                  <h3>{food.food_name}</h3>
                  <p>{food.description}</p>

                  <div className="food-bottom">
                    <h4>₹{food.price}</h4>
                    {/* STEP 5: Passed food object into your interactive controller */}
                    <QuantityButton food={food} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Injected the live order Cart Sidebar */}
          <CartSidebar />

        </div> {/* Closed the restaurant-layout wrapper */}

        {/* ✅ Step 3 — Injected comprehensive multi-functional interactive customer feedback platform below menu grid layout split */}
        <section className="review-section">
          <h2>⭐ {average.rating || 0} ({average.total} Reviews)</h2>
          
          <div className="review-form">
            <h3>Write Review</h3>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value="5">★★★★★</option>
              <option value="4">★★★★☆</option>
              <option value="3">★★★☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="1">★☆☆☆☆</option>
            </select>
            <textarea
              placeholder="Share your experience"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <button onClick={submitReview}>Submit Review</button>
          </div>

          <div className="review-list">
            {reviews.map((r) => (
              <div className="review-card" key={r.id}>
                <div className="review-top">
                  <strong>{r.full_name}</strong>
                  <span style={{ color: "#fbbf24" }}>{"★".repeat(r.rating)}</span>
                </div>
                <p>{r.review}</p>
                {user?.id === r.user_id && (
                  <button
                    className="delete-review"
                    onClick={async () => {
                      try {
                        await deleteReview(r.id);
                        toast.success("Review deleted successfully");
                        loadData();
                      } catch (err) {
                        toast.error("Failed to delete review");
                      }
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

      </section>
    </>
  );
}

export default RestaurantDetails;
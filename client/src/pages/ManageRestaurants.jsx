import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom"; 
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout";
import Swal from "sweetalert2"; 
import { toast } from "react-toastify"; 
import { getOwnerRestaurants } from "../services/restaurantService"; 
import "./ManageRestaurants.css";

function ManageRestaurants() {
  const navigate = useNavigate(); 
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    restaurant_name: "",
    description: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await getOwnerRestaurants();
      if (res.success) {
        setRestaurants(res.restaurants);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load your restaurants.");
    }
  };

  const filtered = useMemo(() => {
    return restaurants.filter(r =>
      r.restaurant_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [restaurants, search]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Restaurant?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
      background: "#1e293b",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      setRestaurants(prev => prev.filter(r => r.id !== id));
      toast.success("Restaurant deleted successfully!");
    } catch {
      toast.error("Failed to delete restaurant.");
    }
  };

  const handleUpdate = async () => {
    if (!formData.restaurant_name || !formData.city || !formData.address) {
      toast.warning("Please fill out all required fields.");
      return;
    }
    try {
      toast.success("Restaurant Updated");
      setEditingRestaurant(null);
      loadRestaurants();
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="restaurant-header">
        <div>
          <h1>My Restaurants</h1>
          <p>Manage all your restaurants from one place.</p>
        </div>
        <button className="add-restaurant-btn">
          + Add Restaurant
        </button>
      </div>

      <div className="restaurant-toolbar">
        <input
          type="text"
          placeholder="Search restaurant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="restaurant-grid">
        {filtered.map((restaurant) => (
          <div
            className="restaurant-manage-card"
            key={restaurant.id}
          >
            <img
              src={`${API_BASE_URL}/uploads/${restaurant.logo}`}
              alt={restaurant.restaurant_name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
              }}
            />

            <div className="restaurant-body">
              <h3>{restaurant.restaurant_name}</h3>
              <p>{restaurant.city}</p>

              <div className="restaurant-stats">
                <span>🍔 {restaurant.foods || 0} Foods</span>
                <span>💰 ₹{restaurant.revenue || 0}</span>
              </div>

              <span
                className={
                  restaurant.status === "Active"
                    ? "status active"
                    : "status closed"
                }
              >
                {restaurant.status || "Active"}
              </span>

              <div className="restaurant-actions">
                <button
                  onClick={() => {
                    setEditingRestaurant(restaurant);
                    setFormData({
                      restaurant_name: restaurant.restaurant_name,
                      description: restaurant.description || "",
                      address: restaurant.address || "",
                      city: restaurant.city,
                    });
                  }}
                >
                  Edit
                </button>
                
                <button
                  onClick={() =>
                    navigate(`/owner/restaurants/${restaurant.id}/foods`)
                  }
                >
                  Manage Foods
                </button>
                
                {/* ✅ Added Orders View Route Portal */}
                <button
                  onClick={() =>
                    navigate(`/owner/restaurants/${restaurant.id}/orders`)
                  }
                >
                  Orders
                </button>
                
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(restaurant.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingRestaurant && (
        <div className="edit-modal">
          <div className="edit-box">
            <h2>Edit Restaurant</h2>
            <div className="input-group">
              <label>Restaurant Name</label>
              <input
                value={formData.restaurant_name}
                onChange={(e) => setFormData({ ...formData, restaurant_name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>City</label>
              <input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>
            <div className="input-group">
              <label>Detailed Address</label>
              <input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setEditingRestaurant(null)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageRestaurants;
import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom"; // Updated to include useNavigate
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout";
import "./ManageFoods.css";
// Swapped service method to use isolated restaurant lookup query matrices
import {
  getFoodsByRestaurant, 
  deleteFood,
  updateFood
} from "../services/foodService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function ManageFoods() {
  const { restaurantId } = useParams(); // Read the dynamic restaurant ID from URL parameters
  const navigate = useNavigate(); // Instantiated the navigation engine
  
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");

  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    food_name: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    loadFoods();
  }, [restaurantId]); // Re-run loader hook if restaurant parameters change

  const loadFoods = async () => {
    try {
      // Query menu assets filtered explicitly by the contextual restaurant target
      const data = await getFoodsByRestaurant(restaurantId); 
      setFoods(data || []);
    } catch (err) {
      console.log(err);
      toast.error("Unable to load foods for this restaurant");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Food?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      background: "#1e293b",
      color: "#fff"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteFood(id);
      if (res.success) {
        toast.success("Food Deleted");
        loadFoods(); 
      }
    } catch {
      toast.error("Delete Failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await updateFood(editingFood.id, formData);
      if (res.success) {
        toast.success("Food Updated");
        setEditingFood(null); 
        loadFoods(); 
      }
    } catch {
      toast.error("Update Failed");
    }
  };

  const filtered = useMemo(() => {
    return foods.filter(food =>
      food.food_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [foods, search]);

  return (
    <DashboardLayout>
      <div className="foods-header">
        <div>
          <h1>Food Management</h1>
          <p>Manage your menu items</p>
        </div>
        {/* Updated dynamic navigation tracking context for contextual menu creation */}
        <button 
          className="add-food-btn"
          onClick={() => navigate(`/owner/restaurants/${restaurantId}/add-food`)}
        >
          + Add Food
        </button>
      </div>

      <input
        className="food-search"
        placeholder="Search Food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="foods-grid">
        {filtered.length === 0 ? (
          <div style={{ color: "#94a3b8", gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
            <h3>No menu items found for this restaurant.</h3>
          </div>
        ) : (
          filtered.map(food => (
            <div
              className="food-manage-card"
              key={food.id}
            >
              <img
                src={`${API_BASE_URL}/uploads/${food.image}`}
                alt={food.food_name}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300?text=No+Food+Image";
                }}
              />

              <div className="food-body">
                <h3>{food.food_name}</h3>
                <p>{food.category}</p>
                <h4>₹{food.price}</h4>

                <span
                  className={
                    food.status === "Available"
                      ? "available"
                      : "stock"
                  }
                >
                  {food.status || "Available"}
                </span>

                <div className="food-actions">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      setEditingFood(food);
                      setFormData({
                        food_name: food.food_name,
                        description: food.description || "",
                        price: food.price,
                        category: food.category,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button>Duplicate</button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(food.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editingFood && (
        <div className="edit-modal">
          <div className="edit-box">
            <h2>Edit Food</h2>
            
            <input
              value={formData.food_name}
              onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
              placeholder="Food Name"
            />
            
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
              rows="3"
            />
            
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Price (₹)"
            />
            
            <input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Category"
            />
            
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setEditingFood(null)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleUpdate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageFoods;
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Imported useParams and useNavigate
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout";
import { addFood } from "../services/foodService";
import { toast } from "react-toastify"; // Swapped out simple alerts for toast

function AddFood() {
  const { restaurantId } = useParams(); // ✅ Step 3 — Extracted dynamic parameter context from routing URLs
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    food_name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // ✅ Step 3 — Injected clean parameter variables straight into the request body tracking context
      data.append("restaurant_id", restaurantId);
      data.append("food_name", formData.food_name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("image", formData.image);

      const response = await addFood(data);

      if (response.success || response.message) {
        toast.success(response.message || "Food Added Successfully!");
        // Redirect back to the food management view for this specific restaurant
        navigate(`/owner/restaurants/${restaurantId}/foods`);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to add food");
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "700px" }}>
        <h1>Add Food Item</h1>
        <button 
          onClick={() => navigate(`/owner/restaurants/${restaurantId}/foods`)}
          style={{ background: "#334155", color: "white", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          Back to Menu
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "700px",
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Note: The numeric manual input block for raw restaurant_ids has been removed safely here */}

        <input
          type="text"
          name="food_name"
          placeholder="Food Name"
          value={formData.food_name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Burger">Burger</option>
          <option value="Pizza">Pizza</option>
          <option value="Biryani">Biryani</option>
          <option value="Dessert">Dessert</option>
          <option value="Drinks">Drinks</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          style={{
            background: "#ff6b35",
            color: "white",
            padding: "15px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Save Food
        </button>
      </form>
    </DashboardLayout>
  );
}

export default AddFood;
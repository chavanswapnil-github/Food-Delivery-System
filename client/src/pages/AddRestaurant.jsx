import { useState } from "react";
import DashboardLayout from "../components/Dashboard/DashboardLayout/DashboardLayout";
import { addRestaurant } from "../services/restaurantService";
import "./AddRestaurant.css";

function AddRestaurant() {
  const [formData, setFormData] = useState({
    restaurant_name: "",
    description: "",
    address: "",
    city: "",
    logo: null,
    cover_image: null,
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

      // Temporarily hardcoded owner_id as 1
      data.append("owner_id", 1);
      data.append("restaurant_name", formData.restaurant_name);
      data.append("description", formData.description);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("logo", formData.logo);
      data.append("cover_image", formData.cover_image);

      const response = await addRestaurant(data);

      alert(response.data.message || "Restaurant Added Successfully");

      // Reset Form State
      setFormData({
        restaurant_name: "",
        description: "",
        address: "",
        city: "",
        logo: null,
        cover_image: null,
      });

      // Clear the file input fields in the DOM manually if needed
      e.target.reset();

    } catch (error) {
      console.error(error);
      alert("Failed to add restaurant");
    }
  };

  return (
    <DashboardLayout>
      <div className="add-restaurant">
        <h1>Add Restaurant</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="restaurant_name"
            value={formData.restaurant_name}
            placeholder="Restaurant Name"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            value={formData.description}
            placeholder="Description"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            value={formData.address}
            placeholder="Address"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            value={formData.city}
            placeholder="City"
            onChange={handleChange}
            required
          />

          <label>Restaurant Logo</label>
          <input
            type="file"
            name="logo"
            onChange={handleChange}
            accept="image/*"
          />

          <label>Cover Image</label>
          <input
            type="file"
            name="cover_image"
            onChange={handleChange}
            accept="image/*"
          />

          <button type="submit">
            Save Restaurant
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default AddRestaurant;
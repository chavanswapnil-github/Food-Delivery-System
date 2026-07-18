import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/foods`;

// Get all foods
export const getFoods = async () => {
  const response = await axios.get(API);
  return response.data;
};

// Get foods by restaurant
export const getFoodsByRestaurant = async (restaurantId) => {
  const response = await axios.get(`${API}/restaurant/${restaurantId}`);
  return response.data.foods;
};

// Add food
export const addFood = async (formData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 🚀 STEP 4 — Appended Network Request to query Secured Owner API Pipeline
export const getOwnerFoods = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API}/owner`, {
      headers: {
          Authorization: `Bearer ${token}`
      }
  });
  return response.data;
};

// Update food
export const updateFood = async (id, food) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API}/${id}`, food, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete food
export const deleteFood = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
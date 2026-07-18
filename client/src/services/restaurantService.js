import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/restaurants`;

// Get all restaurants
export const getRestaurants = async () => {
  const response = await axios.get(API);
  return response.data;
};

// Get restaurant by id
export const getRestaurantById = async (id) => {
  const response = await axios.get(`${API}/${id}`);
  return response.data.restaurant;
};

// Add restaurant
export const addRestaurant = async (formData) => {
  const response = await axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Search restaurants
export const searchRestaurants = async (keyword) => {
  const response = await axios.get(`${API}/search/${keyword}`);
  return response.data.restaurants;
};

// Get all restaurants owned by the logged-in user
export const getOwnerRestaurants = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API}/owner`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete Restaurant
export const deleteRestaurant = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 🚀 Step 4 — Added Update Utility mapping context inside persistence layer
export const updateRestaurant = async (id, data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
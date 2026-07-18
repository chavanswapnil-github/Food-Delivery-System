import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/reviews`;

const config = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const addReview = async (data) => {
  const res = await axios.post(API, data, config());
  return res.data;
};

export const getRestaurantReviews = async (restaurantId) => {
  const res = await axios.get(`${API}/${restaurantId}`);
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await axios.delete(`${API}/${id}`, config());
  return res.data;
};
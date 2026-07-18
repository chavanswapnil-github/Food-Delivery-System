import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/favorites`;

const config = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getFavorites = async () => {
  const res = await axios.get(API, config());
  return res.data;
};

export const toggleFavorite = async (foodId) => {
  const res = await axios.post(
    `${API}/${foodId}`,
    {},
    config()
  );
  return res.data;
};
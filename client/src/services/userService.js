import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/users`;

// Get Profile
export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Update Profile
export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API}/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
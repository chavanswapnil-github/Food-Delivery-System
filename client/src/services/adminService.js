import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/admin`;

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ================= ANALYTICS =================

export const getAnalytics = async () => {
  const res = await axios.get(`${API}/analytics`, getHeaders());
  return res.data;
};

// ================= USERS =================

export const getAllUsers = async () => {
  const res = await axios.get(`${API}/users`, getHeaders());
  return res.data;
};

export const setUserStatus = async (id, status) => {
  const res = await axios.put(
    `${API}/users/${id}/status`,
    { status },
    getHeaders()
  );
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API}/users/${id}`, getHeaders());
  return res.data;
};

// ================= RESTAURANTS =================

export const getAllRestaurantsAdmin = async () => {
  const res = await axios.get(`${API}/restaurants`, getHeaders());
  return res.data;
};

export const setRestaurantStatus = async (id, status) => {
  const res = await axios.put(
    `${API}/restaurants/${id}/status`,
    { status },
    getHeaders()
  );
  return res.data;
};

export const deleteRestaurantAdmin = async (id) => {
  const res = await axios.delete(`${API}/restaurants/${id}`, getHeaders());
  return res.data;
};

// ================= ORDERS =================

export const getAllOrdersAdmin = async () => {
  const res = await axios.get(`${API}/orders`, getHeaders());
  return res.data;
};

export const getOrderItemsAdmin = async (id) => {
  const res = await axios.get(`${API}/orders/${id}/items`, getHeaders());
  return res.data;
};

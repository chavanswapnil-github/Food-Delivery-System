import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/addresses`;

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Get all addresses
export const getAddresses = async () => {
  const res = await axios.get(API, getHeaders());
  return res.data;
};

// Add address
export const addAddress = async (data) => {
  const res = await axios.post(API, data, getHeaders());
  return res.data;
};

// Update address
export const updateAddress = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, getHeaders());
  return res.data;
};

// Delete address
export const deleteAddress = async (id) => {
  const res = await axios.delete(`${API}/${id}`, getHeaders());
  return res.data;
};

// Set default address
// ✅ Updated request routing token hierarchy to prepend the action prefix sub-resource string
export const setDefaultAddress = async (id) => {
  const res = await axios.put(
    `${API}/default/${id}`,
    {},
    getHeaders()
  );
  return res.data;
};
import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/payment`;

const config = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createPayment = async (amount) => {
  const res = await axios.post(
    `${API}/create`,
    { amount },
    config()
  );

  return res.data;
};

export const verifyPayment = async (data) => {
  const res = await axios.post(
    `${API}/verify`,
    data,
    config()
  );

  return res.data;
};
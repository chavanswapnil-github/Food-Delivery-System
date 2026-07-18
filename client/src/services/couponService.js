import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/coupons`;

export const getCoupons = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const applyCoupon = async (code, total) => {
  const res = await axios.post(`${API}/apply`, {
    code,
    total,
  });

  return res.data;
};
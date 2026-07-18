import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/dashboard`;

export const getDashboardStats = async () => {
  const response = await axios.get(`${API}/stats`);
  return response.data;
};
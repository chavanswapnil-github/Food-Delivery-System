import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/orders`;

const config = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ================= PLACE ORDER =================

export const placeOrder = async (orderData) => {
  const res = await axios.post(
    API,
    orderData,
    config()
  );

  return res.data;
};

// ================= MY ORDERS =================

export const getMyOrders = async () => {
  const res = await axios.get(
    API,
    config()
  );

  return res.data.orders;
};

// ================= ORDER DETAILS =================

export const getOrderById = async (id) => {
  const res = await axios.get(
    `${API}/${id}`,
    config()
  );

  return res.data.order;
};

// ================= CANCEL ORDER =================

export const cancelOrder = async (id) => {
  const res = await axios.put(
    `${API}/${id}/cancel`,
    {},
    config()
  );

  return res.data;
};

// ================= OWNER ORDERS =================

// ✅ Injected: Fetches incoming order history pipelines localized to a single store boundary
export const getRestaurantOrders = async (restaurantId) => {
  const res = await axios.get(
    `${API}/restaurant/${restaurantId}`,
    config()
  );

  return res.data;
};

// ✅ Injected: Updates logistical fullfilment steps (e.g., Pending -> Preparing -> Out for Delivery)
export const updateOrderStatus = async (orderId, status) => {
  const res = await axios.put(
    `${API}/${orderId}/status`,
    { status },
    config()
  );

  return res.data;
};

// ✅ Injected: Extracts comprehensive tracking data structures for a target receipt frame
export const getOrderDetails = async (id) => {
  const res = await axios.get(
    `${API}/${id}`,
    config()
  );

  return res.data;
};

// ✅ Injected: Sub-resource utility fetching food item breakdowns inside a target purchase confirmation
export const getOrderItems = async (id) => {
  const res = await axios.get(
    `${API}/${id}/items`,
    config()
  );

  return res.data;
};
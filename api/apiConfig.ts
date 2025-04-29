import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEV_IP_ADDRESS, API_ENDPOINTS } from "../utils/config/env";

// Base API configuration
// Environment-specific configuration
const getBaseUrl = () => {
  if (__DEV__) {
    // Development environment - use local IP address from env config
    return `http://${DEV_IP_ADDRESS}:3001`;
  }
  // Production environment
  return "https://api.yourappdomain.com"; // Change this to your production API URL
};

const API_BASE_URL = getBaseUrl();

console.log("Using API URL:", API_BASE_URL); // For debugging

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Increase timeout for slower connections or when debugging
  timeout: 30000,
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Error setting auth token:", e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle token expired errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("API Error:", error.message);

    // Network errors handling
    if (error.message === "Network Error") {
      console.log("Network error - cannot connect to:", API_BASE_URL);
      console.log("Make sure:");
      console.log("1. Your phone and computer are on the same WiFi network");
      console.log("2. Your backend server is running on port 3001");
      console.log(
        "3. Your computer firewall allows incoming connections to port 3001"
      );
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("user");
      // You could redirect to login screen here if needed
    }
    return Promise.reject(error);
  }
);

export default api;

import api from "./apiConfig";
import { AuthResponse, LoginDTO, RegisterDTO } from "../types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/user";
import { API_ENDPOINTS } from "../utils/config/env";

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Store token and user in AsyncStorage
      await AsyncStorage.setItem("access_token", response.data.access_token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);

      // Check for specific error codes
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password");
      } else if (error.response?.status === 404) {
        throw new Error("User not found. Please register first");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterDTO): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );

      // Store token and user in AsyncStorage
      await AsyncStorage.setItem("access_token", response.data.access_token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      console.error("Registration error:", error);

      // Check for specific error codes
      if (error.response?.status === 409) {
        throw new Error(
          "Email already exists. Please use a different email or try logging in."
        );
      } else if (error.response?.data?.message) {
        // Handle backend validation errors
        if (Array.isArray(error.response.data.message)) {
          throw new Error(error.response.data.message.join(". "));
        } else {
          throw new Error(error.response.data.message);
        }
      }

      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if your API supports it
      // await api.post(API_ENDPOINTS.AUTH.LOGOUT);

      // Remove all auth-related data from storage
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("user_data");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("access_token");
      return !!token;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  },

  /**
   * Validate if the current token is still valid
   * For now, we'll assume the token is valid if it exists
   * Token validity will be checked when making actual API calls
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("access_token");
      return !!token;
    } catch (error: any) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  /**
   * Get current user from storage
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem("user");
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  },
};

export default authService;

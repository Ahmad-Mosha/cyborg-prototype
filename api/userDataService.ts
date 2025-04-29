import api from "./apiConfig";
import { UserData, UserDataResponse } from "../types/userData";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userDataService = {
  /**
   * Save user data from onboarding
   */
  async saveUserData(userData: UserData): Promise<UserDataResponse> {
    try {
      // Log the data being sent to debug the issue
      console.log("Sending user data to backend:", userData);

      // Ensure fitnessGoals is a string, not an array
      const formattedData = { ...userData };

      // Convert arrays to proper format if needed
      if (Array.isArray(formattedData.fitnessGoals)) {
        formattedData.fitnessGoals = (
          formattedData.fitnessGoals as unknown as string[]
        ).join(", ");
      }

      // Format data to match backend expectations
      const response = await api.post<UserDataResponse>(
        "/user-data",
        formattedData
      );

      // Log the response for debugging
      console.log("User data saved successfully, response:", response.data);

      // Store user data in local storage for offline access
      await AsyncStorage.setItem("user_data", JSON.stringify(response.data));

      return response.data;
    } catch (error: any) {
      console.error("Save user data error:", error);

      // Log more details about the error for debugging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

      throw error;
    }
  },

  /**
   * Get user data from storage or server
   */
  async getUserData(): Promise<UserDataResponse | null> {
    try {
      // First try to get from local storage
      const userDataJson = await AsyncStorage.getItem("user_data");
      if (userDataJson) {
        return JSON.parse(userDataJson);
      }

      // If not in storage, try to get from server
      try {
        const response = await api.get<UserDataResponse>("/user-data");

        // Store for future use
        await AsyncStorage.setItem("user_data", JSON.stringify(response.data));

        return response.data;
      } catch (error) {
        // If server request fails, return null
        console.error("Get user data from server error:", error);
        return null;
      }
    } catch (error) {
      console.error("Get user data error:", error);
      return null;
    }
  },

  /**
   * Update user data
   */
  async updateUserData(userData: Partial<UserData>): Promise<UserDataResponse> {
    try {
      const response = await api.patch<UserDataResponse>(
        "/user-data",
        userData
      );

      // Update local storage
      await AsyncStorage.setItem("user_data", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      console.error("Update user data error:", error);
      throw error;
    }
  },
};

export default userDataService;

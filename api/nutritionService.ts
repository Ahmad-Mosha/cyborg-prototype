import api from "./apiConfig";
import {
  CreateMealPlanRequest,
  CreateMealRequest,
  UpdateMealRequest,
  MealPlan,
  MealPlansResponse,
  BackendMeal,
  USDAFoodSearchResponse,
  AddFoodToMealRequest,
  MealFood,
} from "@/types/diet";

const nutritionService = {
  // Create a new meal plan
  createMealPlan: async (data: CreateMealPlanRequest): Promise<MealPlan> => {
    try {
      const response = await api.post("/nutrition/meal-plans", data);
      return response.data;
    } catch (error) {
      console.error("Error creating meal plan:", error);
      throw error;
    }
  },

  // Get all meal plans with pagination
  getMealPlans: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<MealPlansResponse> => {
    try {
      const response = await api.get("/nutrition/meal-plans", {
        params: {
          page,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching meal plans:", error);
      throw error;
    }
  },

  // Get a specific meal plan by ID
  getMealPlan: async (id: string): Promise<MealPlan> => {
    try {
      const response = await api.get(`/nutrition/meal-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      throw error;
    }
  },

  // Update a meal plan
  updateMealPlan: async (
    id: string,
    data: Partial<CreateMealPlanRequest>
  ): Promise<MealPlan> => {
    try {
      const response = await api.put(`/nutrition/meal-plans/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating meal plan:", error);
      throw error;
    }
  },

  // Delete a meal plan
  deleteMealPlan: async (id: string): Promise<void> => {
    try {
      await api.delete(`/nutrition/meal-plans/${id}`);
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      throw error;
    }
  },

  // Mark a meal as eaten (legacy - use toggleMealEaten instead)
  markMealAsEaten: async (mealId: string): Promise<BackendMeal> => {
    try {
      const response = await api.put(`/nutrition/meals/${mealId}/toggle-eaten`);
      return response.data;
    } catch (error) {
      console.error("Error marking meal as eaten:", error);
      throw error;
    }
  },

  // Mark a meal as eaten (toggle)
  toggleMealEaten: async (mealId: string): Promise<BackendMeal> => {
    try {
      console.log("🔧 API: Calling toggle-eaten endpoint for meal:", mealId);
      const response = await api.put(`/nutrition/meals/${mealId}/toggle-eaten`);

      console.log("🔧 API: Raw response:", response);
      console.log("🔧 API: Response data:", response.data);
      console.log("🔧 API: Response status:", response.status);

      if (
        typeof response.data === "boolean" ||
        response.data === false ||
        response.data === true
      ) {
        console.log(
          "⚠️ API: Backend returned boolean, fetching updated meal..."
        );

        // Backend returned boolean, so we need to fetch the updated meal
        // Try to get the meal from the current meal plan
        try {
          const mealPlansResponse = await api.get("/nutrition/meal-plans", {
            params: { page: 1, pageSize: 1 },
          });

          if (mealPlansResponse.data.data.length > 0) {
            const mealPlanResponse = await api.get(
              `/nutrition/meal-plans/${mealPlansResponse.data.data[0].id}`
            );
            const updatedMeal = mealPlanResponse.data.meals?.find(
              (meal: any) => meal.id === mealId
            );

            if (updatedMeal) {
              console.log("✅ API: Found updated meal:", updatedMeal);
              return updatedMeal;
            }
          }
        } catch (fetchError) {
          console.error("Error fetching updated meal:", fetchError);
        }

        // Fallback: return a mock object with toggled status
        console.log("⚠️ API: Using fallback - creating mock updated meal");
        return {
          id: mealId,
          eaten: response.data, // Use the boolean response as the eaten status
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          name: "Unknown Meal",
          targetCalories: 0,
          nutritionGoals: { protein: 0, carbs: 0, fat: 0 },
          targetTime: "00:00",
          eatenAt: response.data ? new Date().toISOString() : null,
          nutrients: {
            calories: null,
            protein: null,
            carbohydrates: null,
            fat: null,
            fiber: null,
            sugar: null,
            sodium: null,
            cholesterol: null,
          },
          mealFoods: [],
        };
      }

      return response.data;
    } catch (error) {
      console.error("Error toggling meal eaten status:", error);
      throw error;
    }
  },

  // Add a meal to a meal plan
  addMealToPlan: async (
    planId: string,
    mealData: CreateMealRequest
  ): Promise<BackendMeal> => {
    try {
      const response = await api.post(
        `/nutrition/meal-plans/${planId}/meals`,
        mealData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding meal to plan:", error);
      throw error;
    }
  },

  // Update a meal
  updateMeal: async (
    mealId: string,
    mealData: UpdateMealRequest
  ): Promise<BackendMeal> => {
    try {
      const response = await api.put(`/nutrition/meals/${mealId}`, mealData);
      return response.data;
    } catch (error) {
      console.error("Error updating meal:", error);
      throw error;
    }
  },

  // Delete a meal
  deleteMeal: async (mealId: string): Promise<void> => {
    try {
      await api.delete(`/nutrition/meals/${mealId}`);
    } catch (error) {
      console.error("Error deleting meal:", error);
      throw error;
    }
  },

  // Get meals for a specific meal plan
  getMealsForPlan: async (planId: string): Promise<BackendMeal[]> => {
    try {
      const response = await api.get(`/nutrition/meal-plans/${planId}/meals`);
      return response.data;
    } catch (error) {
      console.error("Error fetching meals for plan:", error);
      throw error;
    }
  },

  // Get today's meals (assuming there's an endpoint for this)
  getTodaysMeals: async (): Promise<BackendMeal[]> => {
    try {
      const response = await api.get("/nutrition/meals/today");
      return response.data;
    } catch (error) {
      console.error("Error fetching today's meals:", error);
      throw error;
    }
  },

  // Search USDA foods
  searchUSDAFoods: async (
    query: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<USDAFoodSearchResponse> => {
    try {
      const response = await api.get("/foods/search", {
        params: {
          query,
          page,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching USDA foods:", error);
      throw error;
    }
  },

  // Get USDA food details by ID
  getUSDAFoodById: async (usdaId: string) => {
    try {
      const response = await api.get(`/foods/${usdaId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching USDA food details:", error);
      throw error;
    }
  },

  // Add food to meal
  addFoodToMeal: async (
    mealId: string,
    foodData: AddFoodToMealRequest
  ): Promise<MealFood> => {
    try {
      const response = await api.post(
        `/nutrition/meals/${mealId}/foods`,
        foodData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding food to meal:", error);
      throw error;
    }
  },

  // Remove food from meal
  removeFoodFromMeal: async (mealId: string, foodId: string): Promise<void> => {
    try {
      await api.delete(`/nutrition/meals/${mealId}/foods/${foodId}`);
    } catch (error) {
      console.error("Error removing food from meal:", error);
      throw error;
    }
  },

  // Get foods for a meal
  getMealFoods: async (mealId: string): Promise<MealFood[]> => {
    try {
      const response = await api.get(`/nutrition/meals/${mealId}/foods`);
      return response.data;
    } catch (error) {
      console.error("Error fetching meal foods:", error);
      throw error;
    }
  },

  // Update food quantity in meal
  updateMealFood: async (
    mealId: string,
    foodId: string,
    quantity: number,
    unit: string
  ): Promise<MealFood> => {
    try {
      const response = await api.put(
        `/nutrition/meals/${mealId}/foods/${foodId}`,
        { quantity, unit }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating meal food:", error);
      throw error;
    }
  },
};

export default nutritionService;

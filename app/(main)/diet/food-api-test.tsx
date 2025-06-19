import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { nutritionService } from "@/api";
import { USDAFood } from "@/types/diet";

export default function FoodSearchTestScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("egg");
  const [searchResults, setSearchResults] = useState<USDAFood[]>([]);

  const addTestResult = (result: string) => {
    setTestResults((prev) => [result, ...prev]);
  };

  const testSearchUSDAFoods = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing USDA Food Search...");

      const response = await nutritionService.searchUSDAFoods(
        searchQuery,
        1,
        10
      );
      addTestResult(`✅ Found ${response.foods.length} foods`);
      addTestResult(
        `📄 Page ${response.currentPage} of ${response.totalPages}`
      );

      if (response.foods.length > 0) {
        const firstFood = response.foods[0];
        addTestResult(`🥗 First result: "${firstFood.name}"`);
        addTestResult(
          `🔥 Calories: ${firstFood.calories} per ${firstFood.servingSize}${firstFood.servingUnit}`
        );
        addTestResult(`🍖 Protein: ${firstFood.protein}g`);
        addTestResult(`🍞 Carbs: ${firstFood.carbohydrates}g`);
        addTestResult(`🧈 Fat: ${firstFood.fat}g`);
        setSearchResults(response.foods.slice(0, 5)); // Show first 5 results
      }
    } catch (error: any) {
      addTestResult(`❌ Error searching foods: ${error.message}`);
      console.error("Search foods error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testGetFoodDetails = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing Get Food Details...");

      // First search for a food to get an ID
      const searchResponse = await nutritionService.searchUSDAFoods(
        "chicken",
        1,
        1
      );
      if (searchResponse.foods.length === 0) {
        addTestResult("⚠️ No foods found to test details");
        return;
      }

      const food = searchResponse.foods[0];
      const details = await nutritionService.getUSDAFoodById(food.usdaId);
      addTestResult(`✅ Got details for: ${details.name || "Unknown"}`);
      addTestResult(`📊 USDA ID: ${food.usdaId}`);
    } catch (error: any) {
      addTestResult(`❌ Error getting food details: ${error.message}`);
      console.error("Get food details error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testAddFoodToMeal = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing Add Food to Meal...");

      // First need to get a meal plan and meal
      const plans = await nutritionService.getMealPlans(1, 1);
      if (plans.data.length === 0) {
        addTestResult("⚠️ No meal plans found. Create one first.");
        return;
      }

      const planDetail = await nutritionService.getMealPlan(plans.data[0].id);
      if (!planDetail.meals || planDetail.meals.length === 0) {
        addTestResult("⚠️ No meals found in plan.");
        return;
      }

      // Get a food to add
      const searchResponse = await nutritionService.searchUSDAFoods(
        "apple",
        1,
        1
      );
      if (searchResponse.foods.length === 0) {
        addTestResult("⚠️ No foods found to add");
        return;
      }

      const food = searchResponse.foods[0];
      const meal = planDetail.meals[0];

      const result = await nutritionService.addFoodToMeal(meal.id, {
        usdaId: food.usdaId,
        quantity: 100,
        unit: "g",
      });

      addTestResult(`✅ Added food to meal: ${result.name}`);
      addTestResult(`📊 Quantity: ${result.quantity}${result.unit}`);
      addTestResult(`🔥 Calories: ${result.calories}`);
    } catch (error: any) {
      addTestResult(`❌ Error adding food to meal: ${error.message}`);
      console.error("Add food to meal error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testUpdateMeal = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing Update Meal...");

      // First get a meal to update
      const plans = await nutritionService.getMealPlans(1, 1);
      if (plans.data.length === 0) {
        addTestResult("⚠️ No meal plans found. Create one first.");
        return;
      }

      const planDetail = await nutritionService.getMealPlan(plans.data[0].id);
      if (!planDetail.meals || planDetail.meals.length === 0) {
        addTestResult("⚠️ No meals found in plan.");
        return;
      }

      const meal = planDetail.meals[0];
      const updatedMeal = await nutritionService.updateMeal(meal.id, {
        name: `Updated ${meal.name}`,
        targetCalories: meal.targetCalories + 50,
        nutritionGoals: {
          protein: 30,
          carbs: 40,
          fat: 30,
        },
      });

      addTestResult(`✅ Updated meal: ${updatedMeal.name}`);
      addTestResult(`🔥 New calories: ${updatedMeal.targetCalories}`);
      addTestResult(`🍖 Protein goal: ${updatedMeal.nutritionGoals.protein}%`);
    } catch (error: any) {
      addTestResult(`❌ Error updating meal: ${error.message}`);
      console.error("Update meal error:", error);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    addTestResult("🚀 Starting food and meal update tests...");

    await testSearchUSDAFoods();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testGetFoodDetails();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testUpdateMeal();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testAddFoodToMeal();

    addTestResult("🏁 All tests completed!");
  };

  const clearResults = () => {
    setTestResults([]);
    setSearchResults([]);
  };

  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 30 }} className="px-6 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className={
              isDark
                ? "bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
                : "bg-white w-10 h-10 rounded-full items-center justify-center shadow border border-light-300"
            }
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={isDark ? "#FFFFFF" : "#121212"}
            />
          </TouchableOpacity>
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold"
                : "text-dark-900 text-lg font-bold"
            }
          >
            Food & Meal Tests
          </Text>
          <TouchableOpacity onPress={clearResults}>
            <Ionicons
              name="refresh"
              size={20}
              color={isDark ? "#BBFD00" : "#FF4B26"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Search Query Input */}
        <View className="mb-4">
          <Text
            className={
              isDark ? "text-white text-sm mb-2" : "text-dark-900 text-sm mb-2"
            }
          >
            Search Query for Testing
          </Text>
          <TextInput
            className={
              isDark
                ? "bg-dark-800 border border-dark-700 rounded-xl p-3 text-white"
                : "bg-white border border-light-300 rounded-xl p-3 text-dark-900"
            }
            placeholder="Enter food name..."
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Test Buttons */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={testSearchUSDAFoods}
            disabled={loading}
            className={
              isDark
                ? "bg-dark-800 rounded-2xl py-3 flex-row justify-center items-center border border-dark-700 mb-2"
                : "bg-white rounded-2xl py-3 flex-row justify-center items-center border border-light-300 mb-2 shadow"
            }
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={isDark ? "#BBFD00" : "#FF4B26"}
            />
            <Text
              className={
                isDark
                  ? "text-white font-medium ml-2"
                  : "text-dark-900 font-medium ml-2"
              }
            >
              Test USDA Food Search
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testGetFoodDetails}
            disabled={loading}
            className={
              isDark
                ? "bg-dark-800 rounded-2xl py-3 flex-row justify-center items-center border border-dark-700 mb-2"
                : "bg-white rounded-2xl py-3 flex-row justify-center items-center border border-light-300 mb-2 shadow"
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={isDark ? "#BBFD00" : "#FF4B26"}
            />
            <Text
              className={
                isDark
                  ? "text-white font-medium ml-2"
                  : "text-dark-900 font-medium ml-2"
              }
            >
              Test Get Food Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testUpdateMeal}
            disabled={loading}
            className={
              isDark
                ? "bg-dark-800 rounded-2xl py-3 flex-row justify-center items-center border border-dark-700 mb-2"
                : "bg-white rounded-2xl py-3 flex-row justify-center items-center border border-light-300 mb-2 shadow"
            }
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={isDark ? "#BBFD00" : "#FF4B26"}
            />
            <Text
              className={
                isDark
                  ? "text-white font-medium ml-2"
                  : "text-dark-900 font-medium ml-2"
              }
            >
              Test Update Meal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testAddFoodToMeal}
            disabled={loading}
            className={
              isDark
                ? "bg-dark-800 rounded-2xl py-3 flex-row justify-center items-center border border-dark-700 mb-2"
                : "bg-white rounded-2xl py-3 flex-row justify-center items-center border border-light-300 mb-2 shadow"
            }
          >
            <Ionicons
              name="add-outline"
              size={18}
              color={isDark ? "#BBFD00" : "#FF4B26"}
            />
            <Text
              className={
                isDark
                  ? "text-white font-medium ml-2"
                  : "text-dark-900 font-medium ml-2"
              }
            >
              Test Add Food to Meal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={runAllTests}
            disabled={loading}
            className={
              isDark
                ? "bg-primary rounded-2xl py-4 flex-row justify-center items-center mb-2"
                : "bg-primary rounded-2xl py-4 flex-row justify-center items-center mb-2"
            }
          >
            <Ionicons name="play-outline" size={18} color="#000000" />
            <Text className="text-black font-bold ml-2">Run All Tests</Text>
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View className="mb-6">
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold mb-3"
                  : "text-dark-900 text-lg font-bold mb-3"
              }
            >
              Search Results Preview
            </Text>
            {searchResults.map((food, index) => (
              <View
                key={`${food.usdaId}-${index}`}
                className={
                  isDark
                    ? "bg-dark-800 rounded-xl p-3 mb-2 border border-dark-700"
                    : "bg-white rounded-xl p-3 mb-2 border border-light-300"
                }
              >
                <Text
                  className={
                    isDark
                      ? "text-white font-medium"
                      : "text-dark-900 font-medium"
                  }
                >
                  {food.name}
                </Text>
                <Text
                  className={
                    isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
                  }
                >
                  {food.calories} cal • {food.protein}g protein •{" "}
                  {food.carbohydrates}g carbs • {food.fat}g fat
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Loading Indicator */}
        {loading && (
          <View className="flex-row justify-center items-center py-4">
            <ActivityIndicator size="large" color="#BBFD00" />
            <Text className={isDark ? "text-white ml-2" : "text-dark-900 ml-2"}>
              Running tests...
            </Text>
          </View>
        )}

        {/* Test Results */}
        <View className="mb-6">
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold mb-3"
                : "text-dark-900 text-lg font-bold mb-3"
            }
          >
            Test Results
          </Text>
          <View
            className={
              isDark
                ? "bg-dark-800 rounded-xl p-4 border border-dark-700"
                : "bg-white rounded-xl p-4 border border-light-300"
            }
          >
            {testResults.length === 0 ? (
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-center"
                    : "text-gray-600 text-center"
                }
              >
                No test results yet. Run a test to see results.
              </Text>
            ) : (
              testResults.map((result, index) => (
                <Text
                  key={index}
                  className={
                    isDark
                      ? "text-white text-sm mb-1 font-mono"
                      : "text-dark-900 text-sm mb-1 font-mono"
                  }
                >
                  {result}
                </Text>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

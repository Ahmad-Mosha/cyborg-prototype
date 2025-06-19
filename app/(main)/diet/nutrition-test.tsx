import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { nutritionService } from "@/api";
import { CreateMealPlanRequest } from "@/types/diet";

export default function NutritionTestScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults((prev) => [result, ...prev]);
  };

  const testCreateMealPlan = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing Create Meal Plan...");

      const testPlan: CreateMealPlanRequest = {
        name: "Test Plan",
        description: "Test plan for API validation",
        targetCalories: 2000,
        startDate: "2024-03-10",
        endDate: "2024-04-10",
        calorieDistribution: [
          { mealName: "Breakfast", percentage: 25 },
          { mealName: "Lunch", percentage: 40 },
          { mealName: "Dinner", percentage: 35 },
        ],
        createMealsAutomatically: true,
      };

      const result = await nutritionService.createMealPlan(testPlan);
      addTestResult(`✅ Created meal plan: ${result.name} (ID: ${result.id})`);
      addTestResult(`📊 Total meals created: ${result.meals?.length || 0}`);

      return result;
    } catch (error: any) {
      addTestResult(`❌ Error creating meal plan: ${error.message}`);
      console.error("Create meal plan error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testGetMealPlans = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing Get Meal Plans...");

      const result = await nutritionService.getMealPlans(1, 10);
      addTestResult(`✅ Retrieved ${result.data.length} meal plans`);
      addTestResult(`📄 Page ${result.meta.page} of ${result.meta.totalPages}`);
      addTestResult(`📊 Total: ${result.meta.total} plans`);

      if (result.data.length > 0) {
        const firstPlan = result.data[0];
        addTestResult(
          `🍽️ First plan: "${firstPlan.name}" - ${firstPlan.targetCalories} kcal`
        );
      }
    } catch (error: any) {
      addTestResult(`❌ Error getting meal plans: ${error.message}`);
      console.error("Get meal plans error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testGetMealPlan = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing Get Single Meal Plan...");

      // First get all plans to find one to test with
      const plans = await nutritionService.getMealPlans(1, 1);
      if (plans.data.length === 0) {
        addTestResult("⚠️ No meal plans found. Create one first.");
        return;
      }

      const planId = plans.data[0].id;
      const result = await nutritionService.getMealPlan(planId);
      addTestResult(`✅ Retrieved meal plan: ${result.name}`);
      addTestResult(`🍽️ Meals in plan: ${result.meals?.length || 0}`);

      if (result.meals && result.meals.length > 0) {
        const firstMeal = result.meals[0];
        addTestResult(
          `🥗 First meal: "${firstMeal.name}" - ${firstMeal.targetCalories} kcal`
        );
      }
    } catch (error: any) {
      addTestResult(`❌ Error getting meal plan: ${error.message}`);
      console.error("Get meal plan error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testMarkMealAsEaten = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing Mark Meal as Eaten...");

      // First get a meal plan with meals
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

      const firstMeal = planDetail.meals[0];
      const result = await nutritionService.markMealAsEaten(firstMeal.id);
      addTestResult(`✅ Marked meal as eaten: ${result.name}`);
      addTestResult(`🔄 Eaten status: ${result.eaten ? "Yes" : "No"}`);
      if (result.eatenAt) {
        addTestResult(
          `⏰ Eaten at: ${new Date(result.eatenAt).toLocaleString()}`
        );
      }
    } catch (error: any) {
      addTestResult(`❌ Error marking meal as eaten: ${error.message}`);
      console.error("Mark meal as eaten error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testAddMeal = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing Add Meal to Plan...");

      // First get a meal plan to add a meal to
      const plans = await nutritionService.getMealPlans(1, 1);
      if (plans.data.length === 0) {
        addTestResult("⚠️ No meal plans found. Create one first.");
        return;
      }

      const planId = plans.data[0].id;
      const testMeal = {
        name: "Test Breakfast",
        targetTime: "08:00",
        targetCalories: 400,
        nutritionGoals: {
          protein: 25,
          carbs: 45,
          fat: 30,
        },
      };

      const result = await nutritionService.addMealToPlan(planId, testMeal);
      addTestResult(`✅ Added meal: ${result.name} to plan`);
      addTestResult(`🍽️ Meal ID: ${result.id}`);
      addTestResult(`⏰ Target time: ${result.targetTime}`);
      addTestResult(`🔥 Target calories: ${result.targetCalories}`);

      return result;
    } catch (error: any) {
      addTestResult(`❌ Error adding meal: ${error.message}`);
      console.error("Add meal error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testToggleMealEaten = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing Toggle Meal Eaten...");

      // First get a meal plan with meals
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

      const firstMeal = planDetail.meals[0];
      const result = await nutritionService.toggleMealEaten(firstMeal.id);
      addTestResult(`✅ Toggled meal eaten status: ${result.name}`);
      addTestResult(`🔄 New eaten status: ${result.eaten ? "Yes" : "No"}`);
      if (result.eatenAt) {
        addTestResult(
          `⏰ Eaten at: ${new Date(result.eatenAt).toLocaleString()}`
        );
      }
    } catch (error: any) {
      addTestResult(`❌ Error toggling meal eaten: ${error.message}`);
      console.error("Toggle meal eaten error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testDeleteMeal = async () => {
    try {
      setLoading(true);
      addTestResult("🔄 Testing Delete Meal...");

      // First add a meal to delete
      const plans = await nutritionService.getMealPlans(1, 1);
      if (plans.data.length === 0) {
        addTestResult("⚠️ No meal plans found. Create one first.");
        return;
      }

      const planId = plans.data[0].id;
      const testMeal = {
        name: "Meal to Delete",
        targetTime: "23:00",
        targetCalories: 100,
        nutritionGoals: {
          protein: 33,
          carbs: 34,
          fat: 33,
        },
      };

      const createdMeal = await nutritionService.addMealToPlan(
        planId,
        testMeal
      );
      addTestResult(`✅ Created meal to delete: ${createdMeal.name}`);

      // Now delete it
      await nutritionService.deleteMeal(createdMeal.id);
      addTestResult(`✅ Successfully deleted meal: ${createdMeal.name}`);
    } catch (error: any) {
      addTestResult(`❌ Error deleting meal: ${error.message}`);
      console.error("Delete meal error:", error);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    addTestResult("🚀 Starting comprehensive API tests...");

    await testCreateMealPlan();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay

    await testGetMealPlans();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testGetMealPlan();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testMarkMealAsEaten();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testAddMeal();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testToggleMealEaten();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testDeleteMeal();

    addTestResult("🏁 All tests completed!");
  };

  const clearResults = () => {
    setTestResults([]);
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
            Nutrition API Test
          </Text>
          <TouchableOpacity
            onPress={clearResults}
            className={
              isDark
                ? "bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
                : "bg-white w-10 h-10 rounded-full items-center justify-center shadow border border-light-300"
            }
          >
            <Ionicons
              name="refresh"
              size={20}
              color={isDark ? "#FFFFFF" : "#121212"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Test Buttons */}
        <View className="mb-6">
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold mb-4"
                : "text-dark-900 text-lg font-bold mb-4"
            }
          >
            API Tests
          </Text>

          <View className="space-y-3">
            <TouchableOpacity
              onPress={runAllTests}
              disabled={loading}
              className="bg-primary rounded-2xl py-4 flex-row justify-center items-center mb-3"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <>
                  <Ionicons
                    name="play-circle-outline"
                    size={20}
                    color="#000000"
                  />
                  <Text className="text-black font-bold ml-2">
                    Run All Tests
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={testCreateMealPlan}
              disabled={loading}
              className={
                isDark
                  ? "bg-dark-800 rounded-2xl py-3 flex-row justify-center items-center border border-dark-700 mb-2"
                  : "bg-white rounded-2xl py-3 flex-row justify-center items-center border border-light-300 mb-2 shadow"
              }
            >
              <Ionicons
                name="add-circle-outline"
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
                Test Create Meal Plan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={testGetMealPlans}
              disabled={loading}
              className={
                isDark
                  ? "bg-dark-800 rounded-2xl py-3 flex-row justify-center items-center border border-dark-700 mb-2"
                  : "bg-white rounded-2xl py-3 flex-row justify-center items-center border border-light-300 mb-2 shadow"
              }
            >
              <Ionicons
                name="list-outline"
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
                Test Get Meal Plans
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={testGetMealPlan}
              disabled={loading}
              className={
                isDark
                  ? "bg-dark-800 rounded-2xl py-3 flex-row justify-center items-center border border-dark-700 mb-2"
                  : "bg-white rounded-2xl py-3 flex-row justify-center items-center border border-light-300 mb-2 shadow"
              }
            >
              <Ionicons
                name="document-outline"
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
                Test Get Single Plan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={testMarkMealAsEaten}
              disabled={loading}
              className={
                isDark
                  ? "bg-dark-800 rounded-2xl py-3 flex-row justify-center items-center border border-dark-700 mb-2"
                  : "bg-white rounded-2xl py-3 flex-row justify-center items-center border border-light-300 mb-2 shadow"
              }
            >
              <Ionicons
                name="checkmark-circle-outline"
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
                Test Mark as Eaten
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={testAddMeal}
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
                Test Add Meal to Plan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={testToggleMealEaten}
              disabled={loading}
              className={
                isDark
                  ? "bg-dark-800 rounded-2xl py-3 flex-row justify-center items-center border border-dark-700 mb-2"
                  : "bg-white rounded-2xl py-3 flex-row justifyCenter items-center border border-light-300 mb-2 shadow"
              }
            >
              <Ionicons
                name="sync-circle-outline"
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
                Test Toggle Meal Eaten
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={testDeleteMeal}
              disabled={loading}
              className={
                isDark
                  ? "bg-dark-800 rounded-2xl py-3 flex-row justify-center items-center border border-dark-700 mb-2"
                  : "bg-white rounded-2xl py-3 flex-row justifyCenter items-center border border-light-300 mb-2 shadow"
              }
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={isDark ? "#FF4B26" : "#BBFD00"}
              />
              <Text
                className={
                  isDark
                    ? "text-white font-medium ml-2"
                    : "text-dark-900 font-medium ml-2"
                }
              >
                Test Delete Meal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results */}
        {testResults.length > 0 && (
          <View className="mb-20">
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold mb-4"
                  : "text-dark-900 text-lg font-bold mb-4"
              }
            >
              Test Results
            </Text>

            <View
              className={
                isDark
                  ? "bg-dark-800 rounded-2xl border border-dark-700 p-4"
                  : "bg-white rounded-2xl border border-light-300 p-4 shadow"
              }
            >
              {testResults.map((result, index) => (
                <Text
                  key={index}
                  className={
                    isDark
                      ? "text-gray-300 text-sm mb-2 font-mono"
                      : "text-gray-700 text-sm mb-2 font-mono"
                  }
                >
                  {result}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

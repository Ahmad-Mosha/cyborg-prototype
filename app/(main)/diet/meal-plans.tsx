import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { nutritionService } from "@/api";
import { MealPlan, MealPlansResponse } from "@/types/diet";

export default function MealPlansScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async (page: number = 1) => {
    try {
      setLoading(true);
      const response: MealPlansResponse = await nutritionService.getMealPlans(
        page,
        10
      );
      setMealPlans(response.data);
      setCurrentPage(response.meta.page);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
      Alert.alert("Error", "Failed to fetch meal plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string, planName: string) => {
    Alert.alert(
      "Delete Meal Plan",
      `Are you sure you want to delete "${planName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await nutritionService.deleteMealPlan(planId);
              // Refresh the list
              fetchMealPlans();
            } catch (error) {
              console.error("Error deleting meal plan:", error);
              Alert.alert("Error", "Failed to delete meal plan");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculatePlanDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading && mealPlans.length === 0) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? "bg-dark-900" : "bg-light-100"
        }`}
      >
        <ActivityIndicator size="large" color="#FF4B26" />
        <Text className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Loading meal plans...
        </Text>
      </View>
    );
  }

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
            Meal Plans
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(main)/diet/create-meal-plan")}
            className={
              isDark
                ? "bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
                : "bg-white w-10 h-10 rounded-full items-center justify-center shadow border border-light-300"
            }
          >
            <Ionicons
              name="add"
              size={20}
              color={isDark ? "#BBFD00" : "#FF4B26"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {mealPlans.length === 0 ? (
          <Animated.View
            entering={FadeInUp.delay(100).duration(400)}
            className="px-6 py-20 items-center"
          >
            <View
              className={
                isDark
                  ? "w-20 h-20 bg-dark-800 rounded-full items-center justify-center mb-4"
                  : "w-20 h-20 bg-light-200 rounded-full items-center justify-center mb-4"
              }
            >
              <Ionicons
                name="nutrition-outline"
                size={40}
                color={isDark ? "#666" : "#999"}
              />
            </View>
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold mb-2"
                  : "text-dark-900 text-lg font-bold mb-2"
              }
            >
              No Meal Plans Yet
            </Text>
            <Text
              className={
                isDark
                  ? "text-gray-400 text-center mb-6"
                  : "text-gray-600 text-center mb-6"
              }
            >
              Create your first meal plan to get started with tracking your
              nutrition goals.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(main)/diet/create-meal-plan")}
              className="bg-primary rounded-2xl py-3 px-6 flex-row items-center"
            >
              <Ionicons name="add-circle-outline" size={20} color="#000000" />
              <Text className="text-black font-bold ml-2">
                Create Meal Plan
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View className="px-6">
            {mealPlans.map((plan, index) => (
              <Animated.View
                key={plan.id}
                entering={FadeInDown.delay(index * 100).duration(400)}
                className={
                  isDark
                    ? "bg-dark-800 rounded-3xl border border-dark-700 p-5 mb-4"
                    : "bg-white rounded-3xl border border-light-300 p-5 mb-4 shadow"
                }
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text
                      className={
                        isDark
                          ? "text-white text-lg font-bold"
                          : "text-dark-900 text-lg font-bold"
                      }
                    >
                      {plan.name}
                    </Text>
                    <Text
                      className={
                        isDark ? "text-gray-400 mt-1" : "text-gray-600 mt-1"
                      }
                    >
                      {plan.description}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeletePlan(plan.id, plan.name)}
                    className="p-2"
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={isDark ? "#FF6B6B" : "#FF4757"}
                    />
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="flame-outline"
                      size={16}
                      color={isDark ? "#BBFD00" : "#FF4B26"}
                    />
                    <Text
                      className={
                        isDark
                          ? "text-white font-medium ml-1"
                          : "text-dark-900 font-medium ml-1"
                      }
                    >
                      {plan.targetCalories} kcal/day
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={isDark ? "#BBFD00" : "#FF4B26"}
                    />
                    <Text
                      className={
                        isDark
                          ? "text-white font-medium ml-1"
                          : "text-dark-900 font-medium ml-1"
                      }
                    >
                      {calculatePlanDuration(plan.startDate, plan.endDate)} days
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mb-4">
                  <Text
                    className={
                      isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"
                    }
                  >
                    {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                  </Text>
                  <Text
                    className={
                      isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"
                    }
                  >
                    Created {formatDate(plan.createdAt)}
                  </Text>
                </View>

                {/* Calorie Distribution */}
                <View
                  className={
                    isDark
                      ? "bg-dark-700 rounded-xl p-3"
                      : "bg-light-200 rounded-xl p-3"
                  }
                >
                  <Text
                    className={
                      isDark
                        ? "text-white font-medium mb-2"
                        : "text-dark-900 font-medium mb-2"
                    }
                  >
                    Meal Distribution
                  </Text>
                  <View className="flex-row justify-between">
                    {plan.calorieDistribution.map((meal, index) => (
                      <View key={index} className="items-center">
                        <Text
                          className={
                            isDark
                              ? "text-gray-400 text-xs"
                              : "text-gray-600 text-xs"
                          }
                        >
                          {meal.mealName}
                        </Text>
                        <Text
                          className={
                            isDark
                              ? "text-primary font-bold"
                              : "text-primary font-bold"
                          }
                        >
                          {meal.percentage}%
                        </Text>
                        {meal.calorieAmount && (
                          <Text
                            className={
                              isDark
                                ? "text-gray-400 text-xs"
                                : "text-gray-600 text-xs"
                            }
                          >
                            {meal.calorieAmount} kcal
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                </View>

                {/* Add Meal Button */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(main)/diet/add-meal",
                      params: { planId: plan.id, planName: plan.name },
                    })
                  }
                  className={
                    isDark
                      ? "bg-primary rounded-xl py-3 mt-4 flex-row justify-center items-center"
                      : "bg-primary rounded-xl py-3 mt-4 flex-row justify-center items-center"
                  }
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={18}
                    color="#000000"
                  />
                  <Text className="text-black font-bold ml-2">Add Meal</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <View className="flex-row justify-center items-center mt-4">
                <TouchableOpacity
                  onPress={() =>
                    currentPage > 1 && fetchMealPlans(currentPage - 1)
                  }
                  disabled={currentPage <= 1}
                  className={`p-3 mr-2 rounded-xl ${
                    currentPage <= 1
                      ? isDark
                        ? "bg-dark-800"
                        : "bg-light-200"
                      : "bg-primary"
                  }`}
                >
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    color={currentPage <= 1 ? "#666" : "#000"}
                  />
                </TouchableOpacity>

                <Text
                  className={isDark ? "text-white mx-4" : "text-dark-900 mx-4"}
                >
                  {currentPage} of {totalPages}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    currentPage < totalPages && fetchMealPlans(currentPage + 1)
                  }
                  disabled={currentPage >= totalPages}
                  className={`p-3 ml-2 rounded-xl ${
                    currentPage >= totalPages
                      ? isDark
                        ? "bg-dark-800"
                        : "bg-light-200"
                      : "bg-primary"
                  }`}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={currentPage >= totalPages ? "#666" : "#000"}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

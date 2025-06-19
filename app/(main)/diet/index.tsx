import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { router, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { Meal, BackendMeal, MealPlan } from "@/types/diet";
import { useTheme } from "@/contexts/ThemeContext";
import { nutritionService } from "@/api";

// Helper function to convert backend meal to UI meal format
const transformBackendMealToUIFormat = (backendMeal: BackendMeal): Meal => {
  const mealColors: { [key: string]: string } = {
    Breakfast: "#2196F3",
    Snack: "#FF9800",
    Lunch: "#4CAF50",
    "Pre-Workout": "#9C27B0",
    Dinner: "#F44336",
  };

  return {
    id: backendMeal.id, // Store backend meal ID
    time: backendMeal.targetTime
      ? new Date(`2000-01-01T${backendMeal.targetTime}`).toLocaleTimeString(
          [],
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }
        )
      : "",
    title: backendMeal.name,
    calories: backendMeal.targetCalories,
    items:
      backendMeal.mealFoods && backendMeal.mealFoods.length > 0
        ? backendMeal.mealFoods
            .map((food: any) => food.food?.name || food.name)
            .join(", ")
        : "No items added yet",
    complete: backendMeal.eaten,
    color: mealColors[backendMeal.name] || "#FF4500",
  };
};

export default function DietScreen() {
  // All hooks must be called in every render, and always in the same order
  // Do not put hooks in conditional blocks
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("meals");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [mealOperationLoading, setMealOperationLoading] = useState<
    string | null
  >(null); // Track which meal is being processed
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [nutritionStats, setNutritionStats] = useState({
    protein: { current: 0, target: 130 },
    carbs: { current: 0, target: 200 },
    fats: { current: 0, target: 45 },
  });

  // Debug: Log component renders and state
  console.log(
    "🔄 DietScreen RENDER - Meals state:",
    meals.map((m) => ({
      id: m.id,
      title: m.title,
      complete: m.complete,
    }))
  );

  // Fetch today's meals and meal plan
  useEffect(() => {
    fetchTodaysMeals();
  }, []);

  // Refresh data when screen comes into focus (e.g., after editing a meal)
  useFocusEffect(
    React.useCallback(() => {
      fetchTodaysMeals();
    }, [])
  );

  const fetchTodaysMeals = async () => {
    try {
      setLoading(true);
      // First get meal plans to find the active one
      const mealPlansResponse = await nutritionService.getMealPlans(1, 1);
      if (mealPlansResponse.data.length > 0) {
        const activePlan = mealPlansResponse.data[0];
        setCurrentMealPlan(activePlan);

        // Get detailed meal plan with meals
        const detailedPlan = await nutritionService.getMealPlan(activePlan.id);
        if (detailedPlan.meals && detailedPlan.meals.length > 0) {
          const transformedMeals = detailedPlan.meals.map(
            transformBackendMealToUIFormat
          );
          setMeals(transformedMeals);

          // Calculate nutrition stats
          calculateNutritionStats(detailedPlan.meals);
        } else {
          // No meals found in plan
          console.log("No meals found in plan");
          setMeals([]);
        }
      } else {
        // No meal plans found
        console.log("No meal plans found");
        setMeals([]);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      // Show empty state instead of mock data when API fails
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateNutritionStats = (backendMeals: BackendMeal[]) => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let targetProtein = 0;
    let targetCarbs = 0;
    let targetFats = 0;

    backendMeals.forEach((meal) => {
      // Calculate actual consumed nutrition from mealFoods
      if (meal.mealFoods && meal.mealFoods.length > 0) {
        meal.mealFoods.forEach((mealFood: any) => {
          if (mealFood.nutrients) {
            totalProtein += mealFood.nutrients.protein || 0;
            totalCarbs += mealFood.nutrients.carbohydrates || 0;
            totalFats += mealFood.nutrients.fat || 0;
          }
        });
      }

      // Set realistic targets if nutrition goals are 0
      if (meal.nutritionGoals.protein > 0) {
        targetProtein += meal.nutritionGoals.protein;
      } else {
        // Default protein target based on meal type
        targetProtein += (meal.targetCalories * 0.2) / 4; // 20% of calories from protein
      }

      if (meal.nutritionGoals.carbs > 0) {
        targetCarbs += meal.nutritionGoals.carbs;
      } else {
        // Default carbs target based on meal type
        targetCarbs += (meal.targetCalories * 0.5) / 4; // 50% of calories from carbs
      }

      if (meal.nutritionGoals.fat > 0) {
        targetFats += meal.nutritionGoals.fat;
      } else {
        // Default fat target based on meal type
        targetFats += (meal.targetCalories * 0.3) / 9; // 30% of calories from fat
      }
    });

    setNutritionStats({
      protein: {
        current: Math.round(totalProtein),
        target: Math.round(targetProtein),
      },
      carbs: {
        current: Math.round(totalCarbs),
        target: Math.round(targetCarbs),
      },
      fats: { current: Math.round(totalFats), target: Math.round(targetFats) },
    });
  };

  const handleMarkAsEaten = async (meal: Meal, index: number) => {
    console.log("🔄 TOGGLE STARTED", {
      mealId: meal.id,
      mealTitle: meal.title,
      currentStatus: meal.complete,
      index: index,
    });

    if (!meal.id) {
      console.error("❌ No meal ID found");
      return;
    }

    try {
      setMealOperationLoading(meal.id);
      console.log("⏳ Loading state set for meal:", meal.id);

      // Call the API
      console.log("📡 Calling API toggleMealEaten...");
      const updatedBackendMeal = await nutritionService.toggleMealEaten(
        meal.id
      );
      console.log("✅ API Response:", {
        mealId: updatedBackendMeal.id,
        eaten: updatedBackendMeal.eaten,
        eatenAt: updatedBackendMeal.eatenAt,
        fullResponse: updatedBackendMeal,
      });

      // Log the current meals state before update
      console.log(
        "📊 Current meals state before update:",
        meals.map((m) => ({
          id: m.id,
          title: m.title,
          complete: m.complete,
        }))
      );

      // Update the meals array immediately with the server response
      setMeals((prevMeals) => {
        console.log("🔧 Updating meals state...");
        const newMeals = [...prevMeals];
        const oldStatus = newMeals[index].complete;
        newMeals[index] = {
          ...newMeals[index],
          complete: updatedBackendMeal.eaten,
        };

        console.log("📝 Meal state change:", {
          mealTitle: newMeals[index].title,
          oldStatus: oldStatus,
          newStatus: newMeals[index].complete,
          serverStatus: updatedBackendMeal.eaten,
        });

        console.log(
          "📊 New meals state after update:",
          newMeals.map((m) => ({
            id: m.id,
            title: m.title,
            complete: m.complete,
          }))
        );

        return newMeals;
      });

      // Force a small delay to see if timing is the issue
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Update the meal plan state to keep it in sync
      if (currentMealPlan?.meals) {
        console.log("🔧 Updating meal plan state...");
        setCurrentMealPlan((prevPlan) => {
          if (!prevPlan?.meals) return prevPlan;

          const updatedMeals = prevPlan.meals.map((backendMeal) =>
            backendMeal.id === meal.id
              ? { ...backendMeal, eaten: updatedBackendMeal.eaten }
              : backendMeal
          );

          console.log("📝 Meal plan updated");

          // Recalculate nutrition stats
          calculateNutritionStats(updatedMeals);

          return {
            ...prevPlan,
            meals: updatedMeals,
          };
        });
      }

      console.log("✅ TOGGLE COMPLETED SUCCESSFULLY");
    } catch (error) {
      console.error("❌ Error toggling meal eaten status:", error);
    } finally {
      setMealOperationLoading(null);
      console.log("🏁 Loading state cleared");
    }
  };

  // Create a safe version of handleMealPress that handles null or undefined values
  const handleMealPress = (meal: Meal) => {
    if (!meal) return; // Early guard clause before navigation

    router.push({
      pathname: "/(main)/diet/meal-details",
      params: {
        mealId: meal.id || meal.title?.toLowerCase() || "default-meal", // Use backend ID
        mealTitle: meal.title || "Meal",
        mealTime: meal.time || "",
        mealCalories: meal.calories || 0,
        mealItems: meal.items || "",
        mealColor: meal.color || "#FF4500",
      },
    });
  };

  // Calculate nutrition percentages
  const proteinPercentage =
    nutritionStats.protein.target > 0
      ? Math.round(
          (nutritionStats.protein.current / nutritionStats.protein.target) * 100
        )
      : 0;
  const carbsPercentage =
    nutritionStats.carbs.target > 0
      ? Math.round(
          (nutritionStats.carbs.current / nutritionStats.carbs.target) * 100
        )
      : 0;
  const fatsPercentage =
    nutritionStats.fats.target > 0
      ? Math.round(
          (nutritionStats.fats.current / nutritionStats.fats.target) * 100
        )
      : 0;

  // Always return the component regardless of state
  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 30 }} className="px-6 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <Text
            className={
              isDark
                ? "text-white text-2xl font-bold"
                : "text-dark-900 text-2xl font-bold"
            }
          >
            {t("diet.dietPlan", "Diet Plan")}
          </Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/(main)/diet/meal-plans")}
              className={
                isDark
                  ? "bg-dark-800 w-10 h-10 rounded-full items-center justify-center mr-2"
                  : "bg-white w-10 h-10 rounded-full items-center justify-center shadow border border-light-300 mr-2"
              }
            >
              <Ionicons
                name="list-outline"
                size={20}
                color={isDark ? "#BBFD00" : "#FF4B26"}
              />
            </TouchableOpacity>
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
      </View>

      {/* Diet Tabs */}
      <View className="flex-row px-6 mb-5">
        {[
          { id: "meals", label: t("diet.meals", "Meals") },
          { id: "water", label: t("diet.water", "Water") },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className={`mr-4 pb-2 ${
              activeTab === tab.id ? "border-b-2 border-primary" : ""
            }`}
          >
            <Text
              className={`text-base ${
                activeTab === tab.id
                  ? "text-primary font-bold"
                  : isDark
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "meals" && (
          <>
            {/* Nutrition Stats */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(500)}
              className="px-6 mb-6"
            >
              <View
                className={
                  isDark
                    ? "bg-dark-800 rounded-3xl border border-dark-700 p-5"
                    : "bg-white rounded-3xl border border-light-300 p-5 shadow"
                }
              >
                <Text
                  className={
                    isDark ? "text-gray-300 mb-3" : "text-gray-600 mb-3"
                  }
                >
                  {t("diet.dailyNutritionGoals", "Daily Nutrition Goals")}
                </Text>
                <View className="flex-row justify-between mb-4">
                  <View className="items-center">
                    <View className="w-16 h-16 rounded-full border-4 border-primary items-center justify-center mb-2">
                      <Text
                        className={
                          isDark
                            ? "text-white text-lg font-bold"
                            : "text-dark-900 text-lg font-bold"
                        }
                      >
                        {proteinPercentage}%
                      </Text>
                    </View>
                    <Text
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-500 text-sm"
                      }
                    >
                      {t("diet.proteins", "Proteins")}
                    </Text>
                    <Text
                      className={
                        isDark
                          ? "text-white text-base font-bold"
                          : "text-dark-900 text-base font-bold"
                      }
                    >
                      {nutritionStats.protein.current}g
                    </Text>
                  </View>

                  <View className="items-center">
                    <View className="w-16 h-16 rounded-full border-4 border-[#FF9800] items-center justify-center mb-2">
                      <Text
                        className={
                          isDark
                            ? "text-white text-lg font-bold"
                            : "text-dark-900 text-lg font-bold"
                        }
                      >
                        {carbsPercentage}%
                      </Text>
                    </View>
                    <Text
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-500 text-sm"
                      }
                    >
                      {t("diet.carbs", "Carbs")}
                    </Text>
                    <Text
                      className={
                        isDark
                          ? "text-white text-base font-bold"
                          : "text-dark-900 text-base font-bold"
                      }
                    >
                      {nutritionStats.carbs.current}g
                    </Text>
                  </View>

                  <View className="items-center">
                    <View className="w-16 h-16 rounded-full border-4 border-[#2196F3] items-center justify-center mb-2">
                      <Text
                        className={
                          isDark
                            ? "text-white text-lg font-bold"
                            : "text-dark-900 text-lg font-bold"
                        }
                      >
                        {fatsPercentage}%
                      </Text>
                    </View>
                    <Text
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-500 text-sm"
                      }
                    >
                      {t("diet.fats", "Fats")}
                    </Text>
                    <Text
                      className={
                        isDark
                          ? "text-white text-base font-bold"
                          : "text-dark-900 text-base font-bold"
                      }
                    >
                      {nutritionStats.fats.current}g
                    </Text>
                  </View>
                </View>

                <View
                  className={
                    isDark
                      ? "w-full h-[6px] bg-dark-700 rounded-full flex-row overflow-hidden"
                      : "w-full h-[6px] bg-light-200 rounded-full flex-row overflow-hidden"
                  }
                >
                  <View
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
                  />
                  <View
                    className="h-full bg-[#FF9800]"
                    style={{ width: `${Math.min(carbsPercentage, 100)}%` }}
                  />
                  <View
                    className="h-full bg-[#2196F3]"
                    style={{ width: `${Math.min(fatsPercentage, 100)}%` }}
                  />
                </View>
              </View>
            </Animated.View>

            {/* Meal Plans for today */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(500)}
              className="px-6"
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className={
                    isDark
                      ? "text-white text-lg font-bold"
                      : "text-dark-900 text-lg font-bold"
                  }
                >
                  {t("diet.todaysMeals", "Today's Meals")}
                </Text>
                <TouchableOpacity onPress={fetchTodaysMeals}>
                  <Text className="text-primary">
                    {loading
                      ? t("diet.loading", "Loading...")
                      : t("diet.refresh", "Refresh")}
                  </Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <View className="flex-1 justify-center items-center py-10">
                  <ActivityIndicator size="large" color="#FF4B26" />
                  <Text
                    className={
                      isDark ? "text-gray-400 mt-2" : "text-gray-500 mt-2"
                    }
                  >
                    {t("diet.loadingMeals", "Loading meals...")}
                  </Text>
                </View>
              ) : meals.length === 0 ? (
                <View className="flex-1 justify-center items-center py-20">
                  <View
                    className={
                      isDark
                        ? "w-20 h-20 bg-dark-800 rounded-full items-center justify-center mb-6"
                        : "w-20 h-20 bg-light-200 rounded-full items-center justify-center mb-6"
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
                        ? "text-white text-xl font-bold mb-2 text-center"
                        : "text-dark-900 text-xl font-bold mb-2 text-center"
                    }
                  >
                    No Meal Plans Yet
                  </Text>
                  <Text
                    className={
                      isDark
                        ? "text-gray-400 text-center mb-8 px-8"
                        : "text-gray-600 text-center mb-8 px-8"
                    }
                  >
                    Create your first meal plan to start tracking your nutrition
                    goals and meals.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(main)/diet/create-meal-plan")}
                    className="bg-primary rounded-2xl py-4 px-8 flex-row items-center"
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color="#000000"
                    />
                    <Text className="text-black font-bold ml-2">
                      Create Your First Meal Plan
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                meals.map((meal, index) => (
                  <TouchableOpacity
                    key={`meal-${meal.id || index}-${
                      meal.complete ? "eaten" : "not-eaten"
                    }`}
                    className={
                      isDark
                        ? "bg-dark-800 rounded-3xl border border-dark-700 p-5 mb-4"
                        : "bg-white rounded-3xl border border-light-300 p-5 mb-4 shadow"
                    }
                    onPress={() => handleMealPress(meal)}
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <View className="flex-row items-center">
                        <View
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: meal.color + "20" }}
                        >
                          <Ionicons
                            name={
                              meal.complete
                                ? "checkmark-circle"
                                : "time-outline"
                            }
                            size={20}
                            color={meal.color}
                          />
                        </View>
                        <View>
                          <Text
                            className={
                              isDark
                                ? "text-gray-400 text-sm"
                                : "text-gray-500 text-sm"
                            }
                          >
                            {meal.time}
                          </Text>
                          <Text
                            className={
                              isDark
                                ? "text-white font-bold text-base"
                                : "text-dark-900 font-bold text-base"
                            }
                          >
                            {meal.title}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center">
                        <Text
                          className={
                            isDark
                              ? "text-white font-bold text-right mr-2"
                              : "text-dark-900 font-bold text-right mr-2"
                          }
                        >
                          {meal.calories}{" "}
                          <Text
                            className={
                              isDark
                                ? "text-gray-400 font-normal"
                                : "text-gray-500 font-normal"
                            }
                          >
                            {t("diet.kcal", "kcal")}
                          </Text>
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={isDark ? "#777777" : "#999999"}
                        />
                      </View>
                    </View>

                    <Text
                      className={
                        isDark ? "text-gray-400 ml-13" : "text-gray-500 ml-13"
                      }
                      numberOfLines={1}
                    >
                      {meal.items}
                    </Text>

                    {/* Toggle eaten status button - show for all meals */}
                    <TouchableOpacity
                      className={
                        meal.complete
                          ? isDark
                            ? "bg-green-600 self-start rounded-full px-4 py-2 mt-3 ml-13"
                            : "bg-green-500 self-start rounded-full px-4 py-2 mt-3 ml-13"
                          : isDark
                          ? "bg-dark-700 self-start rounded-full px-4 py-2 mt-3 ml-13"
                          : "bg-light-200 self-start rounded-full px-4 py-2 mt-3 ml-13"
                      }
                      onPress={(e) => {
                        console.log(
                          `🔘 BUTTON PRESSED - Meal: ${meal.title}, Current Status: ${meal.complete}`
                        );
                        e.stopPropagation();
                        if (mealOperationLoading !== meal.id) {
                          handleMarkAsEaten(meal, index);
                        }
                      }}
                      disabled={mealOperationLoading === meal.id}
                    >
                      {mealOperationLoading === meal.id ? (
                        <ActivityIndicator
                          size="small"
                          color={
                            meal.complete
                              ? "#FFFFFF"
                              : isDark
                              ? "#FFFFFF"
                              : "#121212"
                          }
                        />
                      ) : (
                        <Text
                          className={
                            meal.complete
                              ? "text-white text-sm"
                              : isDark
                              ? "text-white text-sm"
                              : "text-dark-900 text-sm"
                          }
                        >
                          {meal.complete
                            ? t("diet.markAsNotEaten", "Mark as not eaten")
                            : t("diet.markAsEaten", "Mark as eaten")}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              )}
            </Animated.View>
          </>
        )}

        {activeTab === "water" && <WaterTrackingTab isDark={isDark} t={t} />}
      </ScrollView>
    </View>
  );
}

// Water Tracking Component
const WaterTrackingTab = ({ isDark, t }: { isDark: boolean; t: any }) => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal] = useState(2000); // 2L daily goal
  const [glassSize, setGlassSize] = useState(250); // 250ml per glass

  const addWater = (amount: number) => {
    setWaterIntake((prev) => Math.min(prev + amount, dailyGoal + 500));
  };

  const removeWater = (amount: number) => {
    setWaterIntake((prev) => Math.max(prev - amount, 0));
  };

  const percentage = Math.round((waterIntake / dailyGoal) * 100);
  const glassesConsumed = Math.floor(waterIntake / glassSize);

  return (
    <View className="px-6">
      {/* Daily Goal Progress */}
      <View
        className={`rounded-2xl p-6 mb-6 ${
          isDark
            ? "bg-dark-800 border border-dark-700"
            : "bg-white border border-light-300 shadow"
        }`}
      >
        <Text
          className={`text-lg font-bold mb-4 ${
            isDark ? "text-white" : "text-dark-900"
          }`}
        >
          Daily Water Goal
        </Text>

        {/* Progress Circle */}
        <View className="items-center mb-6">
          <View className="relative">
            <View className="w-32 h-32 rounded-full border-8 border-gray-300 items-center justify-center">
              <View
                className="absolute w-32 h-32 rounded-full border-8 border-[#2196F3]"
                style={{
                  borderBottomColor:
                    percentage >= 25 ? "#2196F3" : "transparent",
                  borderRightColor:
                    percentage >= 50 ? "#2196F3" : "transparent",
                  borderTopColor: percentage >= 75 ? "#2196F3" : "transparent",
                  borderLeftColor:
                    percentage >= 100 ? "#2196F3" : "transparent",
                  transform: [{ rotate: "-90deg" }],
                }}
              />
              <View className="items-center">
                <Text
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-dark-900"
                  }`}
                >
                  {waterIntake}ml
                </Text>
                <Text
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {percentage}%
                </Text>
              </View>
            </View>
          </View>
          <Text
            className={`text-center mt-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Goal: {dailyGoal}ml | {glassesConsumed} glasses
          </Text>
        </View>

        {/* Quick Add Buttons */}
        <Text
          className={`text-base font-medium mb-3 ${
            isDark ? "text-white" : "text-dark-900"
          }`}
        >
          Quick Add
        </Text>
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            onPress={() => addWater(250)}
            className="bg-[#2196F3] rounded-xl px-4 py-3 flex-1 mr-2"
          >
            <Text className="text-white text-center font-medium">
              Glass (250ml)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => addWater(500)}
            className="bg-[#2196F3] rounded-xl px-4 py-3 flex-1 ml-2"
          >
            <Text className="text-white text-center font-medium">
              Bottle (500ml)
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => addWater(750)}
            className="bg-[#2196F3] rounded-xl px-4 py-3 flex-1 mr-2"
          >
            <Text className="text-white text-center font-medium">
              Large (750ml)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removeWater(250)}
            className={`rounded-xl px-4 py-3 flex-1 ml-2 ${
              isDark
                ? "bg-dark-700 border border-dark-600"
                : "bg-light-200 border border-light-300"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Remove 250ml
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Water Tips */}
      <View
        className={`rounded-2xl p-4 ${
          isDark
            ? "bg-dark-800 border border-dark-700"
            : "bg-white border border-light-300 shadow"
        }`}
      >
        <Text
          className={`text-base font-medium mb-2 ${
            isDark ? "text-white" : "text-dark-900"
          }`}
        >
          💡 Hydration Tips
        </Text>
        <Text
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          • Drink a glass of water when you wake up{"\n"}• Have water before
          each meal{"\n"}• Keep a water bottle nearby{"\n"}• Set reminders
          throughout the day
        </Text>
      </View>
    </View>
  );
};

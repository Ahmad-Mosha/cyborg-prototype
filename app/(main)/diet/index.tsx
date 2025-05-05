import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Meal } from "@/types/diet";
import { useTheme } from "@/contexts/ThemeContext";

export default function DietScreen() {
  // All hooks must be called in every render, and always in the same order
  // Do not put hooks in conditional blocks
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("meals");

  // Create a safe version of handleMealPress that handles null or undefined values
  const handleMealPress = (meal: Meal) => {
    if (!meal) return; // Early guard clause before navigation

    router.push({
      pathname: "/diet/meal-details",
      params: {
        mealId: meal.title?.toLowerCase() || "default-meal",
        mealTitle: meal.title || "Meal",
        mealTime: meal.time || "",
        mealCalories: meal.calories || 0,
        mealItems: meal.items || "",
        mealColor: meal.color || "#FF4500",
      },
    });
  };

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
        </View>
      </View>

      {/* Diet Tabs */}
      <View className="flex-row px-6 mb-5">
        {[
          { id: "meals", label: t("diet.meals", "Meals") },
          { id: "nutrition", label: t("diet.nutrition", "Nutrition") },
          { id: "water", label: t("diet.water", "Water") },
          { id: "supplements", label: t("diet.supplements", "Supplements") },
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
                        65%
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
                      130g
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
                        25%
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
                      200g
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
                        10%
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
                      45g
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
                    style={{ width: "65%" }}
                  />
                  <View
                    className="h-full bg-[#FF9800]"
                    style={{ width: "25%" }}
                  />
                  <View
                    className="h-full bg-[#2196F3]"
                    style={{ width: "10%" }}
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
                <TouchableOpacity>
                  <Text className="text-primary">
                    {t("diet.customize", "Customize")}
                  </Text>
                </TouchableOpacity>
              </View>

              {[
                {
                  time: "7:30 AM",
                  title: t("diet.breakfast", "Breakfast"),
                  calories: 420,
                  items: t(
                    "diet.breakfastItems",
                    "Protein Smoothie, Eggs, Oatmeal"
                  ),
                  complete: true,
                  color: "#2196F3",
                },
                {
                  time: "10:30 AM",
                  title: t("diet.snack", "Snack"),
                  calories: 150,
                  items: t("diet.snackItems", "Greek Yogurt, Almonds"),
                  complete: true,
                  color: "#FF9800",
                },
                {
                  time: "1:00 PM",
                  title: t("diet.lunch", "Lunch"),
                  calories: 620,
                  items: t(
                    "diet.lunchItems",
                    "Chicken Breast, Brown Rice, Vegetables"
                  ),
                  complete: false,
                  color: "#4CAF50",
                },
                {
                  time: "4:30 PM",
                  title: t("diet.preWorkout", "Pre-Workout"),
                  calories: 250,
                  items: t("diet.preWorkoutItems", "Protein Bar, Banana"),
                  complete: false,
                  color: "#9C27B0",
                },
                {
                  time: "7:30 PM",
                  title: t("diet.dinner", "Dinner"),
                  calories: 580,
                  items: t(
                    "diet.dinnerItems",
                    "Salmon, Sweet Potato, Broccoli"
                  ),
                  complete: false,
                  color: "#F44336",
                },
              ].map((meal, index) => (
                <TouchableOpacity
                  key={index}
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
                            meal.complete ? "checkmark-circle" : "time-outline"
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

                  {!meal.complete && (
                    <TouchableOpacity
                      className={
                        isDark
                          ? "bg-dark-700 self-start rounded-full px-4 py-2 mt-3 ml-13"
                          : "bg-light-200 self-start rounded-full px-4 py-2 mt-3 ml-13"
                      }
                      onPress={(e) => {
                        e.stopPropagation();
                        // Mark meal as eaten functionality would go here
                      }}
                    >
                      <Text
                        className={
                          isDark
                            ? "text-white text-sm"
                            : "text-dark-900 text-sm"
                        }
                      >
                        {t("diet.markAsEaten", "Mark as eaten")}
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          </>
        )}

        {activeTab === "nutrition" && (
          <View className="px-6 items-center justify-center">
            <Text
              className={
                isDark ? "text-white text-lg" : "text-dark-900 text-lg"
              }
            >
              {t(
                "diet.nutritionTrackingComingSoon",
                "Nutrition tracking coming soon"
              )}
            </Text>
          </View>
        )}

        {activeTab === "water" && (
          <View className="px-6 items-center justify-center">
            <Text
              className={
                isDark ? "text-white text-lg" : "text-dark-900 text-lg"
              }
            >
              {t("diet.waterTrackingComingSoon", "Water tracking coming soon")}
            </Text>
          </View>
        )}

        {activeTab === "supplements" && (
          <View className="px-6 items-center justify-center">
            <Text
              className={
                isDark ? "text-white text-lg" : "text-dark-900 text-lg"
              }
            >
              {t(
                "diet.supplementsTrackingComingSoon",
                "Supplements tracking coming soon"
              )}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

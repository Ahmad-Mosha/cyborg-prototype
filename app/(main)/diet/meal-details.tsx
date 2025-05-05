import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function MealDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const params = useLocalSearchParams();

  // Extract and convert params to the appropriate types
  // Add fallback values to prevent undefined errors
  const mealId = (params.mealId as string) || "";
  const mealTitle = (params.mealTitle as string) || "Meal";
  const mealTime = (params.mealTime as string) || "";
  const mealCalories = (params.mealCalories as string) || "0";
  const mealItems = (params.mealItems as string) || "";
  const mealColor = (params.mealColor as string) || "#FF4500"; // Default orange color

  // Mock food items data for this meal
  const foodItems = [
    {
      name: "Protein Shake",
      portion: "1 scoop (30g)",
      calories: 120,
      protein: 24,
      carbs: 3,
      fats: 1.5,
    },
    {
      name: "Scrambled Eggs",
      portion: "2 large eggs",
      calories: 180,
      protein: 12,
      carbs: 0,
      fats: 14,
    },
    {
      name: "Oatmeal",
      portion: "1 cup cooked",
      calories: 150,
      protein: 5,
      carbs: 27,
      fats: 3,
    },
  ];

  const handleAddFood = () => {
    router.push({
      pathname: "/diet/food-search",
      params: { mealId, mealTitle },
    });
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
            {mealTitle}
          </Text>
          <TouchableOpacity
            className={
              isDark
                ? "bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
                : "bg-white w-10 h-10 rounded-full items-center justify-center shadow border border-light-300"
            }
            onPress={() => {}}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={isDark ? "#FFFFFF" : "#121212"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Meal Summary */}
        <Animated.View
          entering={FadeIn.delay(100).duration(400)}
          className="px-6 mb-6"
        >
          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 p-5"
                : "bg-white rounded-3xl border border-light-300 p-5 shadow"
            }
          >
            <View className="flex-row items-center mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: `${mealColor}20` }}
              >
                <Ionicons
                  name="nutrition-outline"
                  size={24}
                  color={mealColor}
                />
              </View>
              <View>
                <Text className={isDark ? "text-gray-400" : "text-gray-500"}>
                  {mealTime}
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white text-xl font-bold"
                      : "text-dark-900 text-xl font-bold"
                  }
                >
                  {mealTitle}
                </Text>
              </View>
            </View>

            <View
              className={
                isDark
                  ? "flex-row justify-around bg-dark-700 rounded-2xl p-4"
                  : "flex-row justify-around bg-light-200 rounded-2xl p-4"
              }
            >
              <View className="items-center">
                <Text
                  className={
                    isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"
                  }
                >
                  Calories
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white text-lg font-bold"
                      : "text-dark-900 text-lg font-bold"
                  }
                >
                  {mealCalories}
                </Text>
              </View>
              <View className="items-center">
                <Text
                  className={
                    isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"
                  }
                >
                  Protein
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white text-lg font-bold"
                      : "text-dark-900 text-lg font-bold"
                  }
                >
                  35g
                </Text>
              </View>
              <View className="items-center">
                <Text
                  className={
                    isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"
                  }
                >
                  Carbs
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white text-lg font-bold"
                      : "text-dark-900 text-lg font-bold"
                  }
                >
                  40g
                </Text>
              </View>
              <View className="items-center">
                <Text
                  className={
                    isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"
                  }
                >
                  Fats
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white text-lg font-bold"
                      : "text-dark-900 text-lg font-bold"
                  }
                >
                  15g
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Food Items */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold"
                  : "text-dark-900 text-lg font-bold"
              }
            >
              Food Items
            </Text>
          </View>

          {foodItems.map((item, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(150 + index * 100).duration(400)}
              className={
                isDark
                  ? "bg-dark-800 rounded-2xl border border-dark-700 p-4 mb-3"
                  : "bg-white rounded-2xl border border-light-300 p-4 mb-3 shadow"
              }
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text
                    className={
                      isDark
                        ? "text-white font-bold"
                        : "text-dark-900 font-bold"
                    }
                  >
                    {item.name}
                  </Text>
                  <Text className={isDark ? "text-gray-400" : "text-gray-500"}>
                    {item.portion}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className={isDark ? "text-white" : "text-dark-900"}>
                    {item.calories} kcal
                  </Text>
                  <View className="flex-row">
                    <Text className="text-primary mr-1">
                      P: {item.protein}g
                    </Text>
                    <Text className="text-[#FF9800] mr-1">
                      C: {item.carbs}g
                    </Text>
                    <Text className="text-[#2196F3]">F: {item.fats}g</Text>
                  </View>
                </View>
                <TouchableOpacity className="ml-3">
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={isDark ? "#777777" : "#999999"}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}

          {/* Add Food Button */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            className="mt-4"
          >
            <TouchableOpacity
              onPress={handleAddFood}
              className="bg-primary rounded-2xl py-4 flex-row justify-center items-center"
            >
              <Ionicons name="add-circle-outline" size={20} color="#000000" />
              <Text className="text-black font-bold ml-2">Add Food</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

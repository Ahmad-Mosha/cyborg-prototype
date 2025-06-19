import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { nutritionService } from "@/api";
import { BackendMeal } from "@/types/diet";

export default function MealDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const params = useLocalSearchParams();
  const [mealData, setMealData] = useState<BackendMeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [mealFoods, setMealFoods] = useState<any[]>([]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  // Extract and convert params to the appropriate types with proper null checks
  const mealId = String(params.mealId || "");
  const mealTitle = String(params.mealTitle || "Meal");
  const mealTime = String(params.mealTime || "");
  const mealCalories = Number(params.mealCalories) || 0;
  const mealItems = String(params.mealItems || "");
  const mealColor = String(params.mealColor || "#FF4500");

  // Debug: Log all params to console to ensure they're strings
  console.log("Meal params:", {
    mealId,
    mealTitle,
    mealTime,
    mealCalories,
    mealItems,
    mealColor,
  });

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        setLoading(true);
        // If mealId looks like a UUID (backend ID), try to fetch meal data
        if (mealId && mealId.length > 20) {
          // TODO: Add getMeal endpoint to API service when available
          // For now, we'll use the passed params
          console.log("Would fetch meal data for ID:", mealId);
        }

        // Set food items to empty for now (future food management system)
        setMealFoods([]);
      } catch (error) {
        console.error("Error fetching meal data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealData();
  }, [mealId]);
  const handleAddFood = () => {
    router.push({
      pathname: "/(main)/diet/food-search",
      params: { mealId, mealTitle },
    });
  };

  const handleDeleteMeal = () => {
    Alert.alert(
      "Delete Meal",
      `Are you sure you want to delete "${mealTitle}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (mealId && mealId.length > 20) {
                await nutritionService.deleteMeal(mealId);
                Alert.alert("Success", "Meal deleted successfully", [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ]);
              } else {
                Alert.alert("Error", "Cannot delete this meal");
              }
            } catch (error) {
              console.error("Error deleting meal:", error);
              Alert.alert("Error", "Failed to delete meal");
            }
          },
        },
      ]
    );
  };
  const handleEditMeal = () => {
    if (mealId && mealId.length > 20) {
      router.push({
        pathname: "/(main)/diet/edit-meal" as any,
        params: {
          mealId,
          mealTitle,
          mealTime,
          mealCalories,
        },
      });
    } else {
      Alert.alert("Error", "Cannot edit this meal");
    }
  };

  if (loading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? "bg-dark-900" : "bg-light-100"
        }`}
      >
        <ActivityIndicator size="large" color="#FF4B26" />
        <Text className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Loading meal details...
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
            {mealTitle}
          </Text>{" "}
          {/* Action buttons - only show for backend meals */}
          <View className="flex-row">
            {mealId && mealId.length > 20 && (
              <TouchableOpacity
                className={
                  isDark
                    ? "bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
                    : "bg-white w-10 h-10 rounded-full items-center justify-center shadow border border-light-300"
                }
                onPress={() => setShowOptionsModal(true)}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={18}
                  color={isDark ? "#BBFD00" : "#FF4B26"}
                />
              </TouchableOpacity>
            )}
            {(!mealId || mealId.length <= 20) && <View className="w-10" />}
          </View>
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
                {" "}
                <Text className={isDark ? "text-gray-400" : "text-gray-500"}>
                  {mealTime || "No time set"}
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white text-xl font-bold"
                      : "text-dark-900 text-xl font-bold"
                  }
                >
                  {mealTitle || "Untitled Meal"}
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
                  {mealCalories || 0}
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
              Food Items{" "}
            </Text>
          </View>
          {mealFoods.length === 0 ? (
            <View className="items-center py-10">
              <View
                className={
                  isDark
                    ? "w-16 h-16 bg-dark-800 rounded-full items-center justify-center mb-4"
                    : "w-16 h-16 bg-light-200 rounded-full items-center justify-center mb-4"
                }
              >
                <Ionicons
                  name="restaurant-outline"
                  size={32}
                  color={isDark ? "#666" : "#999"}
                />
              </View>
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-center mb-4"
                    : "text-gray-600 text-center mb-4"
                }
              >
                No food items added yet
              </Text>
              <TouchableOpacity
                onPress={handleAddFood}
                className="bg-primary rounded-2xl py-3 px-6 flex-row items-center"
              >
                <Ionicons name="add-circle-outline" size={18} color="#000000" />
                <Text className="text-black font-bold ml-2">Add Food</Text>
              </TouchableOpacity>
            </View>
          ) : (
            mealFoods.map((item, index) => (
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
                    <Text
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    >
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
            ))
          )}

          {/* Add More Food Button - shown when there are existing foods */}
          {mealFoods.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(400).duration(400)}
              className="mt-4"
            >
              <TouchableOpacity
                onPress={handleAddFood}
                className={
                  isDark
                    ? "bg-dark-700 rounded-2xl py-3 flex-row justify-center items-center border border-dark-600"
                    : "bg-light-200 rounded-2xl py-3 flex-row justify-center items-center border border-light-300"
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
                  Add More Food
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Options Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showOptionsModal}
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black bg-opacity-50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 p-6 w-64"
                : "bg-white rounded-3xl border border-light-300 p-6 w-64 shadow-xl"
            }
          >
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold text-center mb-4"
                  : "text-dark-900 text-lg font-bold text-center mb-4"
              }
            >
              Meal Options
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowOptionsModal(false);
                handleEditMeal();
              }}
              className={
                isDark
                  ? "bg-dark-700 rounded-2xl py-3 flex-row items-center px-4 mb-3"
                  : "bg-light-200 rounded-2xl py-3 flex-row items-center px-4 mb-3"
              }
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={isDark ? "#BBFD00" : "#FF4B26"}
              />
              <Text
                className={
                  isDark
                    ? "text-white font-medium ml-3"
                    : "text-dark-900 font-medium ml-3"
                }
              >
                Edit Meal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowOptionsModal(false);
                handleDeleteMeal();
              }}
              className={
                isDark
                  ? "bg-dark-700 rounded-2xl py-3 flex-row items-center px-4"
                  : "bg-light-200 rounded-2xl py-3 flex-row items-center px-4"
              }
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={isDark ? "#FF6B6B" : "#FF4444"}
              />
              <Text
                className={
                  isDark
                    ? "text-red-400 font-medium ml-3"
                    : "text-red-500 font-medium ml-3"
                }
              >
                Delete Meal
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

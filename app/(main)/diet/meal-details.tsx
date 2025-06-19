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
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { nutritionService } from "@/api";
import { BackendMeal, MealFoodResponse } from "@/types/diet";

export default function MealDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const params = useLocalSearchParams();
  const [mealData, setMealData] = useState<BackendMeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [mealFoods, setMealFoods] = useState<MealFoodResponse[]>([]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
  const [customFoodData, setCustomFoodData] = useState({
    name: "",
    calories: 0,
    quantity: 100,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [addingCustomFood, setAddingCustomFood] = useState(false);
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

        // If mealId looks like a UUID (backend ID), fetch full meal data
        if (mealId && mealId.length > 20) {
          console.log("Fetching meal data for ID:", mealId);
          try {
            const meal = await nutritionService.getMeal(mealId);
            console.log("✅ Fetched meal data:", meal);
            setMealData(meal);
            setMealFoods(meal.mealFoods || []);
          } catch (error) {
            console.error("Error fetching meal:", error);
            // Fallback to trying to get just the foods
            try {
              const foods = await nutritionService.getMealFoods(mealId);
              setMealFoods(foods);
            } catch (foodsError) {
              console.error("Error fetching meal foods:", foodsError);
              setMealFoods([]);
            }
          }
        } else {
          // For mock meals, set empty foods
          setMealFoods([]);
        }
      } catch (error) {
        console.error("Error fetching meal data:", error);
        setMealFoods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMealData();
  }, [mealId]);

  // Refresh meal data when screen comes into focus (after adding foods)
  useFocusEffect(
    React.useCallback(() => {
      const refreshMealData = async () => {
        if (mealId && mealId.length > 20) {
          try {
            const meal = await nutritionService.getMeal(mealId);
            setMealData(meal);
            setMealFoods(meal.mealFoods || []);
          } catch (error) {
            console.error("Error refreshing meal:", error);
          }
        }
      };

      refreshMealData();
    }, [mealId])
  );
  const handleAddFood = () => {
    console.log("🔍 Navigating to food search screen");
    router.push({
      pathname: "/(main)/diet/food-search",
      params: { mealId, mealTitle },
    });
  };
  const handleAddCustomFood = () => {
    console.log("🍽️ Opening custom food modal");
    setShowCustomFoodModal(true);
  };

  const handleSubmitCustomFood = async () => {
    if (!customFoodData.name.trim()) {
      Alert.alert("Error", "Please enter a food name");
      return;
    }
    if (customFoodData.calories <= 0) {
      Alert.alert("Error", "Please enter valid calories");
      return;
    }

    try {
      setAddingCustomFood(true);
      await nutritionService.addCustomFoodToMeal(mealId, customFoodData);

      // Refresh meal data
      const meal = await nutritionService.getMeal(mealId);
      setMealData(meal);
      setMealFoods(meal.mealFoods || []);

      // Reset form and close modal
      setCustomFoodData({
        name: "",
        calories: 0,
        quantity: 100,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
      setShowCustomFoodModal(false);

      Alert.alert("Success", `${customFoodData.name} added to ${mealTitle}`);
    } catch (error) {
      console.error("Error adding custom food:", error);
      Alert.alert("Error", "Failed to add custom food");
    } finally {
      setAddingCustomFood(false);
    }
  };
  const handleDeleteFood = async (mealFoodId: string) => {
    console.log("🗑️ Attempting to delete meal food:", { mealId, mealFoodId });
    Alert.alert(
      "Delete Food",
      "Are you sure you want to remove this food from the meal?",
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
              await nutritionService.deleteMealFood(mealId, mealFoodId);
              // Refresh the meal data
              const meal = await nutritionService.getMeal(mealId);
              setMealData(meal);
              setMealFoods(meal.mealFoods || []);
              Alert.alert("Success", "Food removed from meal");
            } catch (error) {
              console.error("Error deleting food:", error);
              Alert.alert("Error", "Failed to remove food from meal");
            }
          },
        },
      ]
    );
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
              </View>{" "}
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-center mb-4"
                    : "text-gray-600 text-center mb-4"
                }
              >
                No food items added yet
              </Text>
              {/* Search Food Button */}
              <TouchableOpacity
                onPress={handleAddFood}
                className="bg-primary rounded-2xl py-3 px-6 flex-row items-center mb-3"
              >
                <Ionicons name="search-outline" size={18} color="#000000" />
                <Text className="text-black font-bold ml-2">
                  Search & Scan Food
                </Text>
              </TouchableOpacity>
              {/* Add Custom Food Button */}
              <TouchableOpacity
                onPress={handleAddCustomFood}
                className={
                  isDark
                    ? "bg-dark-700 rounded-2xl py-3 px-6 flex-row items-center border border-dark-600"
                    : "bg-light-200 rounded-2xl py-3 px-6 flex-row items-center border border-light-300"
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
                  Add Custom Food
                </Text>
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
                {" "}
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text
                      className={
                        isDark
                          ? "text-white font-bold"
                          : "text-dark-900 font-bold"
                      }
                    >
                      {item.food.name}
                    </Text>
                    <Text
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    >
                      {item.servingSize}
                      {item.servingUnit}
                      {item.food.isCustom && " (Custom)"}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className={isDark ? "text-white" : "text-dark-900"}>
                      {Math.round(item.nutrients.calories)} kcal
                    </Text>
                    <View className="flex-row">
                      <Text className="text-primary mr-1">
                        P: {Math.round(item.nutrients.protein)}g
                      </Text>
                      <Text className="text-[#FF9800] mr-1">
                        C: {Math.round(item.nutrients.carbohydrates)}g
                      </Text>
                      <Text className="text-[#2196F3]">
                        F: {Math.round(item.nutrients.fat)}g
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    className="ml-3"
                    onPress={() => handleDeleteFood(item.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={isDark ? "#FF6B6B" : "#FF4444"}
                    />
                  </TouchableOpacity>{" "}
                </View>
              </Animated.View>
            ))
          )}

          {/* Add More Food Options - shown when there are existing foods */}
          {mealFoods.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(400).duration(400)}
              className="mt-4 space-y-2"
            >
              {/* Search Food */}
              <TouchableOpacity
                onPress={handleAddFood}
                className={
                  isDark
                    ? "bg-dark-700 rounded-2xl py-3 flex-row justify-center items-center border border-dark-600 mb-2"
                    : "bg-light-200 rounded-2xl py-3 flex-row justify-center items-center border border-light-300 mb-2"
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
                  Search More Food
                </Text>
              </TouchableOpacity>

              {/* Add Custom Food */}
              <TouchableOpacity
                onPress={handleAddCustomFood}
                className={
                  isDark
                    ? "bg-dark-700 rounded-2xl py-3 flex-row justify-center items-center border border-dark-600"
                    : "bg-light-200 rounded-2xl py-3 flex-row justify-center items-center border border-light-300"
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
                  Add Custom Food
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

      {/* Custom Food Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCustomFoodModal}
        onRequestClose={() => setShowCustomFoodModal(false)}
      >
        <View
          className={
            isDark
              ? "flex-1 justify-center items-center bg-dark-900"
              : "flex-1 justify-center items-center bg-white"
          }
        >
          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 p-6 w-11/12"
                : "bg-white rounded-3xl border border-light-300 p-6 w-11/12 shadow-xl"
            }
          >
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold text-center mb-4"
                  : "text-dark-900 text-lg font-bold text-center mb-4"
              }
            >
              Add Custom Food
            </Text>
            {/* Food Name */}
            <View className="mb-4">
              <Text
                className={
                  isDark
                    ? "text-gray-300 text-sm mb-2"
                    : "text-gray-700 text-sm mb-2"
                }
              >
                Food Name
              </Text>
              <TextInput
                value={customFoodData.name}
                onChangeText={(text) =>
                  setCustomFoodData({ ...customFoodData, name: text })
                }
                className={
                  isDark
                    ? "bg-dark-700 rounded-2xl border border-dark-600 p-3 text-white"
                    : "bg-light-100 rounded-2xl border border-light-300 p-3 text-dark-900"
                }
                placeholder="Enter food name"
                placeholderTextColor={isDark ? "#666" : "#999"}
              />
            </View>
            {/* Calories, Protein, Carbs, Fats */}
            <View className="grid grid-cols-2 gap-4 mb-4">
              <View>
                <Text
                  className={
                    isDark
                      ? "text-gray-300 text-sm mb-2"
                      : "text-gray-700 text-sm mb-2"
                  }
                >
                  Calories
                </Text>
                <TextInput
                  value={String(customFoodData.calories)}
                  onChangeText={(text) =>
                    setCustomFoodData({
                      ...customFoodData,
                      calories: Number(text),
                    })
                  }
                  className={
                    isDark
                      ? "bg-dark-700 rounded-2xl border border-dark-600 p-3 text-white"
                      : "bg-light-100 rounded-2xl border border-light-300 p-3 text-dark-900"
                  }
                  placeholder="Enter calories"
                  placeholderTextColor={isDark ? "#666" : "#999"}
                  keyboardType="numeric"
                />
              </View>
              <View>
                <Text
                  className={
                    isDark
                      ? "text-gray-300 text-sm mb-2"
                      : "text-gray-700 text-sm mb-2"
                  }
                >
                  Protein (g)
                </Text>
                <TextInput
                  value={String(customFoodData.protein)}
                  onChangeText={(text) =>
                    setCustomFoodData({
                      ...customFoodData,
                      protein: Number(text),
                    })
                  }
                  className={
                    isDark
                      ? "bg-dark-700 rounded-2xl border border-dark-600 p-3 text-white"
                      : "bg-light-100 rounded-2xl border border-light-300 p-3 text-dark-900"
                  }
                  placeholder="Enter protein"
                  placeholderTextColor={isDark ? "#666" : "#999"}
                  keyboardType="numeric"
                />
              </View>
              <View>
                <Text
                  className={
                    isDark
                      ? "text-gray-300 text-sm mb-2"
                      : "text-gray-700 text-sm mb-2"
                  }
                >
                  Carbs (g)
                </Text>
                <TextInput
                  value={String(customFoodData.carbs)}
                  onChangeText={(text) =>
                    setCustomFoodData({
                      ...customFoodData,
                      carbs: Number(text),
                    })
                  }
                  className={
                    isDark
                      ? "bg-dark-700 rounded-2xl border border-dark-600 p-3 text-white"
                      : "bg-light-100 rounded-2xl border border-light-300 p-3 text-dark-900"
                  }
                  placeholder="Enter carbs"
                  placeholderTextColor={isDark ? "#666" : "#999"}
                  keyboardType="numeric"
                />
              </View>
              <View>
                <Text
                  className={
                    isDark
                      ? "text-gray-300 text-sm mb-2"
                      : "text-gray-700 text-sm mb-2"
                  }
                >
                  Fats (g)
                </Text>
                <TextInput
                  value={String(customFoodData.fat)}
                  onChangeText={(text) =>
                    setCustomFoodData({
                      ...customFoodData,
                      fat: Number(text),
                    })
                  }
                  className={
                    isDark
                      ? "bg-dark-700 rounded-2xl border border-dark-600 p-3 text-white"
                      : "bg-light-100 rounded-2xl border border-light-300 p-3 text-dark-900"
                  }
                  placeholder="Enter fats"
                  placeholderTextColor={isDark ? "#666" : "#999"}
                  keyboardType="numeric"
                />
              </View>
            </View>
            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmitCustomFood}
              className="bg-primary rounded-2xl py-3 flex-row items-center justify-center"
            >
              {addingCustomFood ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-outline"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text className="text-white font-bold ml-2">
                    Add Custom Food
                  </Text>
                </>
              )}
            </TouchableOpacity>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowCustomFoodModal(false)}
              className="mt-4"
            >
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-center"
                    : "text-gray-600 text-center"
                }
              >
                Close
              </Text>
            </TouchableOpacity>{" "}
          </View>
        </View>
      </Modal>

      {/* Custom Food Modal */}
      <Modal
        visible={showCustomFoodModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View
          className={`flex-1 ${isDark ? "bg-dark-900" : "bg-light-100"}`}
          style={{ paddingTop: insets.top }}
        >
          {/* Header */}
          <View
            className={`flex-row items-center justify-between px-4 py-3 ${
              isDark
                ? "bg-dark-800 border-b border-dark-700"
                : "bg-white border-b border-light-300"
            }`}
          >
            <TouchableOpacity onPress={() => setShowCustomFoodModal(false)}>
              <Ionicons
                name="close"
                size={24}
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
              Add Custom Food
            </Text>
            <View className="w-6" />
          </View>

          <ScrollView className="flex-1 px-4 py-6">
            {/* Food Name */}
            <View className="mb-4">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Food Name *
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="e.g., My Special Smoothie"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={customFoodData.name}
                onChangeText={(text: string) =>
                  setCustomFoodData({ ...customFoodData, name: text })
                }
              />
            </View>

            {/* Quantity */}
            <View className="mb-4">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Quantity (grams) *
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="100"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={customFoodData.quantity.toString()}
                onChangeText={(text: string) =>
                  setCustomFoodData({
                    ...customFoodData,
                    quantity: parseFloat(text) || 0,
                  })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Calories */}
            <View className="mb-4">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Calories *
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="250"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={customFoodData.calories.toString()}
                onChangeText={(text: string) =>
                  setCustomFoodData({
                    ...customFoodData,
                    calories: parseFloat(text) || 0,
                  })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Protein */}
            <View className="mb-4">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Protein (g)
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="15"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={customFoodData.protein.toString()}
                onChangeText={(text: string) =>
                  setCustomFoodData({
                    ...customFoodData,
                    protein: parseFloat(text) || 0,
                  })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Carbs */}
            <View className="mb-4">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Carbohydrates (g)
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="30"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={customFoodData.carbs.toString()}
                onChangeText={(text: string) =>
                  setCustomFoodData({
                    ...customFoodData,
                    carbs: parseFloat(text) || 0,
                  })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Fat */}
            <View className="mb-6">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Fat (g)
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="10"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={customFoodData.fat.toString()}
                onChangeText={(text: string) =>
                  setCustomFoodData({
                    ...customFoodData,
                    fat: parseFloat(text) || 0,
                  })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Add Button */}
            <TouchableOpacity
              onPress={handleSubmitCustomFood}
              disabled={
                addingCustomFood ||
                !customFoodData.name ||
                customFoodData.calories <= 0
              }
              className={`rounded-2xl py-4 flex-row justify-center items-center ${
                addingCustomFood ||
                !customFoodData.name ||
                customFoodData.calories <= 0
                  ? isDark
                    ? "bg-dark-700"
                    : "bg-gray-300"
                  : "bg-primary"
              }`}
            >
              {addingCustomFood ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <>
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#000000"
                  />
                  <Text className="text-black font-bold ml-2">
                    Add to {mealTitle}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

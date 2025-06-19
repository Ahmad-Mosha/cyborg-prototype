import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import nutritionService from "@/api/nutritionService";
import { USDAFood } from "@/types/diet";

export default function AddFoodToMealScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const params = useLocalSearchParams();

  const foodId = String(params.foodId || "");
  const foodName = String(params.foodName || "");
  const mealId = String(params.mealId || "");
  const mealTitle = String(params.mealTitle || "");
  const foodDataString = String(params.foodData || "{}");

  const [foodData, setFoodData] = useState<USDAFood | null>(null);
  const [quantity, setQuantity] = useState("100");
  const [unit, setUnit] = useState("g");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    try {
      const parsedFood = JSON.parse(foodDataString);
      setFoodData(parsedFood);
      setUnit(parsedFood.servingUnit || "g");
    } catch (error) {
      console.error("Error parsing food data:", error);
      Alert.alert("Error", "Invalid food data");
      router.back();
    }
  }, [foodDataString]);

  const calculateNutrition = (baseValue: number) => {
    const multiplier = parseFloat(quantity) / (foodData?.servingSize || 100);
    return Math.round(baseValue * multiplier * 10) / 10;
  };

  const handleAddToMeal = async () => {
    if (!foodData) return;

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }

    try {
      setAdding(true);
      await nutritionService.addFoodToMeal(mealId, {
        usdaId: foodData.usdaId,
        quantity: quantityNum,
        unit: unit,
      });

      Alert.alert("Success", `${foodName} has been added to ${mealTitle}`, [
        {
          text: "OK",
          onPress: () => {
            // Navigate back to meal details
            router.replace({
              pathname: "/(main)/diet/meal-details",
              params: {
                mealId,
                mealTitle,
              },
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error adding food to meal:", error);
      Alert.alert("Error", "Failed to add food to meal");
    } finally {
      setAdding(false);
    }
  };

  if (!foodData) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDark ? "bg-dark-900" : "bg-light-100"
        }`}
      >
        <ActivityIndicator size="large" color="#FF4B26" />
      </View>
    );
  }

  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 20 }} className="px-6 pb-4">
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
                ? "text-white text-lg font-bold flex-1 text-center mx-4"
                : "text-dark-900 text-lg font-bold flex-1 text-center mx-4"
            }
          >
            Add to {mealTitle}
          </Text>

          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Food Info */}
        <View
          className={
            isDark
              ? "bg-dark-800 rounded-2xl p-4 mb-6"
              : "bg-white rounded-2xl p-4 mb-6 shadow border border-light-300"
          }
        >
          <Text
            className={
              isDark
                ? "text-white text-xl font-bold mb-2"
                : "text-dark-900 text-xl font-bold mb-2"
            }
          >
            {foodData.name}
          </Text>
          {foodData.description && (
            <Text
              className={
                isDark
                  ? "text-gray-400 text-sm mb-4"
                  : "text-gray-600 text-sm mb-4"
              }
            >
              {foodData.description}
            </Text>
          )}

          <View className="flex-row justify-between">
            <Text className={isDark ? "text-gray-300" : "text-gray-700"}>
              Per {foodData.servingSize}
              {foodData.servingUnit}
            </Text>
            <Text
              className={
                isDark ? "text-white font-bold" : "text-dark-900 font-bold"
              }
            >
              {foodData.calories} cal
            </Text>
          </View>
        </View>

        {/* Quantity Input */}
        <View
          className={
            isDark
              ? "bg-dark-800 rounded-2xl p-4 mb-6"
              : "bg-white rounded-2xl p-4 mb-6 shadow border border-light-300"
          }
        >
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold mb-4"
                : "text-dark-900 text-lg font-bold mb-4"
            }
          >
            Quantity
          </Text>

          <View className="flex-row items-center space-x-3">
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              placeholder="100"
              keyboardType="numeric"
              className={
                isDark
                  ? "bg-dark-700 text-white px-4 py-3 rounded-xl flex-1 border border-dark-600"
                  : "bg-light-200 text-dark-900 px-4 py-3 rounded-xl flex-1 border border-light-300"
              }
              placeholderTextColor={isDark ? "#777777" : "#999999"}
            />
            <Text
              className={
                isDark
                  ? "text-gray-300 text-lg font-semibold"
                  : "text-gray-700 text-lg font-semibold"
              }
            >
              {unit}
            </Text>
          </View>
        </View>

        {/* Nutrition Preview */}
        <View
          className={
            isDark
              ? "bg-dark-800 rounded-2xl p-4 mb-6"
              : "bg-white rounded-2xl p-4 mb-6 shadow border border-light-300"
          }
        >
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold mb-4"
                : "text-dark-900 text-lg font-bold mb-4"
            }
          >
            Nutrition for {quantity}
            {unit}
          </Text>

          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className={isDark ? "text-gray-300" : "text-gray-700"}>
                Calories
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-semibold"
                    : "text-dark-900 font-semibold"
                }
              >
                {calculateNutrition(foodData.calories)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className={isDark ? "text-gray-300" : "text-gray-700"}>
                Protein
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-semibold"
                    : "text-dark-900 font-semibold"
                }
              >
                {calculateNutrition(foodData.protein)}g
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className={isDark ? "text-gray-300" : "text-gray-700"}>
                Carbohydrates
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-semibold"
                    : "text-dark-900 font-semibold"
                }
              >
                {calculateNutrition(foodData.carbohydrates)}g
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className={isDark ? "text-gray-300" : "text-gray-700"}>
                Fat
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-semibold"
                    : "text-dark-900 font-semibold"
                }
              >
                {calculateNutrition(foodData.fat)}g
              </Text>
            </View>
            {foodData.fiber > 0 && (
              <View className="flex-row justify-between">
                <Text className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Fiber
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white font-semibold"
                      : "text-dark-900 font-semibold"
                  }
                >
                  {calculateNutrition(foodData.fiber)}g
                </Text>
              </View>
            )}
            {foodData.sugar > 0 && (
              <View className="flex-row justify-between">
                <Text className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Sugar
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white font-semibold"
                      : "text-dark-900 font-semibold"
                  }
                >
                  {calculateNutrition(foodData.sugar)}g
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={handleAddToMeal}
          disabled={adding}
          className="bg-orange-500 rounded-2xl py-4 items-center justify-center"
        >
          {adding ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">
              Add to {mealTitle}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

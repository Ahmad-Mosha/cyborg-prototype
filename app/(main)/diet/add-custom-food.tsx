import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { nutritionService } from "@/api";

export default function AddCustomFoodScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();

  console.log("🍽️ AddCustomFood screen loaded with params:", params);

  const mealId = String(params.mealId || "");
  const mealTitle = String(params.mealTitle || "Meal");

  console.log("🍽️ Parsed params - MealId:", mealId, "MealTitle:", mealTitle);

  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    quantity: "100",
    protein: "",
    carbs: "",
    fat: "",
  });

  const handleAddCustomFood = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter a food name");
      return;
    }

    if (!formData.calories || isNaN(Number(formData.calories))) {
      Alert.alert("Error", "Please enter valid calories");
      return;
    }

    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      Alert.alert("Error", "Please enter valid quantity");
      return;
    }

    try {
      setLoading(true);

      const foodData = {
        name: formData.name.trim(),
        calories: Number(formData.calories),
        quantity: Number(formData.quantity),
        protein: Number(formData.protein) || 0,
        carbs: Number(formData.carbs) || 0,
        fat: Number(formData.fat) || 0,
      };

      await nutritionService.addCustomFoodToMeal(mealId, foodData);

      Alert.alert("Success", "Custom food added to meal!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error adding custom food:", error);
      Alert.alert("Error", "Failed to add custom food. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Add Custom Food
          </Text>
          <View className="w-10" />
        </View>
        <Text
          className={
            isDark ? "text-gray-400 text-sm mt-2" : "text-gray-600 text-sm mt-2"
          }
        >
          Adding to: {mealTitle}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <Animated.View
          entering={FadeInDown.duration(400)}
          className={
            isDark
              ? "bg-dark-800 rounded-3xl border border-dark-700 p-6 mb-6"
              : "bg-white rounded-3xl border border-light-300 p-6 mb-6 shadow"
          }
        >
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
              placeholder="e.g., Homemade Pasta"
              placeholderTextColor={isDark ? "#666" : "#999"}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
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
              value={formData.quantity}
              onChangeText={(text) =>
                setFormData({ ...formData, quantity: text })
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
              placeholder="200"
              placeholderTextColor={isDark ? "#666" : "#999"}
              value={formData.calories}
              onChangeText={(text) =>
                setFormData({ ...formData, calories: text })
              }
              keyboardType="numeric"
            />
          </View>

          {/* Macronutrients Row */}
          <Text
            className={
              isDark
                ? "text-gray-400 text-sm mb-2"
                : "text-gray-600 text-sm mb-2"
            }
          >
            Macronutrients (grams)
          </Text>
          <View className="flex-row justify-between mb-4">
            {/* Protein */}
            <View className="flex-1 mr-2">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-xs mb-1"
                    : "text-gray-600 text-xs mb-1"
                }
              >
                Protein
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-3 text-white text-center"
                    : "bg-light-200 border border-light-300 rounded-xl p-3 text-dark-900 text-center"
                }
                placeholder="10"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.protein}
                onChangeText={(text) =>
                  setFormData({ ...formData, protein: text })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Carbs */}
            <View className="flex-1 mx-1">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-xs mb-1"
                    : "text-gray-600 text-xs mb-1"
                }
              >
                Carbs
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-3 text-white text-center"
                    : "bg-light-200 border border-light-300 rounded-xl p-3 text-dark-900 text-center"
                }
                placeholder="20"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.carbs}
                onChangeText={(text) =>
                  setFormData({ ...formData, carbs: text })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Fat */}
            <View className="flex-1 ml-2">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-xs mb-1"
                    : "text-gray-600 text-xs mb-1"
                }
              >
                Fat
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-3 text-white text-center"
                    : "bg-light-200 border border-light-300 rounded-xl p-3 text-dark-900 text-center"
                }
                placeholder="5"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.fat}
                onChangeText={(text) => setFormData({ ...formData, fat: text })}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Preview */}
          {formData.name && formData.calories && (
            <View
              className={
                isDark
                  ? "bg-dark-700 rounded-xl p-4 mb-4"
                  : "bg-light-200 rounded-xl p-4 mb-4"
              }
            >
              <Text
                className={
                  isDark
                    ? "text-white font-bold mb-2"
                    : "text-dark-900 font-bold mb-2"
                }
              >
                Preview
              </Text>
              <Text className={isDark ? "text-gray-300" : "text-gray-700"}>
                {formData.name} • {formData.quantity}g • {formData.calories}{" "}
                kcal
              </Text>
              {(formData.protein || formData.carbs || formData.fat) && (
                <Text
                  className={
                    isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
                  }
                >
                  P: {formData.protein || 0}g • C: {formData.carbs || 0}g • F:{" "}
                  {formData.fat || 0}g
                </Text>
              )}
            </View>
          )}

          {/* Add Button */}
          <TouchableOpacity
            onPress={handleAddCustomFood}
            disabled={loading || !formData.name.trim() || !formData.calories}
            className={
              loading || !formData.name.trim() || !formData.calories
                ? "bg-gray-400 rounded-2xl py-4 flex-row justify-center items-center"
                : "bg-primary rounded-2xl py-4 flex-row justify-center items-center"
            }
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#000000" />
                <Text className="text-black font-bold ml-2">
                  Add Custom Food
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

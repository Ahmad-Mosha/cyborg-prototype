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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { nutritionService } from "@/api";
import { CreateMealRequest } from "@/types/diet";

export default function AddMealScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdMeal, setCreatedMeal] = useState<any>(null);

  // Get meal plan ID from params
  const { planId, planName } = useLocalSearchParams();

  // Form state
  const [formData, setFormData] = useState<CreateMealRequest>({
    name: "",
    targetTime: "12:00",
    targetCalories: 500,
    nutritionGoals: {
      protein: 25,
      carbs: 45,
      fat: 30,
    },
  });

  const handleCreateMeal = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter a meal name");
      return;
    }

    if (formData.targetCalories <= 0) {
      Alert.alert("Error", "Please enter a valid calorie amount");
      return;
    }

    // Validate nutrition goals add up to 100%
    const totalPercentage =
      formData.nutritionGoals.protein +
      formData.nutritionGoals.carbs +
      formData.nutritionGoals.fat;
    if (totalPercentage !== 100) {
      Alert.alert("Error", "Nutrition goals must add up to 100%");
      return;
    }

    try {
      setLoading(true);
      const newMeal = await nutritionService.addMealToPlan(
        planId as string,
        formData
      );

      setCreatedMeal(newMeal);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating meal:", error);
      Alert.alert("Error", "Failed to create meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateNutritionGoal = (
    nutrient: "protein" | "carbs" | "fat",
    value: number
  ) => {
    setFormData({
      ...formData,
      nutritionGoals: {
        ...formData.nutritionGoals,
        [nutrient]: value,
      },
    });
  };

  const totalPercentage =
    formData.nutritionGoals.protein +
    formData.nutritionGoals.carbs +
    formData.nutritionGoals.fat;

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
            Add Meal
          </Text>
          <View className="w-10" />
        </View>
        {planName && (
          <Text
            className={
              isDark
                ? "text-gray-400 text-center mt-2"
                : "text-gray-600 text-center mt-2"
            }
          >
            to {planName}
          </Text>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          className="px-6 mb-6"
        >
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold mb-4"
                : "text-dark-900 text-lg font-bold mb-4"
            }
          >
            Meal Information
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 p-5"
                : "bg-white rounded-3xl border border-light-300 p-5 shadow"
            }
          >
            {/* Meal Name */}
            <View className="mb-4">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Meal Name
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="e.g., Breakfast, Lunch, Dinner"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
            </View>

            {/* Target Time */}
            <View className="mb-4">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Target Time (HH:MM)
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="12:00"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.targetTime}
                onChangeText={(text) =>
                  setFormData({ ...formData, targetTime: text })
                }
              />
            </View>

            {/* Target Calories */}
            <View>
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Target Calories
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="500"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.targetCalories.toString()}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    targetCalories: parseInt(text) || 0,
                  })
                }
                keyboardType="numeric"
              />
            </View>
          </View>
        </Animated.View>

        {/* Nutrition Goals */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="px-6 mb-6"
        >
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold mb-4"
                : "text-dark-900 text-lg font-bold mb-4"
            }
          >
            Nutrition Goals (%)
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 p-5"
                : "bg-white rounded-3xl border border-light-300 p-5 shadow"
            }
          >
            {/* Protein */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  className={
                    isDark
                      ? "text-white font-medium"
                      : "text-dark-900 font-medium"
                  }
                >
                  Protein
                </Text>
                <Text className="text-primary font-bold">
                  {formData.nutritionGoals.protein}%
                </Text>
              </View>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-3 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-3 text-dark-900"
                }
                placeholder="25"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.nutritionGoals.protein.toString()}
                onChangeText={(text) =>
                  updateNutritionGoal("protein", parseInt(text) || 0)
                }
                keyboardType="numeric"
              />
            </View>

            {/* Carbs */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  className={
                    isDark
                      ? "text-white font-medium"
                      : "text-dark-900 font-medium"
                  }
                >
                  Carbs
                </Text>
                <Text className="text-[#FF9800] font-bold">
                  {formData.nutritionGoals.carbs}%
                </Text>
              </View>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-3 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-3 text-dark-900"
                }
                placeholder="45"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.nutritionGoals.carbs.toString()}
                onChangeText={(text) =>
                  updateNutritionGoal("carbs", parseInt(text) || 0)
                }
                keyboardType="numeric"
              />
            </View>

            {/* Fat */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  className={
                    isDark
                      ? "text-white font-medium"
                      : "text-dark-900 font-medium"
                  }
                >
                  Fat
                </Text>
                <Text className="text-[#2196F3] font-bold">
                  {formData.nutritionGoals.fat}%
                </Text>
              </View>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-3 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-3 text-dark-900"
                }
                placeholder="30"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.nutritionGoals.fat.toString()}
                onChangeText={(text) =>
                  updateNutritionGoal("fat", parseInt(text) || 0)
                }
                keyboardType="numeric"
              />
            </View>

            {/* Total Percentage Display */}
            <View
              className={
                isDark
                  ? "bg-dark-700 rounded-xl p-3"
                  : "bg-light-200 rounded-xl p-3"
              }
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={
                    isDark ? "text-white font-bold" : "text-dark-900 font-bold"
                  }
                >
                  Total
                </Text>
                <Text
                  className={
                    totalPercentage === 100
                      ? "text-green-500 font-bold"
                      : "text-red-500 font-bold"
                  }
                >
                  {totalPercentage}%
                </Text>
              </View>
              {totalPercentage !== 100 && (
                <Text
                  className={
                    isDark
                      ? "text-gray-400 text-xs mt-1"
                      : "text-gray-600 text-xs mt-1"
                  }
                >
                  Total should equal 100%
                </Text>
              )}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Create Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <TouchableOpacity
          onPress={handleCreateMeal}
          disabled={loading || totalPercentage !== 100}
          className={`rounded-2xl py-4 flex-row justify-center items-center ${
            loading || totalPercentage !== 100
              ? isDark
                ? "bg-dark-700"
                : "bg-gray-300"
              : "bg-primary"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="#000000" />
              <Text className="text-black font-bold ml-2">Add Meal</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      {showSuccessModal && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center px-6">
          <Animated.View
            entering={FadeInUp.duration(400)}
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 p-6 w-full max-w-sm"
                : "bg-white rounded-3xl border border-light-300 p-6 w-full max-w-sm shadow-xl"
            }
          >
            {/* Success Icon */}
            <View className="items-center mb-4">
              <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-4">
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>
              <Text
                className={
                  isDark
                    ? "text-white text-xl font-bold text-center"
                    : "text-dark-900 text-xl font-bold text-center"
                }
              >
                Meal Added!
              </Text>
            </View>

            {/* Meal Details */}
            {createdMeal && (
              <View
                className={
                  isDark
                    ? "bg-dark-700 rounded-2xl p-4 mb-4"
                    : "bg-light-200 rounded-2xl p-4 mb-4"
                }
              >
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-center mb-2"
                      : "text-dark-900 font-bold text-center mb-2"
                  }
                >
                  "{createdMeal.name}"
                </Text>
                <View className="flex-row justify-between items-center">
                  <View className="items-center">
                    <Text
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-600 text-sm"
                      }
                    >
                      Time
                    </Text>
                    <Text
                      className={
                        isDark
                          ? "text-primary font-bold"
                          : "text-primary font-bold"
                      }
                    >
                      {formData.targetTime}
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-600 text-sm"
                      }
                    >
                      Calories
                    </Text>
                    <Text
                      className={
                        isDark
                          ? "text-green-500 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {createdMeal.targetCalories}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Buttons */}
            <View className="space-y-3">
              <TouchableOpacity
                onPress={() => {
                  setShowSuccessModal(false);
                  router.back();
                }}
                className="bg-primary rounded-2xl py-4 flex-row justify-center items-center"
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#000000"
                />
                <Text className="text-black font-bold ml-2">Done!</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowSuccessModal(false);
                  // Reset form for creating another meal
                  setFormData({
                    name: "",
                    targetTime: "12:00",
                    targetCalories: 500,
                    nutritionGoals: {
                      protein: 25,
                      carbs: 45,
                      fat: 30,
                    },
                  });
                }}
                className={
                  isDark
                    ? "bg-dark-700 rounded-2xl py-4 flex-row justify-center items-center border border-dark-600"
                    : "bg-light-200 rounded-2xl py-4 flex-row justify-center items-center border border-light-300"
                }
              >
                <Ionicons
                  name="add-outline"
                  size={20}
                  color={isDark ? "#FFFFFF" : "#121212"}
                />
                <Text
                  className={
                    isDark
                      ? "text-white font-medium ml-2"
                      : "text-dark-900 font-medium ml-2"
                  }
                >
                  Add Another Meal
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

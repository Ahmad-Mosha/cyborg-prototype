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
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { nutritionService } from "@/api";
import { CreateMealPlanRequest, CalorieDistribution } from "@/types/diet";

export default function CreateMealPlanScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdPlan, setCreatedPlan] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState<CreateMealPlanRequest>({
    name: "",
    description: "",
    targetCalories: 2000,
    startDate: new Date().toISOString().split("T")[0], // Today's date
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days from now
    calorieDistribution: [
      { mealName: "Breakfast", percentage: 25 },
      { mealName: "Lunch", percentage: 40 },
      { mealName: "Dinner", percentage: 35 },
    ],
    createMealsAutomatically: true,
  });

  const handleCreatePlan = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter a plan name");
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter a plan description");
      return;
    }

    if (formData.targetCalories <= 0) {
      Alert.alert("Error", "Please enter a valid target calories amount");
      return;
    }

    try {
      setLoading(true);
      const newPlan = await nutritionService.createMealPlan(formData);

      setCreatedPlan(newPlan);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating meal plan:", error);
      Alert.alert("Error", "Failed to create meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateCalorieDistribution = (index: number, percentage: number) => {
    const newDistribution = [...formData.calorieDistribution];
    newDistribution[index].percentage = percentage;
    setFormData({ ...formData, calorieDistribution: newDistribution });
  };

  const totalPercentage = formData.calorieDistribution.reduce(
    (sum, meal) => sum + meal.percentage,
    0
  );

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
            Create Meal Plan
          </Text>
          <View className="w-10" />
        </View>
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
            Basic Information
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 p-5"
                : "bg-white rounded-3xl border border-light-300 p-5 shadow"
            }
          >
            {/* Plan Name */}
            <View className="mb-4">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Plan Name
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="e.g., Ramadan Plan"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-sm mb-2"
                    : "text-gray-600 text-sm mb-2"
                }
              >
                Description
              </Text>
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4 text-white"
                    : "bg-light-200 border border-light-300 rounded-xl p-4 text-dark-900"
                }
                placeholder="e.g., Balanced diet plan for Ramadan"
                placeholderTextColor={isDark ? "#666" : "#999"}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={3}
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
                placeholder="2000"
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

        {/* Calorie Distribution */}
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
            Calorie Distribution
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 p-5"
                : "bg-white rounded-3xl border border-light-300 p-5 shadow"
            }
          >
            {formData.calorieDistribution.map((meal, index) => (
              <View key={meal.mealName} className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text
                    className={
                      isDark
                        ? "text-white font-medium"
                        : "text-dark-900 font-medium"
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
                </View>
                <TextInput
                  className={
                    isDark
                      ? "bg-dark-700 border border-dark-600 rounded-xl p-3 text-white"
                      : "bg-light-200 border border-light-300 rounded-xl p-3 text-dark-900"
                  }
                  placeholder="Percentage"
                  placeholderTextColor={isDark ? "#666" : "#999"}
                  value={meal.percentage.toString()}
                  onChangeText={(text) =>
                    updateCalorieDistribution(index, parseInt(text) || 0)
                  }
                  keyboardType="numeric"
                />
              </View>
            ))}

            {/* Total Percentage Display */}
            <View
              className={
                isDark
                  ? "bg-dark-700 rounded-xl p-3 mt-2"
                  : "bg-light-200 rounded-xl p-3 mt-2"
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

        {/* Options */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          className="px-6 mb-6"
        >
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold mb-4"
                : "text-dark-900 text-lg font-bold mb-4"
            }
          >
            Options
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 p-5"
                : "bg-white rounded-3xl border border-light-300 p-5 shadow"
            }
          >
            <TouchableOpacity
              className="flex-row justify-between items-center"
              onPress={() =>
                setFormData({
                  ...formData,
                  createMealsAutomatically: !formData.createMealsAutomatically,
                })
              }
            >
              <View className="flex-1">
                <Text
                  className={
                    isDark
                      ? "text-white font-medium"
                      : "text-dark-900 font-medium"
                  }
                >
                  Create Meals Automatically
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-gray-400 text-sm mt-1"
                      : "text-gray-600 text-sm mt-1"
                  }
                >
                  Automatically create meals based on calorie distribution
                </Text>
              </View>
              <View
                className={`w-12 h-6 rounded-full ${
                  formData.createMealsAutomatically
                    ? "bg-primary"
                    : isDark
                    ? "bg-dark-600"
                    : "bg-gray-300"
                } p-1`}
              >
                <View
                  className={`w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                    formData.createMealsAutomatically
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Create Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <TouchableOpacity
          onPress={handleCreatePlan}
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
              <Text className="text-black font-bold ml-2">
                Create Meal Plan
              </Text>
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
                Meal Plan Created!
              </Text>
            </View>

            {/* Plan Details */}
            {createdPlan && (
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
                  "{createdPlan.name}"
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
                      Target Calories
                    </Text>
                    <Text
                      className={
                        isDark
                          ? "text-primary font-bold"
                          : "text-primary font-bold"
                      }
                    >
                      {createdPlan.targetCalories}
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
                      Meals Created
                    </Text>
                    <Text
                      className={
                        isDark
                          ? "text-green-500 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {createdPlan.meals?.length || 0}
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
                <Text className="text-black font-bold ml-2">Perfect!</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowSuccessModal(false);
                  // Reset form for creating another plan
                  setFormData({
                    name: "",
                    description: "",
                    targetCalories: 2000,
                    startDate: new Date().toISOString().split("T")[0],
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0],
                    calorieDistribution: [
                      { mealName: "Breakfast", percentage: 25 },
                      { mealName: "Lunch", percentage: 40 },
                      { mealName: "Dinner", percentage: 35 },
                    ],
                    createMealsAutomatically: true,
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
                  Create Another Plan
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

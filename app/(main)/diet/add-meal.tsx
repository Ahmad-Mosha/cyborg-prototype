import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
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
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Get meal plan ID from params
  const { planId, planName } = useLocalSearchParams();

  // Time picker state
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("PM");

  // Helper function to convert 12-hour time to 24-hour format
  const formatTo24Hour = (time12: string): string => {
    try {
      if (!time12 || !time12.includes(" ")) {
        return "12:00";
      }
      const [time, period] = time12.split(" ");
      if (!time || !period) {
        return "12:00";
      }
      const [hours, minutes] = time.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        return "12:00";
      }
      let hours24 = hours;

      if (period === "PM" && hours !== 12) {
        hours24 += 12;
      } else if (period === "AM" && hours === 12) {
        hours24 = 0;
      }

      return `${hours24.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    } catch {
      return "12:00";
    }
  };

  // Helper function to convert 24-hour time to 12-hour with AM/PM
  const formatTo12Hour = (time24: string): string => {
    try {
      if (!time24 || !time24.includes(":")) {
        return "12:00 PM";
      }
      const [hours, minutes] = time24.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        return "12:00 PM";
      }
      const period = hours >= 12 ? "PM" : "AM";
      const hours12 = hours % 12 || 12;
      return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch {
      return "12:00 PM";
    }
  };

  // Form state
  const [formData, setFormData] = useState<CreateMealRequest>({
    name: "",
    targetTime: "12:00", // This will be displayed as "12:00 PM" in the UI
    targetCalories: 500,
    nutritionGoals: {
      protein: 25,
      carbs: 45,
      fat: 30,
    },
  });

  // Initialize time picker values from form data
  useEffect(() => {
    if (formData.targetTime) {
      const time12 = formatTo12Hour(formData.targetTime);
      const [time, period] = time12.split(" ");
      if (time && period) {
        const [hours, minutes] = time.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          setSelectedHour(hours);
          setSelectedMinute(minutes);
          setSelectedPeriod(period);
        }
      }
    }
  }, [formData.targetTime]);

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
                Target Time
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className={
                  isDark
                    ? "bg-dark-700 border border-dark-600 rounded-xl p-4"
                    : "bg-light-200 border border-light-300 rounded-xl p-4"
                }
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className={
                      isDark ? "text-white text-base" : "text-dark-900 text-base"
                    }
                  >
                    {formatTo12Hour(formData.targetTime)}
                  </Text>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={isDark ? "#BBFD00" : "#FF4B26"}
                  />
                </View>
              </TouchableOpacity>
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

      {/* Time Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTimePicker}
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View
            className={
              isDark
                ? "bg-dark-800 rounded-t-3xl border-t border-dark-700 p-6"
                : "bg-white rounded-t-3xl border-t border-light-300 p-6"
            }
          >
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold text-center mb-6"
                  : "text-dark-900 text-lg font-bold text-center mb-6"
              }
            >
              Select Time
            </Text>

            {/* Time Picker */}
            <View className="flex-row justify-center items-center mb-6">
              {/* Hour Picker */}
              <View className="items-center mx-4">
                <Text
                  className={
                    isDark
                      ? "text-gray-400 text-sm mb-2"
                      : "text-gray-600 text-sm mb-2"
                  }
                >
                  Hour
                </Text>
                <ScrollView
                  className="h-32"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ alignItems: "center" }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      onPress={() => setSelectedHour(hour)}
                      className={`w-12 h-12 rounded-full items-center justify-center my-1 ${
                        selectedHour === hour
                          ? "bg-primary"
                          : isDark
                          ? "bg-dark-700"
                          : "bg-light-200"
                      }`}
                    >
                      <Text
                        className={
                          selectedHour === hour
                            ? "text-black font-bold"
                            : isDark
                            ? "text-white"
                            : "text-dark-900"
                        }
                      >
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text
                className={
                  isDark
                    ? "text-white text-2xl font-bold"
                    : "text-dark-900 text-2xl font-bold"
                }
              >
                :
              </Text>

              {/* Minute Picker */}
              <View className="items-center mx-4">
                <Text
                  className={
                    isDark
                      ? "text-gray-400 text-sm mb-2"
                      : "text-gray-600 text-sm mb-2"
                  }
                >
                  Minute
                </Text>
                <ScrollView
                  className="h-32"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ alignItems: "center" }}
                >
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      onPress={() => setSelectedMinute(minute)}
                      className={`w-12 h-12 rounded-full items-center justify-center my-1 ${
                        selectedMinute === minute
                          ? "bg-primary"
                          : isDark
                          ? "bg-dark-700"
                          : "bg-light-200"
                      }`}
                    >
                      <Text
                        className={
                          selectedMinute === minute
                            ? "text-black font-bold"
                            : isDark
                            ? "text-white"
                            : "text-dark-900"
                        }
                      >
                        {minute.toString().padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* AM/PM Picker */}
              <View className="items-center mx-4">
                <Text
                  className={
                    isDark
                      ? "text-gray-400 text-sm mb-2"
                      : "text-gray-600 text-sm mb-2"
                  }
                >
                  Period
                </Text>
                <View className="h-32 justify-center">
                  {["AM", "PM"].map((period) => (
                    <TouchableOpacity
                      key={period}
                      onPress={() => setSelectedPeriod(period)}
                      className={`w-16 h-12 rounded-full items-center justify-center my-2 ${
                        selectedPeriod === period
                          ? "bg-primary"
                          : isDark
                          ? "bg-dark-700"
                          : "bg-light-200"
                      }`}
                    >
                      <Text
                        className={
                          selectedPeriod === period
                            ? "text-black font-bold"
                            : isDark
                            ? "text-white"
                            : "text-dark-900"
                        }
                      >
                        {period}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Selected Time Display */}
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
                    ? "text-white text-center text-lg font-bold"
                    : "text-dark-900 text-center text-lg font-bold"
                }
              >
                Selected: {selectedHour}:
                {selectedMinute.toString().padStart(2, "0")} {selectedPeriod}
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowTimePicker(false)}
                className={
                  isDark
                    ? "bg-dark-700 rounded-2xl py-3 px-6 flex-1 mr-2"
                    : "bg-light-200 rounded-2xl py-3 px-6 flex-1 mr-2"
                }
              >
                <Text
                  className={
                    isDark
                      ? "text-white font-medium text-center"
                      : "text-dark-900 font-medium text-center"
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const time12 = `${selectedHour}:${selectedMinute
                    .toString()
                    .padStart(2, "0")} ${selectedPeriod}`;
                  const time24 = formatTo24Hour(time12);
                  setFormData({ ...formData, targetTime: time24 });
                  setShowTimePicker(false);
                }}
                className="bg-primary rounded-2xl py-3 px-6 flex-1 ml-2"
              >
                <Text className="text-black font-bold text-center">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

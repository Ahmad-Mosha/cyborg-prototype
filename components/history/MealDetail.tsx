import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MealDetailProps } from "../../types/history";

const MealDetail: React.FC<MealDetailProps> = ({ meal, onClose, isDark }) => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="flex-row items-center px-6 pb-4 pt-2"
      >
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "white" : "#121212"}
          />
        </TouchableOpacity>
        <Text
          className={`text-xl font-bold ml-2 ${
            isDark ? "text-white" : "text-dark-900"
          }`}
        >
          {meal.title}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-6"
      >
        {/* Meal Summary */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="mb-6"
        >
          <View
            className={`${
              isDark
                ? "bg-dark-800 border-dark-700"
                : "bg-white border-light-300 shadow"
            } rounded-3xl p-5 border mb-6`}
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${meal.color}20` }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={meal.color}
                  />
                </View>
                <Text className={isDark ? "text-white" : "text-dark-900"}>
                  {meal.date}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${meal.color}20` }}
                >
                  <Ionicons name="time-outline" size={18} color={meal.color} />
                </View>
                <Text className={isDark ? "text-white" : "text-dark-900"}>
                  {meal.time}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View>
                <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Calories
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-xl"
                      : "text-dark-900 font-bold text-xl"
                  }
                >
                  {meal.calories}
                </Text>
              </View>
              <View>
                <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Protein
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-xl"
                      : "text-dark-900 font-bold text-xl"
                  }
                >
                  {meal.protein}g
                </Text>
              </View>
              <View>
                <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Carbs
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-xl"
                      : "text-dark-900 font-bold text-xl"
                  }
                >
                  {meal.carbs}g
                </Text>
              </View>
              <View>
                <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Fat
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-xl"
                      : "text-dark-900 font-bold text-xl"
                  }
                >
                  {meal.fat}g
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Food Items List */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="mb-6"
        >
          <Text
            className={`text-lg font-bold mb-4 ${
              isDark ? "text-white" : "text-dark-900"
            }`}
          >
            Food Items
          </Text>

          <View
            className={`${
              isDark
                ? "bg-dark-800 border-dark-700"
                : "bg-white border-light-300 shadow"
            } rounded-3xl border overflow-hidden`}
          >
            {meal.items.map((food, index) => (
              <View
                key={index}
                className={`px-5 py-4 flex-row justify-between items-center ${
                  index < meal.items.length - 1
                    ? isDark
                      ? "border-b border-dark-700"
                      : "border-b border-light-300"
                    : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${food.color || meal.color}10` }}
                  >
                    <Ionicons
                      name={food.icon || "nutrition-outline"}
                      size={18}
                      color={food.color || meal.color}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-bold ${
                        isDark ? "text-white" : "text-dark-900"
                      }`}
                    >
                      {food.name}
                    </Text>
                    <Text
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } text-sm`}
                    >
                      {food.amount} • {food.calories} cal
                    </Text>
                  </View>
                  <Text
                    className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {food.macros}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default MealDetail;

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DietHistoryItemProps } from "../../types/history";

const DietHistoryItem: React.FC<DietHistoryItemProps> = ({
  meal,
  onPress,
  isDark,
  isLast,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(meal)}
      className={`px-5 py-4 flex-row justify-between items-center ${
        !isLast
          ? isDark
            ? "border-b border-dark-700"
            : "border-b border-light-300"
          : ""
      }`}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: `${meal.color}20` }}
        >
          <Ionicons name="nutrition-outline" size={22} color={meal.color} />
        </View>
        <View className="flex-1">
          <Text
            className={`font-bold ${isDark ? "text-white" : "text-dark-900"}`}
          >
            {meal.title}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons
              name="time-outline"
              size={14}
              color={isDark ? "#777" : "#999"}
            />
            <Text
              className={`ml-1 text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {meal.time}
            </Text>
            <Text
              className={`ml-4 text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {meal.calories} calories
            </Text>
          </View>
        </View>
        <View className="justify-center">
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#A0A0A0" : "#777777"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DietHistoryItem;

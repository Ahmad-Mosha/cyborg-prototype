import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutHistoryItemProps } from "../../types/history";

const WorkoutHistoryItem: React.FC<WorkoutHistoryItemProps> = ({
  workout,
  onPress,
  isDark,
  isLast,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(workout)}
      className={`px-5 py-4 flex-row justify-between items-center ${
        !isLast
          ? isDark
            ? "border-b border-dark-700"
            : "border-b border-light-300"
          : ""
      }`}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-4">
          <Ionicons name="barbell" size={22} color="#BBFD00" />
        </View>
        <View className="flex-1">
          <Text
            className={`font-bold ${isDark ? "text-white" : "text-dark-900"}`}
          >
            {workout.name}
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
              {workout.duration}
            </Text>
            <Text
              className={`ml-4 text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {workout.sets} sets • {workout.exerciseCount} exercises
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

export default WorkoutHistoryItem;

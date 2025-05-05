import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ExerciseItemProps } from "../../types/exercises";
import { useTheme } from "../../contexts/ThemeContext";

const ExerciseItem = ({ item, onPress }: ExerciseItemProps) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className={`flex-row items-center py-4 border-b ${
        isDark ? "border-dark-700" : "border-gray-200"
      }`}
    >
      <View
        className={`w-12 h-12 rounded-full ${
          isDark ? "bg-dark-700" : "bg-light-200"
        } items-center justify-center overflow-hidden mr-4`}
      >
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="barbell-outline" size={20} color="#BBFD00" />
        )}
      </View>
      <View className="flex-1">
        <Text
          className={
            isDark ? "text-white font-bold" : "text-dark-900 font-bold"
          }
        >
          {item.name}
        </Text>
        <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
          {item.bodyPart}
        </Text>
      </View>
      <View className="items-end">
        <View
          className={`${
            isDark ? "bg-dark-700" : "bg-light-200"
          } py-1 px-2 rounded-full`}
        >
          <Text className="text-primary text-xs font-medium">
            {item.category}
          </Text>
        </View>
        <Text
          className={
            isDark ? "text-gray-400 text-xs mt-1" : "text-gray-600 text-xs mt-1"
          }
        >
          {item.frequency}x / week
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExerciseItem;

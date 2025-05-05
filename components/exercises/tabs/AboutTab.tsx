import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { AboutTabProps } from "../../../types/exercises";
import { useTheme } from "../../../contexts/ThemeContext";

const AboutTab = ({ exercise, formatDate }: AboutTabProps) => {
  if (!exercise) return null;
  const { isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.delay(100).duration(400)}
      className="flex-1"
    >
      {/* Exercise Image */}
      <View className="w-full h-72">
        {exercise.image ? (
          <Image
            source={{ uri: exercise.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View
            className={`w-full h-full ${
              isDark ? "bg-dark-800" : "bg-light-200"
            } items-center justify-center`}
          >
            <Ionicons name="barbell-outline" size={80} color="#BBFD00" />
            <Text className={isDark ? "text-white mt-4" : "text-dark-900 mt-4"}>
              No image available
            </Text>
          </View>
        )}
        <View className="absolute bottom-4 right-4">
          <TouchableOpacity className="bg-primary rounded-full p-3 shadow-lg">
            <Ionicons name="play" size={24} color="#121212" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercise Info */}
      <View className="px-6 pt-6">
        <View className="flex-row justify-between mb-3">
          <Text
            className={
              isDark
                ? "text-white text-2xl font-bold"
                : "text-dark-900 text-2xl font-bold"
            }
          >
            {exercise.name}
          </Text>
        </View>

        <View className="flex-row mb-6">
          <View
            className={`${
              isDark ? "bg-dark-800" : "bg-light-200"
            } rounded-full px-3 py-1 mr-2`}
          >
            <Text className="text-primary">{exercise.bodyPart}</Text>
          </View>
          <View
            className={`${
              isDark ? "bg-dark-800" : "bg-light-200"
            } rounded-full px-3 py-1`}
          >
            <Text className="text-primary">{exercise.category}</Text>
          </View>
        </View>

        {/* Stats */}
        <View
          className={`${
            isDark
              ? "bg-dark-800 border-dark-700"
              : "bg-white border-gray-200 shadow"
          } rounded-3xl p-5 border mb-6`}
        >
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold mb-4"
                : "text-dark-900 text-lg font-bold mb-4"
            }
          >
            Stats
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                Frequency
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-bold text-xl"
                    : "text-dark-900 font-bold text-xl"
                }
              >
                {exercise.frequency}x
              </Text>
              <Text
                className={
                  isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"
                }
              >
                per week
              </Text>
            </View>

            <View>
              <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                Last performed
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-bold text-xl"
                    : "text-dark-900 font-bold text-xl"
                }
              >
                {formatDate(exercise.lastPerformed)}
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View
          className={`${
            isDark
              ? "bg-dark-800 border-dark-700"
              : "bg-white border-gray-200 shadow"
          } rounded-3xl p-5 border mb-6`}
        >
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold mb-4"
                : "text-dark-900 text-lg font-bold mb-4"
            }
          >
            Instructions
          </Text>
          {exercise.instructions.map((instruction, index) => (
            <View key={index} className="flex-row mb-3 last:mb-0">
              <Text className="text-primary text-base font-bold mr-2">
                {index + 1}.
              </Text>
              <Text
                className={
                  isDark ? "text-white flex-1" : "text-dark-900 flex-1"
                }
              >
                {instruction}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

export default AboutTab;

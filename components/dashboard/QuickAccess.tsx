import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

interface QuickAccessProps {
  isDark?: boolean;
}

export const QuickAccess = ({ isDark = true }: QuickAccessProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(500)}
      className="px-6 mb-8"
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className={
            isDark
              ? "text-white text-lg font-bold"
              : "text-dark-900 text-lg font-bold"
          }
        >
          Quick Access
        </Text>
      </View>

      <View className="flex-row space-x-4">
        {/* History Widget - Takes up full width in first row */}
        <TouchableOpacity
          className={
            isDark
              ? "bg-dark-800 rounded-3xl p-5 border border-dark-700 flex-1"
              : "bg-white rounded-3xl p-5 border border-light-300 flex-1 shadow"
          }
          activeOpacity={0.8}
          onPress={() => router.navigate("/(main)/history")}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#9C27B0] items-center justify-center mr-3">
                <Ionicons name="time-outline" size={24} color="#121212" />
              </View>
              <View>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-lg"
                      : "text-dark-900 font-bold text-lg"
                  }
                >
                  History
                </Text>
                <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                  View your progress
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9C27B0" />
          </View>

          <View className="flex-row justify-between items-center">
            <View>
              <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                This week
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-bold text-xl"
                    : "text-dark-900 font-bold text-xl"
                }
              >
                12 workouts
              </Text>
            </View>
            <View>
              <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                Total
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-bold text-xl"
                    : "text-dark-900 font-bold text-xl"
                }
              >
                87 hours
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View className="flex-row mt-4 space-x-4">
        {/* Exercises Widget - Half width */}
        <TouchableOpacity
          className={
            isDark
              ? "bg-dark-800 rounded-3xl p-5 border border-dark-700 flex-1"
              : "bg-white rounded-3xl p-5 border border-light-300 flex-1 shadow"
          }
          activeOpacity={0.8}
          onPress={() => router.push("exercises")}
        >
          <View className="w-12 h-12 rounded-full bg-[#FF9800] items-center justify-center mb-3">
            <Ionicons name="fitness-outline" size={24} color="#121212" />
          </View>

          <Text
            className={
              isDark
                ? "text-white font-bold text-lg mb-1"
                : "text-dark-900 font-bold text-lg mb-1"
            }
          >
            Exercises
          </Text>
          <Text
            className={
              isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
            }
          >
            Browse exercises
          </Text>

          <View className="absolute top-4 right-4">
            <Ionicons name="chevron-forward" size={24} color="#FF9800" />
          </View>
        </TouchableOpacity>

        {/* Add space between widgets */}
        <View className="w-4" />

        {/* Profile Widget - Half width */}
        <TouchableOpacity
          className={
            isDark
              ? "bg-dark-800 rounded-3xl p-5 border border-dark-700 flex-1"
              : "bg-white rounded-3xl p-5 border border-light-300 flex-1 shadow"
          }
          activeOpacity={0.8}
          onPress={() => router.push("profile")}
        >
          <View className="w-12 h-12 rounded-full bg-[#2196F3] items-center justify-center mb-3">
            <Ionicons name="person-outline" size={24} color="#121212" />
          </View>

          <Text
            className={
              isDark
                ? "text-white font-bold text-lg mb-1"
                : "text-dark-900 font-bold text-lg mb-1"
            }
          >
            Profile
          </Text>
          <Text
            className={
              isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
            }
          >
            View your stats
          </Text>

          <View className="absolute top-4 right-4">
            <Ionicons name="chevron-forward" size={24} color="#2196F3" />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

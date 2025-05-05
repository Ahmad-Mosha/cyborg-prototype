import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { RecordsTabProps } from "../../../types/exercises";
import { useTheme } from "../../../contexts/ThemeContext";

const RecordsTab = ({
  exerciseRecordsData,
  onViewRecordsHistory,
}: RecordsTabProps) => {
  const { isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.delay(100).duration(400)}
      className="flex-1 px-6 pt-6"
    >
      {/* Personal Records Section */}
      <View className="mb-6">
        <Text
          className={
            isDark
              ? "text-white text-lg font-bold mb-4"
              : "text-dark-900 text-lg font-bold mb-4"
          }
        >
          PERSONAL RECORDS
        </Text>

        <View className="flex-row justify-between mb-4">
          <View>
            <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
              Estimated 1RM
            </Text>
            <Text
              className={
                isDark
                  ? "text-white text-xl font-bold"
                  : "text-dark-900 text-xl font-bold"
              }
            >
              {exerciseRecordsData.estimatedOneRepMax} kg
            </Text>
          </View>

          <View>
            <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
              Max volume
            </Text>
            <Text
              className={
                isDark
                  ? "text-white text-xl font-bold"
                  : "text-dark-900 text-xl font-bold"
              }
            >
              {exerciseRecordsData.maxVolume} kg
            </Text>
          </View>

          <View>
            <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
              Max weight
            </Text>
            <Text
              className={
                isDark
                  ? "text-white text-xl font-bold"
                  : "text-dark-900 text-xl font-bold"
              }
            >
              {exerciseRecordsData.maxWeight} kg
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className={`${
            isDark ? "bg-dark-800" : "bg-light-200"
          } py-3 rounded-full items-center`}
          onPress={onViewRecordsHistory}
        >
          <Text
            className={
              isDark ? "text-white font-medium" : "text-dark-900 font-medium"
            }
          >
            VIEW RECORDS HISTORY
          </Text>
        </TouchableOpacity>
      </View>

      {/* Best Performance Section */}
      <View className="mb-6">
        <Text
          className={
            isDark
              ? "text-white text-lg font-bold mb-4"
              : "text-dark-900 text-lg font-bold mb-4"
          }
        >
          REPS
        </Text>

        <View
          className={`${
            isDark
              ? "bg-dark-800 border-dark-700"
              : "bg-white border-gray-200 shadow"
          } rounded-3xl border p-5`}
        >
          <View className="flex-row justify-between pb-3 mb-1">
            <Text
              className={
                isDark
                  ? "text-gray-400 font-medium"
                  : "text-gray-600 font-medium"
              }
            >
              REPS
            </Text>
            <Text
              className={`${
                isDark ? "text-gray-400" : "text-gray-600"
              } font-medium text-center flex-1`}
            >
              BEST PERFORMANCE
            </Text>
            <Text
              className={
                isDark
                  ? "text-gray-400 font-medium"
                  : "text-gray-600 font-medium"
              }
            >
              ESTIMATED
            </Text>
          </View>

          {exerciseRecordsData.bestPerformance.map((record, index) => (
            <View
              key={index}
              className={`flex-row items-center justify-between py-3 border-t ${
                isDark ? "border-dark-700" : "border-gray-200"
              }`}
            >
              <Text className={isDark ? "text-white w-8" : "text-dark-900 w-8"}>
                {record.reps}
              </Text>
              <View className="flex-1 px-2">
                <Text
                  className={
                    isDark
                      ? "text-white text-center"
                      : "text-dark-900 text-center"
                  }
                >
                  {record.weight} kg (×{record.sets})
                </Text>
                <Text
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } text-xs text-center`}
                >
                  {record.date}
                </Text>
              </View>
              <Text
                className={
                  isDark
                    ? "text-white w-16 text-right"
                    : "text-dark-900 w-16 text-right"
                }
              >
                {record.estimated} kg
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Lifetime Stats Section */}
      <View className="mb-6">
        <Text
          className={
            isDark
              ? "text-white text-lg font-bold mb-4"
              : "text-dark-900 text-lg font-bold mb-4"
          }
        >
          LIFETIME STATS
        </Text>

        <View className="flex-row justify-between mb-4">
          <View>
            <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
              Total reps
            </Text>
            <Text
              className={
                isDark
                  ? "text-white text-xl font-bold"
                  : "text-dark-900 text-xl font-bold"
              }
            >
              {exerciseRecordsData.lifetimeStats.totalReps} reps
            </Text>
          </View>

          <View>
            <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
              Total volume
            </Text>
            <Text
              className={
                isDark
                  ? "text-white text-xl font-bold"
                  : "text-dark-900 text-xl font-bold"
              }
            >
              {exerciseRecordsData.lifetimeStats.totalVolume} kg
            </Text>
          </View>
        </View>
      </View>

      <Text
        className={
          isDark
            ? "text-gray-500 text-sm italic mt-2 mb-6"
            : "text-gray-600 text-sm italic mt-2 mb-6"
        }
      >
        Estimated Rep Maxes are calculated using Brzycki's formula. Actual Rep
        Maxes show your best real world performance at each rep.
      </Text>
    </Animated.View>
  );
};

export default RecordsTab;

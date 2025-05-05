import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SimpleLineChart, DataPoint } from "./SimpleLineChart";

const { width } = Dimensions.get("window");

interface BodyMeasurementsProps {
  measurementsData: DataPoint[];
  currentMeasurement: number;
  measurementChange: number;
  period: string;
  isDark?: boolean;
}

export const BodyMeasurements = ({
  measurementsData,
  currentMeasurement,
  measurementChange,
  period,
  isDark = true,
}: BodyMeasurementsProps) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState("Chest");
  const bodyParts = ["Chest", "Arms", "Waist", "Hips"];

  return (
    <Animated.View
      entering={FadeInDown.delay(400).duration(500)}
      className="px-6"
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className={
            isDark
              ? "text-white text-lg font-bold"
              : "text-dark-900 text-lg font-bold"
          }
        >
          Body Measurements
        </Text>
      </View>

      <TouchableOpacity
        className={
          isDark
            ? "bg-dark-800 rounded-3xl p-5 border border-dark-700"
            : "bg-white rounded-3xl p-5 border border-light-300 shadow"
        }
        activeOpacity={0.8}
        onPress={() => router.push("/tracking/body-measurements")}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#2196F3]/20 items-center justify-center mr-3">
              <Ionicons name="body-outline" size={20} color="#2196F3" />
            </View>
            <View>
              <Text
                className={
                  isDark ? "text-white font-bold" : "text-dark-900 font-bold"
                }
              >
                {selectedBodyPart}: {currentMeasurement} cm
              </Text>
              <Text className="text-[#2196F3]">
                {measurementChange} cm ({period})
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-[#2196F3] p-2 rounded-full"
            onPress={() => router.push("/tracking/body-measurements")}
          >
            <Ionicons name="add" size={22} color="#121212" />
          </TouchableOpacity>
        </View>

        <View className="flex-row mb-2">
          {bodyParts.map((part, index) => (
            <TouchableOpacity
              key={index}
              className={`${
                selectedBodyPart === part
                  ? isDark
                    ? "bg-dark-700"
                    : "bg-light-200"
                  : isDark
                  ? "bg-dark-900"
                  : "bg-light-100"
              } px-3 py-1 rounded-full mr-2`}
              onPress={() => setSelectedBodyPart(part)}
            >
              <Text
                className={`${
                  selectedBodyPart === part
                    ? isDark
                      ? "text-white"
                      : "text-dark-900"
                    : isDark
                    ? "text-gray-400"
                    : "text-gray-500"
                } text-xs`}
              >
                {part}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="h-[180px] px-4 py-2">
          <SimpleLineChart
            data={measurementsData}
            width={width - 100}
            height={150}
            strokeColor="#2196F3"
            fillColor="#2196F320"
            isDark={isDark}
          />

          {/* X-axis labels */}
          <View className="flex-row justify-between mt-2">
            {measurementsData.map((point, i) =>
              i % 2 === 0 ? (
                <Text
                  key={i}
                  className={
                    isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"
                  }
                >
                  {point.x}
                </Text>
              ) : i === measurementsData.length - 1 ? (
                <Text
                  key={i}
                  className={
                    isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"
                  }
                >
                  {point.x}
                </Text>
              ) : null
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

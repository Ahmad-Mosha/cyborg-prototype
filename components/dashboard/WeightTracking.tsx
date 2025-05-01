import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SimpleLineChart, DataPoint } from "./SimpleLineChart";

const { width } = Dimensions.get("window");

interface WeightTrackingProps {
  weightData: DataPoint[];
  currentWeight: number;
  weightChange: number;
  period: string;
}

export const WeightTracking = ({
  weightData,
  currentWeight,
  weightChange,
  period,
}: WeightTrackingProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(300).duration(500)}
      className="px-6 mb-6"
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-lg font-bold">Weight Tracking</Text>
      </View>

      <TouchableOpacity
        className="bg-dark-800 rounded-3xl p-5 border border-dark-700"
        activeOpacity={0.8}
        onPress={() => router.push("/tracking/weight-tracking")}
      >
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#4CAF50]/20 items-center justify-center mr-3">
              <Ionicons name="trending-down" size={20} color="#4CAF50" />
            </View>
            <View>
              <Text className="text-white font-bold">{currentWeight} kg</Text>
              <Text className="text-[#4CAF50]">
                {weightChange} kg ({period})
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-[#4CAF50] p-2 rounded-full"
            onPress={() => router.push("/tracking/weight-tracking")}
          >
            <Ionicons name="add" size={22} color="#121212" />
          </TouchableOpacity>
        </View>

        <View className="h-[180px] px-4 py-2">
          <SimpleLineChart
            data={weightData}
            width={width - 100}
            height={150}
            strokeColor="#4CAF50"
            fillColor="#4CAF5020"
          />

          {/* X-axis labels */}
          <View className="flex-row justify-between mt-2">
            {weightData.map((point, i) =>
              i % 2 === 0 ? (
                <Text key={i} className="text-gray-400 text-xs">
                  {point.x}
                </Text>
              ) : i === weightData.length - 1 ? (
                <Text key={i} className="text-gray-400 text-xs">
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

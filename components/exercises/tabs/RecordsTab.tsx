import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { RecordsTabProps } from "../../../types/exercises";

const RecordsTab = ({
  exerciseRecordsData,
  onViewRecordsHistory,
}: RecordsTabProps) => {
  return (
    <Animated.View
      entering={FadeIn.delay(100).duration(400)}
      className="flex-1 px-6 pt-6"
    >
      {/* Personal Records Section */}
      <View className="mb-6">
        <Text className="text-white text-lg font-bold mb-4">
          PERSONAL RECORDS
        </Text>

        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-gray-400">Estimated 1RM</Text>
            <Text className="text-white text-xl font-bold">
              {exerciseRecordsData.estimatedOneRepMax} kg
            </Text>
          </View>

          <View>
            <Text className="text-gray-400">Max volume</Text>
            <Text className="text-white text-xl font-bold">
              {exerciseRecordsData.maxVolume} kg
            </Text>
          </View>

          <View>
            <Text className="text-gray-400">Max weight</Text>
            <Text className="text-white text-xl font-bold">
              {exerciseRecordsData.maxWeight} kg
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-dark-800 py-3 rounded-full items-center"
          onPress={onViewRecordsHistory}
        >
          <Text className="text-white font-medium">VIEW RECORDS HISTORY</Text>
        </TouchableOpacity>
      </View>

      {/* Best Performance Section */}
      <View className="mb-6">
        <Text className="text-white text-lg font-bold mb-4">REPS</Text>

        <View className="bg-dark-800 rounded-3xl border border-dark-700 p-5">
          <View className="flex-row justify-between pb-3 mb-1">
            <Text className="text-gray-400 font-medium">REPS</Text>
            <Text className="text-gray-400 font-medium text-center flex-1">
              BEST PERFORMANCE
            </Text>
            <Text className="text-gray-400 font-medium">ESTIMATED</Text>
          </View>

          {exerciseRecordsData.bestPerformance.map((record, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between py-3 border-t border-dark-700"
            >
              <Text className="text-white w-8">{record.reps}</Text>
              <View className="flex-1 px-2">
                <Text className="text-white text-center">
                  {record.weight} kg (×{record.sets})
                </Text>
                <Text className="text-gray-400 text-xs text-center">
                  {record.date}
                </Text>
              </View>
              <Text className="text-white w-16 text-right">
                {record.estimated} kg
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Lifetime Stats Section */}
      <View className="mb-6">
        <Text className="text-white text-lg font-bold mb-4">
          LIFETIME STATS
        </Text>

        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-gray-400">Total reps</Text>
            <Text className="text-white text-xl font-bold">
              {exerciseRecordsData.lifetimeStats.totalReps} reps
            </Text>
          </View>

          <View>
            <Text className="text-gray-400">Total volume</Text>
            <Text className="text-white text-xl font-bold">
              {exerciseRecordsData.lifetimeStats.totalVolume} kg
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-gray-500 text-sm italic mt-2 mb-6">
        Estimated Rep Maxes are calculated using Brzycki's formula. Actual Rep
        Maxes show your best real world performance at each rep.
      </Text>
    </Animated.View>
  );
};

export default RecordsTab;

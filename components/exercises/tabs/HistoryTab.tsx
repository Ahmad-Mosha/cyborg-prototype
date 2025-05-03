import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { HistoryTabProps } from "../../../types/exercises";

const HistoryTab = ({ exerciseHistoryData }: HistoryTabProps) => {
  return (
    <Animated.View
      entering={FadeIn.delay(100).duration(400)}
      className="flex-1 px-6 pt-6"
    >
      {exerciseHistoryData.map((session, index) => (
        <View
          key={index}
          className="bg-dark-800 rounded-3xl border border-dark-700 mb-5 p-5"
        >
          <View className="mb-4">
            <Text className="text-white text-base font-medium">
              {session.date.split(",")[0] + "," + session.date.split(",")[1]}
            </Text>
            <Text className="text-gray-400 text-sm">
              {session.date.split(",").slice(2).join(",")}
            </Text>
          </View>
          <Text className="text-white font-bold mb-2">Sets Performed</Text>
          {session.sets.map((set, setIndex) => (
            <View
              key={setIndex}
              className="flex-row justify-between py-2 border-b border-dark-700 last:border-0"
            >
              <Text className="text-white">{setIndex + 1}</Text>
              <Text className="text-white">
                {set.weight} kg × {set.reps}
              </Text>
              <Text className="text-white">{set.oneRepMax}</Text>
            </View>
          ))}
        </View>
      ))}
    </Animated.View>
  );
};

export default HistoryTab;

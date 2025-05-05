import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { HistoryTabProps } from "../../../types/exercises";
import { useTheme } from "../../../contexts/ThemeContext";

const HistoryTab = ({ exerciseHistoryData }: HistoryTabProps) => {
  const { isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.delay(100).duration(400)}
      className="flex-1 px-6 pt-6"
    >
      {exerciseHistoryData.map((session, index) => (
        <View
          key={index}
          className={`${
            isDark
              ? "bg-dark-800 border-dark-700"
              : "bg-white border-gray-200 shadow"
          } rounded-3xl border mb-5 p-5`}
        >
          <View className="mb-4">
            <Text
              className={
                isDark
                  ? "text-white text-base font-medium"
                  : "text-dark-900 text-base font-medium"
              }
            >
              {session.date.split(",")[0] + "," + session.date.split(",")[1]}
            </Text>
            <Text
              className={
                isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
              }
            >
              {session.date.split(",").slice(2).join(",")}
            </Text>
          </View>
          <Text
            className={
              isDark
                ? "text-white font-bold mb-2"
                : "text-dark-900 font-bold mb-2"
            }
          >
            Sets Performed
          </Text>
          {session.sets.map((set, setIndex) => (
            <View
              key={setIndex}
              className={`flex-row justify-between py-2 ${
                setIndex < session.sets.length - 1
                  ? isDark
                    ? "border-b border-dark-700"
                    : "border-b border-gray-200"
                  : ""
              }`}
            >
              <Text className={isDark ? "text-white" : "text-dark-900"}>
                {setIndex + 1}
              </Text>
              <Text className={isDark ? "text-white" : "text-dark-900"}>
                {set.weight} kg × {set.reps}
              </Text>
              <Text className={isDark ? "text-white" : "text-dark-900"}>
                {set.oneRepMax}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </Animated.View>
  );
};

export default HistoryTab;

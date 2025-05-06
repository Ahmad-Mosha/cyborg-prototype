import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WorkoutDetailProps } from "../../types/history";

const WorkoutDetail: React.FC<WorkoutDetailProps> = ({
  workout,
  onClose,
  isDark,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="flex-row items-center px-6 pb-4 pt-2"
      >
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "white" : "#121212"}
          />
        </TouchableOpacity>
        <Text
          className={`text-xl font-bold ml-2 ${
            isDark ? "text-white" : "text-dark-900"
          }`}
        >
          {workout.name}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-6"
      >
        {/* Workout Summary */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="mb-6"
        >
          <View
            className={`${
              isDark
                ? "bg-dark-800 border-dark-700"
                : "bg-white border-light-300 shadow"
            } rounded-3xl p-5 border mb-6`}
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
                  <Ionicons name="calendar-outline" size={18} color="#BBFD00" />
                </View>
                <Text className={isDark ? "text-white" : "text-dark-900"}>
                  {workout.date}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
                  <Ionicons name="time-outline" size={18} color="#BBFD00" />
                </View>
                <Text className={isDark ? "text-white" : "text-dark-900"}>
                  {workout.duration}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View>
                <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Volume
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-xl"
                      : "text-dark-900 font-bold text-xl"
                  }
                >
                  {workout.volume} kg
                </Text>
              </View>
              <View>
                <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Personal Records
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-xl"
                      : "text-dark-900 font-bold text-xl"
                  }
                >
                  {workout.prs} PRs
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Exercises List */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="mb-6"
        >
          <Text
            className={`text-lg font-bold mb-4 ${
              isDark ? "text-white" : "text-dark-900"
            }`}
          >
            Exercises
          </Text>

          <View
            className={`${
              isDark
                ? "bg-dark-800 border-dark-700"
                : "bg-white border-light-300 shadow"
            } rounded-3xl border overflow-hidden`}
          >
            {workout.exercises.map((exercise, index) => (
              <View
                key={index}
                className={`px-5 py-4 ${
                  index < workout.exercises.length - 1
                    ? isDark
                      ? "border-b border-dark-700"
                      : "border-b border-light-300"
                    : ""
                }`}
              >
                <Text
                  className={`font-bold ${
                    isDark ? "text-white" : "text-dark-900"
                  }`}
                >
                  {exercise.name}
                </Text>
                <View className="mt-2">
                  {exercise.sets.map((set, setIndex) => (
                    <View
                      key={setIndex}
                      className="flex-row justify-between mb-1"
                    >
                      <Text
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-600"
                        } text-sm`}
                      >
                        Set {setIndex + 1}
                      </Text>
                      <Text
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-600"
                        } text-sm`}
                      >
                        {set.weight} kg × {set.reps} reps
                      </Text>
                      <Text
                        className={`${
                          set.isPersonalBest
                            ? "text-primary font-bold"
                            : isDark
                            ? "text-gray-400"
                            : "text-gray-600"
                        } text-sm`}
                      >
                        {set.isPersonalBest ? "PB" : set.volume}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Notes Section */}
        {workout.notes && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            className="mb-6"
          >
            <Text
              className={`text-lg font-bold mb-4 ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Notes
            </Text>

            <View
              className={`${
                isDark
                  ? "bg-dark-800 border-dark-700"
                  : "bg-white border-light-300 shadow"
              } rounded-3xl border p-5`}
            >
              <Text className={isDark ? "text-gray-300" : "text-gray-700"}>
                {workout.notes}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default WorkoutDetail;

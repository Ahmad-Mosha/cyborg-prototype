import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// Sample data types
type WorkoutData = {
  name: string;
  duration: string;
  exercises: number;
  calories: number;
  icon: string;
};

type CalorieData = {
  goal: number;
  consumed: number;
  remaining: number;
  percentage: number;
};

type WaterData = {
  goal: number;
  consumed: number;
  remaining: number;
  percentage: number;
};

interface TodayOverviewProps {
  workouts: WorkoutData[];
  caloriesData: CalorieData;
  waterData: WaterData;
  isDark?: boolean;
}

export const TodayOverview = ({
  workouts,
  caloriesData,
  waterData,
  isDark = true,
}: TodayOverviewProps) => {
  const scrollX = useSharedValue(0);
  const [activeWidgetIndex, setActiveWidgetIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Configuration
  const totalWidgets = 3;
  const scrollInterval = 3000; // 3 seconds per widget
  const widgetWidth = width * 0.85 - 24;

  // Auto scrolling functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeWidgetIndex + 1) % totalWidgets;
      setActiveWidgetIndex(nextIndex);

      // Animate scroll to next widget
      scrollViewRef.current?.scrollTo({
        x: nextIndex * widgetWidth + nextIndex * 16, // Account for margin
        animated: true,
      });
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [activeWidgetIndex, widgetWidth]);

  // Handle manual scroll
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = event.nativeEvent.contentOffset.x;
      // Calculate which widget is most visible
      const index = Math.round(offset / (widgetWidth + 16));
      if (index !== activeWidgetIndex && index >= 0 && index < totalWidgets) {
        setActiveWidgetIndex(index);
      }
    },
    [activeWidgetIndex, widgetWidth]
  );

  // Pulsing animation for water drops
  const pulseValue = useSharedValue(1);
  useEffect(() => {
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1.08, {
          duration: 2400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(0.96, {
          duration: 2400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center px-6 mb-4">
        <Text
          className={
            isDark
              ? "text-white text-lg font-bold"
              : "text-dark-900 text-lg font-bold"
          }
        >
          Today's Overview
        </Text>
        <View className="flex-row">
          {Array.from({ length: totalWidgets }).map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setActiveWidgetIndex(i);
                scrollViewRef.current?.scrollTo({
                  x: i * widgetWidth + i * 16,
                  animated: true,
                });
              }}
            >
              <View
                className={`w-2 h-2 rounded-full mx-1 ${
                  activeWidgetIndex === i
                    ? "bg-primary"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={widgetWidth + 16} // Account for margin
        decelerationRate="fast"
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScroll}
      >
        {/* Today's Workout Widget */}
        <TouchableOpacity
          className={
            isDark
              ? "bg-dark-800 rounded-3xl p-5 border border-dark-700 mr-4"
              : "bg-white rounded-3xl p-5 border border-light-300 mr-4 shadow"
          }
          style={{ width: widgetWidth }}
          activeOpacity={0.8}
          onPress={() => router.push("/workout")}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-4">
                <Ionicons name="barbell" size={24} color="#121212" />
              </View>
              <View>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-lg"
                      : "text-dark-900 font-bold text-lg"
                  }
                >
                  {workouts[0].name}
                </Text>
                <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                  {workouts[0].duration} · {workouts[0].exercises} exercises
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#BBFD00" />
          </View>

          <View
            className={
              isDark ? "h-[1px] bg-dark-700 my-2" : "h-[1px] bg-light-300 my-2"
            }
          />

          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <Ionicons name="flame-outline" size={18} color="#F44336" />
              <Text
                className={isDark ? "text-white ml-1" : "text-dark-900 ml-1"}
              >
                {workouts[0].calories} kcal
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#BBFD00" />
              <Text
                className={isDark ? "text-white ml-1" : "text-dark-900 ml-1"}
              >
                {workouts[0].duration}
              </Text>
            </View>

            <TouchableOpacity className="bg-primary px-4 py-2 rounded-full flex-row items-center">
              <Ionicons name="play" size={16} color="#121212" />
              <Text className="text-dark-900 font-bold ml-1">Start</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Daily Calories Widget */}
        <TouchableOpacity
          className={
            isDark
              ? "bg-dark-800 rounded-3xl p-5 border border-dark-700 mr-4"
              : "bg-white rounded-3xl p-5 border border-light-300 mr-4 shadow"
          }
          style={{ width: widgetWidth }}
          activeOpacity={0.8}
          onPress={() => router.push("/(main)/diet")}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#FF6B3E] items-center justify-center mr-4">
                <Ionicons name="nutrition" size={24} color="#121212" />
              </View>
              <View>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-lg"
                      : "text-dark-900 font-bold text-lg"
                  }
                >
                  Daily Calories
                </Text>
                <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                  {caloriesData.percentage}% of daily goal
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FF6B3E" />
          </View>

          <View
            className={
              isDark
                ? "h-3 bg-dark-700 rounded-full overflow-hidden mb-3"
                : "h-3 bg-light-200 rounded-full overflow-hidden mb-3"
            }
          >
            <View
              className="h-full bg-[#FF6B3E]"
              style={{ width: `${caloriesData.percentage}%` }}
            />
          </View>

          <View className="flex-row justify-between">
            <View>
              <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                Consumed
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-bold text-xl"
                    : "text-dark-900 font-bold text-xl"
                }
              >
                {caloriesData.consumed}
              </Text>
            </View>

            <View>
              <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                Remaining
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-bold text-xl"
                    : "text-dark-900 font-bold text-xl"
                }
              >
                {caloriesData.remaining}
              </Text>
            </View>

            <View>
              <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                Goal
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-bold text-xl"
                    : "text-dark-900 font-bold text-xl"
                }
              >
                {caloriesData.goal}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Water Intake Widget */}
        <TouchableOpacity
          className={
            isDark
              ? "bg-dark-800 rounded-3xl p-5 border border-dark-700"
              : "bg-white rounded-3xl p-5 border border-light-300 shadow"
          }
          style={{ width: widgetWidth }}
          activeOpacity={0.8}
        >
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#2196F3] items-center justify-center mr-4">
                <Ionicons name="water" size={24} color="#121212" />
              </View>
              <View>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-lg"
                      : "text-dark-900 font-bold text-lg"
                  }
                >
                  Water Intake
                </Text>
                <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                  {waterData.consumed} of {waterData.goal} glasses
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-center space-x-2 mb-3">
            {Array.from({ length: waterData.goal }).map((_, index) => {
              const isFilled = index < waterData.consumed;
              return (
                <Animated.View
                  key={index}
                  style={index < waterData.consumed ? pulseStyle : {}}
                >
                  <Ionicons
                    name="water"
                    size={28}
                    color={isFilled ? "#2196F3" : isDark ? "#333" : "#e0e0e0"}
                  />
                </Animated.View>
              );
            })}
          </View>

          <View className="flex-row justify-between items-center">
            <View>
              <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                Progress
              </Text>
              <Text
                className={
                  isDark
                    ? "text-white font-bold text-xl"
                    : "text-dark-900 font-bold text-xl"
                }
              >
                {waterData.percentage}%
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                className={
                  isDark
                    ? "bg-dark-700 w-10 h-10 rounded-full items-center justify-center"
                    : "bg-light-200 w-10 h-10 rounded-full items-center justify-center"
                }
              >
                <Ionicons
                  name="remove"
                  size={24}
                  color={isDark ? "white" : "#121212"}
                />
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#2196F3] w-10 h-10 rounded-full items-center justify-center ml-3">
                <Ionicons name="add" size={24} color="#121212" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

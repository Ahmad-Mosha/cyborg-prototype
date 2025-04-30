import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withSpring,
} from "react-native-reanimated";
import { router } from "expo-router";
import Svg, { Path, Circle, Line } from "react-native-svg";

const { width } = Dimensions.get("window");

// Define data point type for charts
type DataPoint = {
  x: string;
  y: number;
};

// Custom chart component for weight data
const SimpleLineChart = ({
  data,
  width,
  height,
  strokeColor = "#4CAF50",
  fillColor = "#4CAF5020",
  showDots = true,
}: {
  data: DataPoint[];
  width: number;
  height: number;
  strokeColor?: string;
  fillColor?: string;
  showDots?: boolean;
}) => {
  // Get min/max values for scaling
  const maxY = Math.max(...data.map((d: DataPoint) => d.y)) + 2;
  const minY = Math.min(...data.map((d: DataPoint) => d.y)) - 2;
  const yRange = maxY - minY;

  // Calculate points
  const points = data.map((point: DataPoint, i: number) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((point.y - minY) / yRange) * height;
    return { x, y };
  });

  // Create SVG path
  const pathData = points.reduce(
    (path: string, point: { x: number; y: number }, i: number) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${path} L ${point.x} ${point.y}`;
    },
    ""
  );

  return (
    <Svg width={width} height={height}>
      {/* Draw the line */}
      <Path d={pathData} stroke={strokeColor} strokeWidth={3} fill="none" />

      {/* Draw dots at data points if requested */}
      {showDots &&
        points.map((point: { x: number; y: number }, i: number) => (
          <Circle key={i} cx={point.x} cy={point.y} r={5} fill={strokeColor} />
        ))}

      {/* Draw horizontal reference lines */}
      {[0.25, 0.5, 0.75].map((position, i) => (
        <Line
          key={i}
          x1={0}
          y1={height * position}
          x2={width}
          y2={height * position}
          stroke="#333"
          strokeWidth={1}
          strokeDasharray="5, 5"
        />
      ))}
    </Svg>
  );
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const [activeWidgetIndex, setActiveWidgetIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto scrolling configuration - faster transition
  const totalWidgets = 3;
  const scrollInterval = 3000; // 4 seconds per widget (faster)
  const widgetWidth = width * 0.85 - 24;

  // Sample data for widgets
  const workouts = [
    {
      name: "Upper Body",
      duration: "45 mins",
      exercises: 5,
      calories: 320,
      icon: "barbell",
    },
  ];

  const caloriesData = {
    goal: 2500,
    consumed: 1650,
    remaining: 850,
    percentage: 66, // (1650/2500)*100
  };

  const waterData = {
    goal: 8, // in glasses
    consumed: 5,
    remaining: 3,
    percentage: 62.5, // (5/8)*100
  };

  // Sample data for weight tracking
  const weightData = [
    { x: "Apr 2", y: 82.3 },
    { x: "Apr 9", y: 81.8 },
    { x: "Apr 16", y: 80.9 },
    { x: "Apr 23", y: 80.2 },
    { x: "Apr 30", y: 79.5 },
  ];

  // Sample data for body measurements
  const measurementsData = [
    { x: "Apr 2", y: 90.5 }, // Chest
    { x: "Apr 9", y: 90.3 },
    { x: "Apr 16", y: 89.6 },
    { x: "Apr 23", y: 89.0 },
    { x: "Apr 30", y: 88.7 },
  ];

  // Enhanced auto scrolling functionality with smoother animation
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeWidgetIndex + 1) % totalWidgets;
      setActiveWidgetIndex(nextIndex);

      // Animate scroll to next widget with improved timing
      scrollViewRef.current?.scrollTo({
        x: nextIndex * widgetWidth + nextIndex * 16, // Account for margin
        animated: true,
      });
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [activeWidgetIndex]);

  // Handle manual scroll with improved detection
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

  // Pulsing animation for water drops - enhanced for smoother effect
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
    <View className="flex-1 bg-dark-900">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 30,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 mb-8">
          <View>
            <Text className="text-white text-2xl font-bold">
              Hello, <Text className="text-primary">Athlete</Text>
            </Text>
            <Text className="text-gray-400">Let's crush today's workout!</Text>
          </View>

          <TouchableOpacity className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center">
            <Ionicons name="notifications-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Auto-scrolling Widgets - enhanced for smoother animations */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center px-6 mb-4">
            <Text className="text-white text-lg font-bold">
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
                      activeWidgetIndex === i ? "bg-primary" : "bg-gray-700"
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
              className="bg-dark-800 rounded-3xl p-5 border border-dark-700 mr-4"
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
                    <Text className="text-white font-bold text-lg">
                      {workouts[0].name}
                    </Text>
                    <Text className="text-gray-400">
                      {workouts[0].duration} · {workouts[0].exercises} exercises
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#BBFD00" />
              </View>

              <View className="h-[1px] bg-dark-700 my-2" />

              <View className="flex-row justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="flame-outline" size={18} color="#F44336" />
                  <Text className="text-white ml-1">
                    {workouts[0].calories} kcal
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={18} color="#BBFD00" />
                  <Text className="text-white ml-1">
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
              className="bg-dark-800 rounded-3xl p-5 border border-dark-700 mr-4"
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
                    <Text className="text-white font-bold text-lg">
                      Daily Calories
                    </Text>
                    <Text className="text-gray-400">
                      {caloriesData.percentage}% of daily goal
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#FF6B3E" />
              </View>

              <View className="h-3 bg-dark-700 rounded-full overflow-hidden mb-3">
                <View
                  className="h-full bg-[#FF6B3E]"
                  style={{ width: `${caloriesData.percentage}%` }}
                />
              </View>

              <View className="flex-row justify-between">
                <View>
                  <Text className="text-gray-400">Consumed</Text>
                  <Text className="text-white font-bold text-xl">
                    {caloriesData.consumed}
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-400">Remaining</Text>
                  <Text className="text-white font-bold text-xl">
                    {caloriesData.remaining}
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-400">Goal</Text>
                  <Text className="text-white font-bold text-xl">
                    {caloriesData.goal}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Water Intake Widget */}
            <TouchableOpacity
              className="bg-dark-800 rounded-3xl p-5 border border-dark-700"
              style={{ width: widgetWidth }}
              activeOpacity={0.8}
            >
              <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-[#2196F3] items-center justify-center mr-4">
                    <Ionicons name="water" size={24} color="#121212" />
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">
                      Water Intake
                    </Text>
                    <Text className="text-gray-400">
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
                        color={isFilled ? "#2196F3" : "#333"}
                      />
                    </Animated.View>
                  );
                })}
              </View>

              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-400">Progress</Text>
                  <Text className="text-white font-bold text-xl">
                    {waterData.percentage}%
                  </Text>
                </View>

                <View className="flex-row">
                  <TouchableOpacity className="bg-dark-700 w-10 h-10 rounded-full items-center justify-center">
                    <Ionicons name="remove" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-[#2196F3] w-10 h-10 rounded-full items-center justify-center ml-3">
                    <Ionicons name="add" size={24} color="#121212" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Bento Grid Layout */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="px-6 mb-8"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">Quick Access</Text>
          </View>

          <View className="flex-row space-x-4">
            {/* History Widget - Takes up full width in first row */}
            <TouchableOpacity
              className="bg-dark-800 rounded-3xl p-5 border border-dark-700 flex-1"
              activeOpacity={0.8}
              onPress={() => router.navigate("/(main)/history")}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-[#9C27B0] items-center justify-center mr-3">
                    <Ionicons name="time-outline" size={24} color="#121212" />
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">
                      History
                    </Text>
                    <Text className="text-gray-400">View your progress</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9C27B0" />
              </View>

              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-400">This week</Text>
                  <Text className="text-white font-bold text-xl">
                    12 workouts
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-400">Total</Text>
                  <Text className="text-white font-bold text-xl">87 hours</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex-row mt-4 space-x-4">
            {/* Exercises Widget - Half width */}
            <TouchableOpacity
              className="bg-dark-800 rounded-3xl p-5 border border-dark-700 flex-1"
              activeOpacity={0.8}
              onPress={() => router.push("exercises")}
            >
              <View className="w-12 h-12 rounded-full bg-[#FF9800] items-center justify-center mb-3">
                <Ionicons name="fitness-outline" size={24} color="#121212" />
              </View>

              <Text className="text-white font-bold text-lg mb-1">
                Exercises
              </Text>
              <Text className="text-gray-400 text-sm">Browse exercises</Text>

              <View className="absolute top-4 right-4">
                <Ionicons name="chevron-forward" size={24} color="#FF9800" />
              </View>
            </TouchableOpacity>

            {/* Add space between widgets */}
            <View className="w-4" />

            {/* Profile Widget - Half width */}
            <TouchableOpacity
              className="bg-dark-800 rounded-3xl p-5 border border-dark-700 flex-1"
              activeOpacity={0.8}
              onPress={() => router.push("profile")}
            >
              <View className="w-12 h-12 rounded-full bg-[#2196F3] items-center justify-center mb-3">
                <Ionicons name="person-outline" size={24} color="#121212" />
              </View>

              <Text className="text-white font-bold text-lg mb-1">Profile</Text>
              <Text className="text-gray-400 text-sm">View your stats</Text>

              <View className="absolute top-4 right-4">
                <Ionicons name="chevron-forward" size={24} color="#2196F3" />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Weight Tracking Graph */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          className="px-6 mb-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">
              Weight Tracking
            </Text>
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
                  <Text className="text-white font-bold">79.5 kg</Text>
                  <Text className="text-[#4CAF50]">-2.8 kg (April)</Text>
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
              {/* Replace Victory charts with our custom simple chart */}
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

        {/* Body Measurements Graph */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          className="px-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">
              Body Measurements
            </Text>
          </View>

          <TouchableOpacity
            className="bg-dark-800 rounded-3xl p-5 border border-dark-700"
            activeOpacity={0.8}
            onPress={() => router.push("/tracking/body-measurements")}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-[#2196F3]/20 items-center justify-center mr-3">
                  <Ionicons name="body-outline" size={20} color="#2196F3" />
                </View>
                <View>
                  <Text className="text-white font-bold">Chest: 88.7 cm</Text>
                  <Text className="text-[#2196F3]">-1.8 cm (April)</Text>
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
              <TouchableOpacity className="bg-dark-700 px-3 py-1 rounded-full mr-2">
                <Text className="text-white text-xs">Chest</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-dark-900 px-3 py-1 rounded-full mr-2">
                <Text className="text-gray-400 text-xs">Arms</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-dark-900 px-3 py-1 rounded-full mr-2">
                <Text className="text-gray-400 text-xs">Waist</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-dark-900 px-3 py-1 rounded-full mr-2">
                <Text className="text-gray-400 text-xs">Hips</Text>
              </TouchableOpacity>
            </View>

            <View className="h-[180px] px-4 py-2">
              {/* Replace Victory charts with our custom simple chart */}
              <SimpleLineChart
                data={measurementsData}
                width={width - 100}
                height={150}
                strokeColor="#2196F3"
                fillColor="#2196F320"
              />

              {/* X-axis labels */}
              <View className="flex-row justify-between mt-2">
                {measurementsData.map((point, i) =>
                  i % 2 === 0 ? (
                    <Text key={i} className="text-gray-400 text-xs">
                      {point.x}
                    </Text>
                  ) : i === measurementsData.length - 1 ? (
                    <Text key={i} className="text-gray-400 text-xs">
                      {point.x}
                    </Text>
                  ) : null
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import Svg, { Path, Circle, Line, Rect } from "react-native-svg";
import { Dimensions } from "react-native";
import { router } from "expo-router";
import { useTheme } from "../../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

// Define data point type for charts
type DataPoint = {
  x: string;
  y: number;
};

// Custom chart component
const SimpleLineChart = ({
  data,
  width,
  height,
  strokeColor = "#4CAF50",
  fillColor = "#4CAF5020",
  showDots = true,
  showLabels = true,
  isDark = true,
}: {
  data: DataPoint[];
  width: number;
  height: number;
  strokeColor?: string;
  fillColor?: string;
  showDots?: boolean;
  showLabels?: boolean;
  isDark?: boolean;
}) => {
  // Get min/max values for scaling
  const maxY = Math.max(...data.map((d: DataPoint) => d.y)) + 2;
  const minY = Math.min(...data.map((d: DataPoint) => d.y)) - 2;
  const yRange = maxY - minY;

  // Animation values for smooth transitions
  const animationProgress = useSharedValue(0);

  // Trigger animation when data changes
  React.useEffect(() => {
    animationProgress.value = 0;
    animationProgress.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
    });
  }, [data]);

  // Calculate points
  const points = data.map((point: DataPoint, i: number) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((point.y - minY) / yRange) * height * 0.8;
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

  // Fill area under line
  const fillPathData = `${pathData} L ${
    points[points.length - 1].x
  } ${height} L ${points[0].x} ${height} Z`;

  // Animation styles
  const pathAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animationProgress.value,
    transform: [
      {
        translateY: interpolate(
          animationProgress.value,
          [0, 1],
          [height * 0.1, 0]
        ),
      },
      {
        scale: interpolate(animationProgress.value, [0, 1], [0.95, 1]),
      },
    ],
  }));

  const fillAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animationProgress.value * 0.7,
  }));

  const dotsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animationProgress.value,
  }));

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {/* Draw horizontal guide lines */}
        {[0.25, 0.5, 0.75].map((position, i) => (
          <Line
            key={i}
            x1={0}
            y1={height * position}
            x2={width}
            y2={height * position}
            stroke={isDark ? "#333" : "#e0e0e0"}
            strokeWidth={1}
            strokeDasharray="5, 5"
          />
        ))}

        {/* Fill area under the line */}
        <Path d={fillPathData} fill={fillColor} />

        {/* Draw the line */}
        <Path d={pathData} stroke={strokeColor} strokeWidth={3} fill="none" />

        {/* Draw dots at data points */}
        {showDots &&
          points.map((point, i) => (
            <Circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={strokeColor}
            />
          ))}
      </Svg>
    </View>
  );
};

export default function WeightTrackingScreen() {
  const insets = useSafeAreaInsets();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentWeight, setCurrentWeight] = useState("79.5");
  const [timeframe, setTimeframe] = useState("month"); // week, month, year, all
  const { isDark } = useTheme();

  // Sample data for demo
  const monthlyData = [
    { x: "Apr 2", y: 82.3 },
    { x: "Apr 9", y: 81.8 },
    { x: "Apr 16", y: 80.9 },
    { x: "Apr 23", y: 80.2 },
    { x: "Apr 30", y: 79.5 },
  ];

  // More comprehensive data
  const weeklyData = [
    { x: "Apr 24", y: 79.9 },
    { x: "Apr 25", y: 79.8 },
    { x: "Apr 26", y: 79.7 },
    { x: "Apr 27", y: 79.7 },
    { x: "Apr 28", y: 79.6 },
    { x: "Apr 29", y: 79.5 },
    { x: "Apr 30", y: 79.5 },
  ];

  // Sample yearly data
  const yearlyData = [
    { x: "May", y: 84.2 },
    { x: "Jun", y: 83.5 },
    { x: "Jul", y: 82.8 },
    { x: "Aug", y: 82.3 },
    { x: "Sep", y: 81.9 },
    { x: "Oct", y: 81.5 },
    { x: "Nov", y: 81.0 },
    { x: "Dec", y: 80.7 },
    { x: "Jan", y: 80.5 },
    { x: "Feb", y: 80.2 },
    { x: "Mar", y: 79.8 },
    { x: "Apr", y: 79.5 },
  ];

  // Sample all time data
  const allTimeData = [
    { x: "2023", y: 87.5 },
    { x: "2024", y: 83.2 },
    { x: "2025", y: 79.5 },
  ];

  // Choose which data set to show based on selected timeframe
  const getSelectedData = () => {
    switch (timeframe) {
      case "week":
        return weeklyData;
      case "month":
        return monthlyData;
      case "year":
        return yearlyData;
      case "all":
        return allTimeData;
      default:
        return monthlyData;
    }
  };

  const selectedData = getSelectedData();

  // Generate statistics
  const currentValue = selectedData[selectedData.length - 1].y;
  const startValue = selectedData[0].y;
  const change = currentValue - startValue;
  const percentageChange = ((change / startValue) * 100).toFixed(1);

  const handleSaveWeight = () => {
    // Here you would update the weight in your database
    // For this demo, we'll just show an alert
    Alert.alert(
      "Weight Updated",
      `Your weight has been updated to ${currentWeight} kg.`,
      [
        {
          text: "OK",
          onPress: () => setShowUpdateModal(false),
        },
      ]
    );
  };

  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="px-6 pt-2 pb-4 flex-row items-center justify-between"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "white" : "#121212"}
          />
        </TouchableOpacity>
        <Text
          className={
            isDark
              ? "text-white text-xl font-bold"
              : "text-dark-900 text-xl font-bold"
          }
        >
          Weight Tracking
        </Text>
        <TouchableOpacity
          className="bg-[#4CAF50] p-2 rounded-full"
          onPress={() => setShowUpdateModal(true)}
        >
          <Ionicons name="add" size={22} color="#121212" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Current Weight Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="px-6 mb-6"
        >
          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl p-5 border border-dark-700"
                : "bg-white rounded-3xl p-5 border border-light-300 shadow"
            }
          >
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className={isDark ? "text-gray-400" : "text-gray-500"}>
                  Current Weight
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white text-3xl font-bold"
                      : "text-dark-900 text-3xl font-bold"
                  }
                >
                  {currentValue} kg
                </Text>
              </View>

              <View>
                <Text
                  className={`text-right ${
                    change < 0 ? "text-[#4CAF50]" : "text-[#F44336]"
                  }`}
                >
                  {change < 0 ? "" : "+"}
                  {change.toFixed(1)} kg
                </Text>
                <Text
                  className={`text-right ${
                    change < 0 ? "text-[#4CAF50]" : "text-[#F44336]"
                  }`}
                >
                  {change < 0 ? "" : "+"}
                  {percentageChange}%
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Ionicons
                name={change < 0 ? "trending-down" : "trending-up"}
                size={20}
                color={change < 0 ? "#4CAF50" : "#F44336"}
              />
              <Text
                className={isDark ? "text-gray-400 ml-2" : "text-gray-500 ml-2"}
              >
                {timeframe === "week"
                  ? "Past 7 days"
                  : timeframe === "month"
                  ? "Past month"
                  : timeframe === "year"
                  ? "Past 12 months"
                  : "All time"}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Timeframe Selection */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="px-6 mb-4"
        >
          <View
            className={
              isDark
                ? "flex-row bg-dark-800 rounded-full p-1"
                : "flex-row bg-white rounded-full p-1 shadow"
            }
          >
            {["week", "month", "year", "all"].map((period) => (
              <TouchableOpacity
                key={period}
                className={`flex-1 py-2 px-4 rounded-full ${
                  timeframe === period ? "bg-primary" : ""
                }`}
                onPress={() => setTimeframe(period)}
              >
                <Text
                  className={`text-center text-sm ${
                    timeframe === period
                      ? "text-dark-900 font-bold"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Weight Chart */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          className="px-6 mb-6"
        >
          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl p-5 border border-dark-700"
                : "bg-white rounded-3xl p-5 border border-light-300 shadow"
            }
          >
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold mb-4"
                  : "text-dark-900 text-lg font-bold mb-4"
              }
            >
              Weight Trend
            </Text>

            <View className="h-[250px] mb-2">
              <SimpleLineChart
                data={selectedData}
                width={width - 80}
                height={220}
                strokeColor="#4CAF50"
                fillColor="#4CAF5020"
                showDots={true}
                isDark={isDark}
              />
            </View>

            {/* X-axis labels */}
            <View className="flex-row justify-between px-2">
              {selectedData.map((point, i) => (
                <Text
                  key={i}
                  className={
                    isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"
                  }
                  style={{
                    display:
                      timeframe === "week" ||
                      timeframe === "all" ||
                      i % 2 === 0 ||
                      i === selectedData.length - 1
                        ? "flex"
                        : "none",
                  }}
                >
                  {point.x}
                </Text>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Weight History */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          className="px-6 mb-6"
        >
          <Text
            className={
              isDark
                ? "text-white text-lg font-bold mb-4"
                : "text-dark-900 text-lg font-bold mb-4"
            }
          >
            Weight History
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden"
                : "bg-white rounded-3xl border border-light-300 overflow-hidden shadow"
            }
          >
            {selectedData.map((entry, index) => (
              <View
                key={index}
                className={`px-5 py-4 flex-row justify-between items-center ${
                  index < selectedData.length - 1
                    ? isDark
                      ? "border-b border-dark-700"
                      : "border-b border-light-300"
                    : ""
                }`}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-[#4CAF50]/10 items-center justify-center mr-3">
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#4CAF50"
                    />
                  </View>
                  <Text
                    className={
                      isDark
                        ? "text-white font-medium"
                        : "text-dark-900 font-medium"
                    }
                  >
                    {entry.x}
                  </Text>
                </View>
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-lg"
                      : "text-dark-900 font-bold text-lg"
                  }
                >
                  {entry.y} kg
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Update Weight Modal */}
      {showUpdateModal && (
        <View className="absolute inset-0 bg-black/75 justify-center items-center p-6">
          <Animated.View
            entering={FadeIn.duration(200)}
            className={
              isDark
                ? "bg-dark-800 rounded-3xl w-full p-6"
                : "bg-white rounded-3xl w-full p-6 shadow"
            }
          >
            <Text
              className={
                isDark
                  ? "text-white text-xl font-bold mb-6 text-center"
                  : "text-dark-900 text-xl font-bold mb-6 text-center"
              }
            >
              Update Weight
            </Text>

            <View className="flex-row items-center justify-center mb-8">
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 text-white text-3xl font-bold text-center px-6 py-4 rounded-xl w-40"
                    : "bg-light-200 text-dark-900 text-3xl font-bold text-center px-6 py-4 rounded-xl w-40"
                }
                keyboardType="decimal-pad"
                value={currentWeight}
                onChangeText={setCurrentWeight}
                selectionColor="#BBFD00"
              />
              <Text
                className={
                  isDark
                    ? "text-white text-3xl font-bold ml-2"
                    : "text-dark-900 text-3xl font-bold ml-2"
                }
              >
                kg
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                className={
                  isDark
                    ? "bg-dark-700 flex-1 py-4 rounded-full mr-2"
                    : "bg-light-200 flex-1 py-4 rounded-full mr-2"
                }
                onPress={() => setShowUpdateModal(false)}
              >
                <Text
                  className={
                    isDark
                      ? "text-white font-bold text-center"
                      : "text-dark-900 font-bold text-center"
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-primary flex-1 py-4 rounded-full ml-2"
                onPress={handleSaveWeight}
              >
                <Text className="text-dark-900 font-bold text-center">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

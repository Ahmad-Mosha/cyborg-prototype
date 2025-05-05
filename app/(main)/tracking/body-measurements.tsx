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
  Extrapolate,
} from "react-native-reanimated";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { Dimensions } from "react-native";
import { router } from "expo-router";
import { useTheme } from "../../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

// Define types for measurements data
type MeasurementPoint = { x: string; y: number };
type MeasurementsData = Record<BodyPart, MeasurementPoint[]>;
type BodyPart = "chest" | "arms" | "waist" | "hips" | "thighs";
type BodyPartColors = Record<BodyPart, string>;

// Custom chart component
const SimpleLineChart = ({
  data,
  width,
  height,
  strokeColor = "#2196F3",
  fillColor = "#2196F320",
  showDots = true,
  showLabels = true,
  isDark = true,
}: {
  data: MeasurementPoint[];
  width: number;
  height: number;
  strokeColor?: string;
  fillColor?: string;
  showDots?: boolean;
  showLabels?: boolean;
  isDark?: boolean;
}) => {
  // Get min/max values for scaling
  const maxY = Math.max(...data.map((d: MeasurementPoint) => d.y)) + 2;
  const minY = Math.min(...data.map((d: MeasurementPoint) => d.y)) - 2;
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
  }, [data]); // Add data as a dependency to ensure animation triggers when data changes

  // Calculate points
  const points = data.map((point: MeasurementPoint, i: number) => {
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

  // Use animated styles for opacity
  const opacity = useAnimatedStyle(() => {
    return {
      opacity: animationProgress.value,
      transform: [
        {
          scale: interpolate(animationProgress.value, [0, 1], [0.9, 1], {
            extrapolateRight: Extrapolate.CLAMP,
          }),
        },
        {
          translateY: interpolate(
            animationProgress.value,
            [0, 1],
            [height * 0.05, 0],
            { extrapolateRight: Extrapolate.CLAMP }
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[{ width, height }, opacity]}>
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
        <Path d={fillPathData} fill={fillColor} opacity={0.7} />

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
    </Animated.View>
  );
};

export default function BodyMeasurementsScreen() {
  const insets = useSafeAreaInsets();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>("chest");
  const [measurementValue, setMeasurementValue] = useState("88.7");
  const [timeframe, setTimeframe] = useState("month"); // week, month, year, all
  const { isDark } = useTheme();

  // Sample measurements data
  const measurementsData: MeasurementsData = {
    chest: [
      { x: "Apr 2", y: 90.5 },
      { x: "Apr 9", y: 90.3 },
      { x: "Apr 16", y: 89.6 },
      { x: "Apr 23", y: 89.0 },
      { x: "Apr 30", y: 88.7 },
    ],
    arms: [
      { x: "Apr 2", y: 36.2 },
      { x: "Apr 9", y: 36.5 },
      { x: "Apr 16", y: 36.9 },
      { x: "Apr 23", y: 37.2 },
      { x: "Apr 30", y: 37.5 },
    ],
    waist: [
      { x: "Apr 2", y: 83.1 },
      { x: "Apr 9", y: 82.4 },
      { x: "Apr 16", y: 81.7 },
      { x: "Apr 23", y: 81.2 },
      { x: "Apr 30", y: 80.9 },
    ],
    hips: [
      { x: "Apr 2", y: 95.3 },
      { x: "Apr 9", y: 95.0 },
      { x: "Apr 16", y: 94.8 },
      { x: "Apr 23", y: 94.5 },
      { x: "Apr 30", y: 94.2 },
    ],
    thighs: [
      { x: "Apr 2", y: 58.1 },
      { x: "Apr 9", y: 58.3 },
      { x: "Apr 16", y: 58.6 },
      { x: "Apr 23", y: 58.9 },
      { x: "Apr 30", y: 59.3 },
    ],
  };

  // Colors for each body part
  const bodyPartColors: BodyPartColors = {
    chest: "#2196F3",
    arms: "#FF9800",
    waist: "#4CAF50",
    hips: "#9C27B0",
    thighs: "#F44336",
  };

  // Choose the data for the selected body part
  const selectedMeasurementData = measurementsData[selectedBodyPart];

  // Generate statistics
  const currentValue =
    selectedMeasurementData[selectedMeasurementData.length - 1].y;
  const startValue = selectedMeasurementData[0].y;
  const change = currentValue - startValue;
  const percentageChange = ((change / startValue) * 100).toFixed(1);

  const isGain = selectedBodyPart === "arms" || selectedBodyPart === "thighs";
  const isLoss = !isGain;

  // Determine if the change is positive (for muscle groups that should increase)
  // or negative (for areas that should decrease like waist)
  const isPositive = (isGain && change > 0) || (isLoss && change < 0);

  const handleSaveMeasurement = () => {
    // Here you would update the measurement in your database
    // For this demo, we'll just show an alert
    Alert.alert(
      "Measurement Updated",
      `Your ${selectedBodyPart} measurement has been updated to ${measurementValue} cm.`,
      [
        {
          text: "OK",
          onPress: () => setShowUpdateModal(false),
        },
      ]
    );
  };

  const openUpdateModal = (bodyPart: BodyPart) => {
    setSelectedBodyPart(bodyPart);
    setMeasurementValue(
      measurementsData[bodyPart][
        measurementsData[bodyPart].length - 1
      ].y.toString()
    );
    setShowUpdateModal(true);
  };

  // Capitalize first letter
  const capitalize = (s: string): string =>
    s.charAt(0).toUpperCase() + s.slice(1);

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
          Body Measurements
        </Text>
        <TouchableOpacity
          className="bg-[#2196F3] p-2 rounded-full"
          onPress={() => openUpdateModal(selectedBodyPart)}
        >
          <Ionicons name="add" size={22} color="#121212" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Current Measurement Card */}
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
                  {capitalize(selectedBodyPart)} Measurement
                </Text>
                <Text
                  className={
                    isDark
                      ? "text-white text-3xl font-bold"
                      : "text-dark-900 text-3xl font-bold"
                  }
                >
                  {currentValue} cm
                </Text>
              </View>

              <View>
                <Text
                  className={`text-right ${
                    isPositive ? "text-[#4CAF50]" : "text-[#F44336]"
                  }`}
                >
                  {change < 0 ? "" : "+"}
                  {change.toFixed(1)} cm
                </Text>
                <Text
                  className={`text-right ${
                    isPositive ? "text-[#4CAF50]" : "text-[#F44336]"
                  }`}
                >
                  {change < 0 ? "" : "+"}
                  {percentageChange}%
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Ionicons
                name={isPositive ? "trending-up" : "trending-down"}
                size={20}
                color={isPositive ? "#4CAF50" : "#F44336"}
              />
              <Text
                className={isDark ? "text-gray-400 ml-2" : "text-gray-500 ml-2"}
              >
                Past month
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Body Part Selection */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="px-6 mb-6"
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {(Object.keys(measurementsData) as BodyPart[]).map((bodyPart) => (
              <TouchableOpacity
                key={bodyPart}
                className={`py-2 px-4 rounded-full mr-2`}
                style={{
                  backgroundColor:
                    selectedBodyPart === bodyPart
                      ? bodyPartColors[bodyPart]
                      : isDark
                      ? "#1e1e1e"
                      : "#f5f5f5",
                }}
                onPress={() => setSelectedBodyPart(bodyPart)}
              >
                <Text
                  className={`${
                    selectedBodyPart === bodyPart
                      ? "text-dark-900 font-bold"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {capitalize(bodyPart)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Measurement Chart */}
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
              Measurement Trend
            </Text>

            <View className="h-[250px] mb-2">
              <SimpleLineChart
                data={selectedMeasurementData}
                width={width - 80}
                height={220}
                strokeColor={bodyPartColors[selectedBodyPart]}
                fillColor={`${bodyPartColors[selectedBodyPart]}20`}
                showDots={true}
                isDark={isDark}
              />
            </View>

            {/* X-axis labels */}
            <View className="flex-row justify-between px-2">
              {selectedMeasurementData.map((point, i) => (
                <Text
                  key={i}
                  className={
                    isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"
                  }
                >
                  {point.x}
                </Text>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* All Measurements */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          className="px-6 mb-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold"
                  : "text-dark-900 text-lg font-bold"
              }
            >
              All Measurements
            </Text>
            <TouchableOpacity>
              <Text className="text-primary">Export Data</Text>
            </TouchableOpacity>
          </View>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden"
                : "bg-white rounded-3xl border border-light-300 overflow-hidden shadow"
            }
          >
            {(Object.keys(measurementsData) as BodyPart[]).map((bodyPart) => {
              const data = measurementsData[bodyPart];
              const latest = data[data.length - 1].y;
              const first = data[0].y;
              const diff = (latest - first).toFixed(1);
              const numDiff = parseFloat(diff);
              const isGain = bodyPart === "arms" || bodyPart === "thighs";
              const isPositiveChange =
                (isGain && numDiff > 0) || (!isGain && numDiff < 0);

              return (
                <TouchableOpacity
                  key={bodyPart}
                  className={`px-5 py-4 flex-row justify-between items-center ${
                    bodyPart !== "thighs"
                      ? isDark
                        ? "border-b border-dark-700"
                        : "border-b border-light-300"
                      : ""
                  }`}
                  onPress={() => setSelectedBodyPart(bodyPart)}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center mr-3`}
                      style={{
                        backgroundColor: `${bodyPartColors[bodyPart]}20`,
                      }}
                    >
                      <Ionicons
                        name="body-outline"
                        size={18}
                        color={bodyPartColors[bodyPart]}
                      />
                    </View>
                    <Text
                      className={
                        isDark
                          ? "text-white font-medium"
                          : "text-dark-900 font-medium"
                      }
                    >
                      {capitalize(bodyPart)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text
                      className={
                        isDark
                          ? "text-white font-bold text-lg mr-3"
                          : "text-dark-900 font-bold text-lg mr-3"
                      }
                    >
                      {latest} cm
                    </Text>
                    <Text
                      className={
                        isPositiveChange ? "text-[#4CAF50]" : "text-[#F44336]"
                      }
                    >
                      {numDiff > 0 ? "+" : ""}
                      {diff}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Update Measurement Modal */}
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
                  ? "text-white text-xl font-bold mb-2 text-center"
                  : "text-dark-900 text-xl font-bold mb-2 text-center"
              }
            >
              Update Measurement
            </Text>
            <Text
              className={
                isDark
                  ? "text-gray-400 text-center mb-6"
                  : "text-gray-500 text-center mb-6"
              }
            >
              {capitalize(selectedBodyPart)}
            </Text>

            <View className="flex-row items-center justify-center mb-8">
              <TextInput
                className={
                  isDark
                    ? "bg-dark-700 text-white text-3xl font-bold text-center px-6 py-4 rounded-xl w-40"
                    : "bg-light-200 text-dark-900 text-3xl font-bold text-center px-6 py-4 rounded-xl w-40"
                }
                keyboardType="decimal-pad"
                value={measurementValue}
                onChangeText={setMeasurementValue}
                selectionColor="#BBFD00"
              />
              <Text
                className={
                  isDark
                    ? "text-white text-3xl font-bold ml-2"
                    : "text-dark-900 text-3xl font-bold ml-2"
                }
              >
                cm
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
                onPress={handleSaveMeasurement}
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

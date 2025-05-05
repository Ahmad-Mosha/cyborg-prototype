import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

// Import our custom components
import { TodayOverview } from "../../../components/dashboard/TodayOverview";
import { QuickAccess } from "../../../components/dashboard/QuickAccess";
import { WeightTracking } from "../../../components/dashboard/WeightTracking";
import { BodyMeasurements } from "../../../components/dashboard/BodyMeasurements";
import { DataPoint } from "../../../components/dashboard/SimpleLineChart";
import SidebarMenu from "../../../components/ui/SidebarMenu";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

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
  const weightData: DataPoint[] = [
    { x: "Apr 2", y: 82.3 },
    { x: "Apr 9", y: 81.8 },
    { x: "Apr 16", y: 80.9 },
    { x: "Apr 23", y: 80.2 },
    { x: "Apr 30", y: 79.5 },
  ];

  // Sample data for body measurements
  const measurementsData: DataPoint[] = [
    { x: "Apr 2", y: 90.5 }, // Chest
    { x: "Apr 9", y: 90.3 },
    { x: "Apr 16", y: 89.6 },
    { x: "Apr 23", y: 89.0 },
    { x: "Apr 30", y: 88.7 },
  ];

  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
            <Text
              className={
                isDark
                  ? "text-white text-2xl font-bold"
                  : "text-dark-900 text-2xl font-bold"
              }
            >
              Hello, <Text className="text-primary">Athlete</Text>
            </Text>
            <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
              Let's crush today's workout!
            </Text>
          </View>

          <TouchableOpacity
            className={
              isDark
                ? "w-10 h-10 rounded-full bg-dark-800 items-center justify-center"
                : "w-10 h-10 rounded-full bg-light-200 items-center justify-center"
            }
            onPress={() => setSidebarOpen(true)}
          >
            <Ionicons
              name="menu"
              size={22}
              color={isDark ? "white" : "#121212"}
            />
          </TouchableOpacity>
        </View>

        {/* Today's Overview - Auto-scrolling widgets */}
        <TodayOverview
          workouts={workouts}
          caloriesData={caloriesData}
          waterData={waterData}
          isDark={isDark}
        />

        {/* Quick Access Section */}
        <QuickAccess isDark={isDark} />

        {/* Weight Tracking Graph */}
        <WeightTracking
          weightData={weightData}
          currentWeight={79.5}
          weightChange={-2.8}
          period="April"
          isDark={isDark}
        />

        {/* Body Measurements Graph */}
        <BodyMeasurements
          measurementsData={measurementsData}
          currentMeasurement={88.7}
          measurementChange={-1.8}
          period="April"
          isDark={isDark}
        />
      </ScrollView>
    </View>
  );
}

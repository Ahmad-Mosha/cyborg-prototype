import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme } = useTheme();

  // State for toggle switches
  const [notifications, setNotifications] = React.useState(true);
  const [workoutReminders, setWorkoutReminders] = React.useState(true);
  const [mealReminders, setMealReminders] = React.useState(false);
  const [dataSync, setDataSync] = React.useState(true);

  // Wrap the theme toggle in a safe handler to prevent navigation context issues
  const handleThemeToggle = useCallback(() => {
    // Using setTimeout to ensure the toggle happens after current JS execution
    // This helps prevent navigation context issues
    setTimeout(() => {
      toggleTheme();
    }, 0);
  }, [toggleTheme]);

  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity className="pr-4" onPress={() => router.back()}>
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
            Settings
          </Text>
        </View>

        {/* App Preferences Section */}
        <View className="mt-6 px-4">
          <Text
            className={
              isDark
                ? "text-gray-400 text-sm uppercase font-medium mb-2 px-2"
                : "text-gray-600 text-sm uppercase font-medium mb-2 px-2"
            }
          >
            App Preferences
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-xl overflow-hidden"
                : "bg-white rounded-xl overflow-hidden shadow"
            }
          >
            <ToggleSetting
              title="Dark Mode"
              description="Enable dark theme"
              icon="moon-outline"
              isEnabled={isDark}
              onToggle={handleThemeToggle}
            />

            <ToggleSetting
              title="Notifications"
              description="Enable push notifications"
              icon="notifications-outline"
              isEnabled={notifications}
              onToggle={() => setNotifications(!notifications)}
            />
          </View>
        </View>

        {/* Reminders Section */}
        <View className="mt-6 px-4">
          <Text
            className={
              isDark
                ? "text-gray-400 text-sm uppercase font-medium mb-2 px-2"
                : "text-gray-600 text-sm uppercase font-medium mb-2 px-2"
            }
          >
            Reminders
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-xl overflow-hidden"
                : "bg-white rounded-xl overflow-hidden shadow"
            }
          >
            <ToggleSetting
              title="Workout Reminders"
              description="Get notified about scheduled workouts"
              icon="barbell-outline"
              isEnabled={workoutReminders}
              onToggle={() => setWorkoutReminders(!workoutReminders)}
            />

            <ToggleSetting
              title="Meal Tracking Reminders"
              description="Get reminders to log your meals"
              icon="restaurant-outline"
              isEnabled={mealReminders}
              onToggle={() => setMealReminders(!mealReminders)}
              isLast={true}
            />
          </View>
        </View>

        {/* Data & Privacy Section */}
        <View className="mt-6 px-4">
          <Text
            className={
              isDark
                ? "text-gray-400 text-sm uppercase font-medium mb-2 px-2"
                : "text-gray-600 text-sm uppercase font-medium mb-2 px-2"
            }
          >
            Data & Privacy
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-xl overflow-hidden"
                : "bg-white rounded-xl overflow-hidden shadow"
            }
          >
            <ToggleSetting
              title="Sync Data"
              description="Sync your data across devices"
              icon="cloud-upload-outline"
              isEnabled={dataSync}
              onToggle={() => setDataSync(!dataSync)}
            />

            <LinkSetting
              title="Manage Your Data"
              description="View and control your data"
              icon="shield-checkmark-outline"
              onPress={() => console.log("Navigate to data management")}
            />

            <LinkSetting
              title="Privacy Policy"
              description="Read our privacy policy"
              icon="document-text-outline"
              onPress={() => console.log("Open privacy policy")}
              isLast={true}
            />
          </View>
        </View>

        {/* Account Section */}
        <View className="mt-6 px-4">
          <Text
            className={
              isDark
                ? "text-gray-400 text-sm uppercase font-medium mb-2 px-2"
                : "text-gray-600 text-sm uppercase font-medium mb-2 px-2"
            }
          >
            Account
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-xl overflow-hidden"
                : "bg-white rounded-xl overflow-hidden shadow"
            }
          >
            <LinkSetting
              title="Change Password"
              description="Update your account password"
              icon="key-outline"
              onPress={() => console.log("Navigate to change password")}
            />

            <LinkSetting
              title="Subscription"
              description="Manage your subscription"
              icon="card-outline"
              onPress={() => console.log("Navigate to subscription")}
              isLast={true}
            />
          </View>
        </View>

        {/* About Section */}
        <View className="mt-6 px-4">
          <Text
            className={
              isDark
                ? "text-gray-400 text-sm uppercase font-medium mb-2 px-2"
                : "text-gray-600 text-sm uppercase font-medium mb-2 px-2"
            }
          >
            About
          </Text>

          <View
            className={
              isDark
                ? "bg-dark-800 rounded-xl overflow-hidden"
                : "bg-white rounded-xl overflow-hidden shadow"
            }
          >
            <LinkSetting
              title="About CyborgFit"
              description="Learn more about the app"
              icon="information-circle-outline"
              onPress={() => console.log("Navigate to about")}
            />

            <LinkSetting
              title="Rate the App"
              description="Share your feedback with us"
              icon="star-outline"
              onPress={() => console.log("Open app rating")}
            />

            <LinkSetting
              title="Help Center"
              description="Get assistance and support"
              icon="help-buoy-outline"
              onPress={() => console.log("Navigate to help center")}
              isLast={true}
            />
          </View>
        </View>

        {/* Version info */}
        <View className="mt-8 items-center">
          <Text
            className={
              isDark ? "text-gray-500 text-sm" : "text-gray-600 text-sm"
            }
          >
            Version 1.0.0
          </Text>
          <Text
            className={
              isDark
                ? "text-gray-600 text-xs mt-1"
                : "text-gray-500 text-xs mt-1"
            }
          >
            CyborgFit © 2025
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

interface ToggleSettingProps {
  title: string;
  description: string;
  icon: string;
  isEnabled: boolean;
  onToggle: () => void;
  isLast?: boolean;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  title,
  description,
  icon,
  isEnabled,
  onToggle,
  isLast = false,
}) => {
  const { isDark } = useTheme();

  return (
    <View
      className={`flex-row items-center px-4 py-4 ${
        !isLast
          ? isDark
            ? "border-b border-dark-700"
            : "border-b border-gray-200"
          : ""
      }`}
    >
      <View className="bg-primary/10 p-2 rounded-full mr-4">
        <Ionicons name={icon as any} size={20} color="#10b981" />
      </View>
      <View className="flex-1">
        <Text
          className={
            isDark ? "text-white font-medium" : "text-dark-900 font-medium"
          }
        >
          {title}
        </Text>
        <Text
          className={isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}
        >
          {description}
        </Text>
      </View>
      <Switch
        trackColor={{
          false: isDark ? "#3e3e3e" : "#D1D5DB",
          true: "#10b98150",
        }}
        thumbColor={isEnabled ? "#10b981" : isDark ? "#f4f3f4" : "#ffffff"}
        ios_backgroundColor={isDark ? "#3e3e3e" : "#D1D5DB"}
        onValueChange={onToggle}
        value={isEnabled}
      />
    </View>
  );
};

interface LinkSettingProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  isLast?: boolean;
}

const LinkSetting: React.FC<LinkSettingProps> = ({
  title,
  description,
  icon,
  onPress,
  isLast = false,
}) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-4 ${
        !isLast
          ? isDark
            ? "border-b border-dark-700"
            : "border-b border-gray-200"
          : ""
      }`}
      onPress={onPress}
    >
      <View className="bg-primary/10 p-2 rounded-full mr-4">
        <Ionicons name={icon as any} size={20} color="#10b981" />
      </View>
      <View className="flex-1">
        <Text
          className={
            isDark ? "text-white font-medium" : "text-dark-900 font-medium"
          }
        >
          {title}
        </Text>
        <Text
          className={isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}
        >
          {description}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isDark ? "gray" : "#9CA3AF"}
      />
    </TouchableOpacity>
  );
};

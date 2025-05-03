import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  // Sample user data
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    joinDate: "April 2025",
    profilePicture: null, // Replace with actual image path if available
    stats: {
      workoutsCompleted: 42,
      totalWorkoutTime: "35h 20m",
      streakDays: 12,
      caloriesBurned: "15,320",
    },
  };

  return (
    <View className="flex-1 bg-dark-900">
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
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="bg-dark-800 mx-4 rounded-xl p-6 mt-4">
          <View className="flex-row items-center">
            <View className="h-20 w-20 rounded-full bg-primary/20 items-center justify-center mr-4">
              {user.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={36} color="#10b981" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">{user.name}</Text>
              <Text className="text-gray-400">{user.email}</Text>
              <Text className="text-gray-500 text-sm">
                Member since {user.joinDate}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-primary/20 p-2 rounded-full"
              onPress={() => console.log("Edit profile")}
            >
              <Ionicons name="pencil" size={16} color="#10b981" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View className="mt-8 px-4">
          <Text className="text-white text-lg font-bold mb-4">
            Your Fitness Stats
          </Text>
          <View className="flex-row flex-wrap">
            <StatCard
              title="Workouts"
              value={user.stats.workoutsCompleted.toString()}
              icon="fitness"
            />
            <StatCard
              title="Workout Time"
              value={user.stats.totalWorkoutTime}
              icon="time"
            />
            <StatCard
              title="Current Streak"
              value={user.stats.streakDays.toString() + " days"}
              icon="flame"
            />
            <StatCard
              title="Calories Burned"
              value={user.stats.caloriesBurned}
              icon="flash"
            />
          </View>
        </View>

        {/* Account Settings */}
        <View className="mt-8 px-4">
          <Text className="text-white text-lg font-bold mb-4">Account</Text>
          <View className="bg-dark-800 rounded-xl overflow-hidden">
            <MenuItem
              title="Personal Information"
              icon="person-circle-outline"
              onPress={() => console.log("Navigate to personal info")}
            />
            <MenuItem
              title="Goals & Preferences"
              icon="flag-outline"
              onPress={() => console.log("Navigate to goals")}
            />
            <MenuItem
              title="Notifications"
              icon="notifications-outline"
              onPress={() => console.log("Navigate to notifications")}
            />
            <MenuItem
              title="Privacy Settings"
              icon="lock-closed-outline"
              onPress={() => console.log("Navigate to privacy")}
              isLast={true}
            />
          </View>
        </View>

        {/* Help & Support */}
        <View className="mt-8 px-4 mb-4">
          <Text className="text-white text-lg font-bold mb-4">
            Help & Support
          </Text>
          <View className="bg-dark-800 rounded-xl overflow-hidden">
            <MenuItem
              title="FAQ"
              icon="help-circle-outline"
              onPress={() => console.log("Navigate to FAQ")}
            />
            <MenuItem
              title="Contact Support"
              icon="mail-outline"
              onPress={() => console.log("Navigate to support")}
              isLast={true}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <View className="bg-dark-800 rounded-xl p-4 w-[48%] mb-4 mx-1">
      <View className="flex-row items-center mb-2">
        <View className="bg-primary/20 p-2 rounded-full mr-2">
          <Ionicons name={icon as any} size={16} color="#10b981" />
        </View>
        <Text className="text-gray-400 text-sm">{title}</Text>
      </View>
      <Text className="text-white text-lg font-bold">{value}</Text>
    </View>
  );
};

interface MenuItemProps {
  title: string;
  icon: string;
  onPress: () => void;
  isLast?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  icon,
  onPress,
  isLast = false,
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-4 ${
        !isLast ? "border-b border-dark-700" : ""
      }`}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={20} color="#10b981" className="mr-3" />
      <Text className="text-white flex-1">{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="gray" />
    </TouchableOpacity>
  );
};

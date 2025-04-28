import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-dark-900">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: 100, // Extra space for bottom tab bar
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

        {/* Today's Workout */}
        <Animated.View
          entering={FadeInRight.delay(100).duration(500)}
          className="px-6 mb-8"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">
              Today's Workout
            </Text>
            <TouchableOpacity>
              <Text className="text-primary">View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-dark-800 rounded-3xl p-5 border border-dark-700">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-4">
                  <Ionicons name="barbell" size={24} color="#121212" />
                </View>
                <View>
                  <Text className="text-white font-bold text-lg">
                    Upper Body
                  </Text>
                  <Text className="text-gray-400">
                    45 minutes · 5 exercises
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#BBFD00" />
            </View>

            <View className="h-[1px] bg-dark-700 my-2" />

            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <Ionicons name="flame-outline" size={18} color="#F44336" />
                <Text className="text-white ml-1">320 kcal</Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={18} color="#BBFD00" />
                <Text className="text-white ml-1">45 mins</Text>
              </View>

              <TouchableOpacity className="bg-primary px-4 py-2 rounded-full flex-row items-center">
                <Ionicons name="play" size={16} color="#121212" />
                <Text className="text-dark-900 font-bold ml-1">Start</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Weekly Progress */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="px-6 mb-8"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">
              Weekly Progress
            </Text>
            <TouchableOpacity>
              <Text className="text-primary">See Details</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-dark-800 rounded-3xl p-5 border border-dark-700">
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-gray-400 mb-1">Completed Workouts</Text>
                <Text className="text-white text-xl font-bold">
                  12{" "}
                  <Text className="text-gray-400 text-sm font-normal">
                    / 16
                  </Text>
                </Text>
              </View>

              <View>
                <Text className="text-gray-400 mb-1">Calories Burned</Text>
                <Text className="text-white text-xl font-bold">
                  2,450{" "}
                  <Text className="text-gray-400 text-sm font-normal">
                    kcal
                  </Text>
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between h-20 mb-2">
              {Array.from({ length: 7 }).map((_, index) => {
                const day = ["M", "T", "W", "T", "F", "S", "S"][index];
                const height = [60, 40, 80, 30, 50, 70, 45][index];
                const isActive = index === 2; // Highlight Wednesday for example

                return (
                  <View key={index} className="items-center">
                    <View className="flex-1 w-10 justify-end">
                      <View
                        className={`w-6 rounded-full ${
                          isActive ? "bg-primary" : "bg-gray-600"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </View>
                    <Text
                      className={`mt-2 ${
                        isActive ? "text-primary" : "text-gray-400"
                      }`}
                    >
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          className="px-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">
              Your Achievements
            </Text>
            <TouchableOpacity>
              <Text className="text-primary">View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {[
              {
                title: "Early Bird",
                desc: "Complete 5 morning workouts",
                icon: "sunny-outline",
                color: "#FFC107",
                progress: 80,
              },
              {
                title: "Consistency",
                desc: "Work out 7 days in a row",
                icon: "calendar-outline",
                color: "#2196F3",
                progress: 60,
              },
              {
                title: "Strength Master",
                desc: "Lift 1000kg total in a session",
                icon: "barbell-outline",
                color: "#4CAF50",
                progress: 30,
              },
            ].map((achievement, index) => (
              <TouchableOpacity
                key={index}
                className="bg-dark-800 rounded-3xl p-5 mr-4 border border-dark-700"
                style={{ width: 180 }}
              >
                <View className="flex-row items-center mb-3">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: achievement.color + "20" }}
                  >
                    <Ionicons
                      name={achievement.icon as any}
                      size={20}
                      color={achievement.color}
                    />
                  </View>
                  <Text className="text-white font-bold" numberOfLines={1}>
                    {achievement.title}
                  </Text>
                </View>

                <Text className="text-gray-400 text-sm mb-3" numberOfLines={2}>
                  {achievement.desc}
                </Text>

                <View className="h-2 bg-dark-700 rounded-full">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${achievement.progress}%`,
                      backgroundColor: achievement.color,
                    }}
                  />
                </View>

                <Text className="text-gray-400 text-xs mt-2 text-right">
                  {achievement.progress}%
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

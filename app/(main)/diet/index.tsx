import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { router } from "expo-router";

export default function DietScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("meals");

  const handleMealPress = (meal) => {
    router.push({
      pathname: "/diet/meal-details",
      params: { 
        mealId: meal.title.toLowerCase(),
        mealTitle: meal.title,
        mealTime: meal.time,
        mealCalories: meal.calories,
        mealItems: meal.items,
        mealColor: meal.color 
      }
    });
  };

  return (
    <View className="flex-1 bg-dark-900">
      {/* Header */}
      <View style={{ paddingTop: insets.top + 30 }} className="px-6 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-2xl font-bold">Diet Plan</Text>
        </View>
      </View>

      {/* Diet Tabs */}
      <View className="flex-row px-6 mb-5">
        {["meals", "nutrition", "water", "supplements"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`mr-4 pb-2 ${
              activeTab === tab ? "border-b-2 border-primary" : ""
            }`}
          >
            <Text
              className={`text-base ${
                activeTab === tab ? "text-primary font-bold" : "text-gray-400"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "meals" && (
          <>
            {/* Nutrition Stats */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(500)}
              className="px-6 mb-6"
            >
              <View className="bg-dark-800 rounded-3xl border border-dark-700 p-5">
                <Text className="text-gray-300 mb-3">
                  Daily Nutrition Goals
                </Text>
                <View className="flex-row justify-between mb-4">
                  <View className="items-center">
                    <View className="w-16 h-16 rounded-full border-4 border-primary items-center justify-center mb-2">
                      <Text className="text-white text-lg font-bold">65%</Text>
                    </View>
                    <Text className="text-gray-400 text-sm">Proteins</Text>
                    <Text className="text-white text-base font-bold">130g</Text>
                  </View>

                  <View className="items-center">
                    <View className="w-16 h-16 rounded-full border-4 border-[#FF9800] items-center justify-center mb-2">
                      <Text className="text-white text-lg font-bold">25%</Text>
                    </View>
                    <Text className="text-gray-400 text-sm">Carbs</Text>
                    <Text className="text-white text-base font-bold">200g</Text>
                  </View>

                  <View className="items-center">
                    <View className="w-16 h-16 rounded-full border-4 border-[#2196F3] items-center justify-center mb-2">
                      <Text className="text-white text-lg font-bold">10%</Text>
                    </View>
                    <Text className="text-gray-400 text-sm">Fats</Text>
                    <Text className="text-white text-base font-bold">45g</Text>
                  </View>
                </View>

                <View className="w-full h-[6px] bg-dark-700 rounded-full flex-row overflow-hidden">
                  <View
                    className="h-full bg-primary"
                    style={{ width: "65%" }}
                  />
                  <View
                    className="h-full bg-[#FF9800]"
                    style={{ width: "25%" }}
                  />
                  <View
                    className="h-full bg-[#2196F3]"
                    style={{ width: "10%" }}
                  />
                </View>
              </View>
            </Animated.View>

            {/* Meal Plans for today */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(500)}
              className="px-6"
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-lg font-bold">
                  Today's Meals
                </Text>
                <TouchableOpacity>
                  <Text className="text-primary">Customize</Text>
                </TouchableOpacity>
              </View>

              {[
                {
                  time: "7:30 AM",
                  title: "Breakfast",
                  calories: 420,
                  items: "Protein Smoothie, Eggs, Oatmeal",
                  complete: true,
                  color: "#2196F3",
                },
                {
                  time: "10:30 AM",
                  title: "Snack",
                  calories: 150,
                  items: "Greek Yogurt, Almonds",
                  complete: true,
                  color: "#FF9800",
                },
                {
                  time: "1:00 PM",
                  title: "Lunch",
                  calories: 620,
                  items: "Chicken Breast, Brown Rice, Vegetables",
                  complete: false,
                  color: "#4CAF50",
                },
                {
                  time: "4:30 PM",
                  title: "Pre-Workout",
                  calories: 250,
                  items: "Protein Bar, Banana",
                  complete: false,
                  color: "#9C27B0",
                },
                {
                  time: "7:30 PM",
                  title: "Dinner",
                  calories: 580,
                  items: "Salmon, Sweet Potato, Broccoli",
                  complete: false,
                  color: "#F44336",
                },
              ].map((meal, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-dark-800 rounded-3xl border border-dark-700 p-5 mb-4"
                  onPress={() => handleMealPress(meal)}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: meal.color + "20" }}
                      >
                        <Ionicons
                          name={
                            meal.complete ? "checkmark-circle" : "time-outline"
                          }
                          size={20}
                          color={meal.color}
                        />
                      </View>
                      <View>
                        <Text className="text-gray-400 text-sm">
                          {meal.time}
                        </Text>
                        <Text className="text-white font-bold text-base">
                          {meal.title}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center">
                      <Text className="text-white font-bold text-right mr-2">
                        {meal.calories}{" "}
                        <Text className="text-gray-400 font-normal">kcal</Text>
                      </Text>
                      <Ionicons name="chevron-forward" size={18} color="#777777" />
                    </View>
                  </View>

                  <Text className="text-gray-400 ml-13" numberOfLines={1}>
                    {meal.items}
                  </Text>

                  {!meal.complete && (
                    <TouchableOpacity 
                      className="bg-dark-700 self-start rounded-full px-4 py-2 mt-3 ml-13"
                      onPress={(e) => {
                        e.stopPropagation();
                        // Mark meal as eaten functionality would go here
                      }}
                    >
                      <Text className="text-white text-sm">Mark as eaten</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          </>
        )}

        {activeTab === "nutrition" && (
          <View className="px-6 items-center justify-center">
            <Text className="text-white text-lg">
              Nutrition tracking coming soon
            </Text>
          </View>
        )}

        {activeTab === "water" && (
          <View className="px-6 items-center justify-center">
            <Text className="text-white text-lg">
              Water tracking coming soon
            </Text>
          </View>
        )}

        {activeTab === "supplements" && (
          <View className="px-6 items-center justify-center">
            <Text className="text-white text-lg">
              Supplements tracking coming soon
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

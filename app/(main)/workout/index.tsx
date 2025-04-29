import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeIn,
  SlideInRight,
} from "react-native-reanimated";

import {
  Category,
  Workout,
  WorkoutPlan,
  Exercise,
  WorkoutCardProps,
  PlanCardProps,
  ExerciseItemProps,
} from "@/types/workout";

const { width } = Dimensions.get("window");

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Workout categories
  const categories: Category[] = [
    { id: "all", name: "All" },
    { id: "strength", name: "Strength" },
    { id: "cardio", name: "Cardio" },
    { id: "hiit", name: "HIIT" },
    { id: "yoga", name: "Yoga" },
    { id: "recovery", name: "Recovery" },
  ];

  // Featured workout
  const featuredWorkout: Workout = {
    id: "featured",
    title: "Full Body Power",
    level: "Advanced",
    duration: "45 min",
    calories: 420,
    category: "strength",
    coach: "Alex Mercer",
    image: "https://via.placeholder.com/600/121212/BBFD00?text=Full+Body+Power",
  };

  // Workout plans
  const workoutPlans = [
    {
      id: "1",
      title: "30-Day Strength",
      description: "Build strength and muscle with this comprehensive plan",
      image:
        "https://via.placeholder.com/600/121212/BBFD00?text=30+Day+Strength",
      duration: "30 days",
      workouts: 24,
      category: "strength",
    },
    {
      id: "2",
      title: "HIIT Fat Burner",
      description: "High intensity interval training to maximize calorie burn",
      image:
        "https://via.placeholder.com/600/121212/BBFD00?text=HIIT+Fat+Burner",
      duration: "14 days",
      workouts: 12,
      category: "hiit",
    },
    {
      id: "3",
      title: "Yoga Flow",
      description: "Improve flexibility and mindfulness",
      image: "https://via.placeholder.com/600/121212/BBFD00?text=Yoga+Flow",
      duration: "21 days",
      workouts: 18,
      category: "yoga",
    },
  ];

  // Today's recommended workouts
  const recommendedWorkouts = [
    {
      id: "1",
      title: "Upper Body Focus",
      level: "Intermediate",
      duration: "35 min",
      calories: 350,
      category: "strength",
      image: "https://via.placeholder.com/600/121212/BBFD00?text=Upper+Body",
    },
    {
      id: "2",
      title: "HIIT Cardio Blast",
      level: "Advanced",
      duration: "25 min",
      calories: 300,
      category: "hiit",
      image: "https://via.placeholder.com/600/121212/BBFD00?text=HIIT+Cardio",
    },
    {
      id: "3",
      title: "Core Crusher",
      level: "Beginner",
      duration: "20 min",
      calories: 180,
      category: "strength",
      image: "https://via.placeholder.com/600/121212/BBFD00?text=Core+Crusher",
    },
    {
      id: "4",
      title: "Recovery Stretch",
      level: "All Levels",
      duration: "15 min",
      calories: 90,
      category: "recovery",
      image: "https://via.placeholder.com/600/121212/BBFD00?text=Recovery",
    },
  ];

  // Filtered workouts based on selected category
  const filteredWorkouts =
    selectedCategory === "all"
      ? recommendedWorkouts
      : recommendedWorkouts.filter(
          (workout) => workout.category === selectedCategory
        );

  // Workout card component
  const WorkoutCard = ({ workout }: WorkoutCardProps) => {
    return (
      <TouchableOpacity className="mr-4 w-64 rounded-3xl overflow-hidden bg-dark-800 border border-dark-700">
        <Image
          source={{ uri: workout.image }}
          className="w-full h-32"
          resizeMode="cover"
        />

        <View className="p-3">
          <Text className="text-white font-bold text-lg mb-1">
            {workout.title}
          </Text>

          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#A0A0A0" />
              <Text className="text-gray-400 ml-1">{workout.duration}</Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="flame-outline" size={16} color="#A0A0A0" />
              <Text className="text-gray-400 ml-1">
                {workout.calories} kcal
              </Text>
            </View>
          </View>

          <View className="bg-dark-700 self-start px-3 py-1 rounded-full">
            <Text className="text-white text-xs">{workout.level}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Plan card component
  const PlanCard = ({ plan }: PlanCardProps) => {
    return (
      <TouchableOpacity className="mr-4 w-64 rounded-3xl overflow-hidden bg-dark-800 border border-dark-700">
        <Image
          source={{ uri: plan.image }}
          className="w-full h-32"
          resizeMode="cover"
        />

        <View className="p-3">
          <Text className="text-white font-bold text-lg mb-1">
            {plan.title}
          </Text>
          <Text className="text-gray-400 text-sm mb-2" numberOfLines={2}>
            {plan.description}
          </Text>

          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="#A0A0A0" />
              <Text className="text-gray-400 ml-1">{plan.duration}</Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="barbell-outline" size={16} color="#A0A0A0" />
              <Text className="text-gray-400 ml-1">
                {plan.workouts} workouts
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Exercise item component for the workout details
  const ExerciseItem = ({ name, sets, reps, rest }: ExerciseItemProps) => {
    return (
      <View className="flex-row items-center justify-between py-3 border-b border-dark-700">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-dark-700 items-center justify-center mr-3">
            <Ionicons name="barbell-outline" size={18} color="#BBFD00" />
          </View>
          <Text className="text-white font-medium">{name}</Text>
        </View>

        <View className="flex-row">
          <View className="items-center mr-4">
            <Text className="text-gray-400 text-xs">Sets</Text>
            <Text className="text-white font-bold">{sets}</Text>
          </View>

          <View className="items-center mr-4">
            <Text className="text-gray-400 text-xs">Reps</Text>
            <Text className="text-white font-bold">{reps}</Text>
          </View>

          <View className="items-center">
            <Text className="text-gray-400 text-xs">Rest</Text>
            <Text className="text-white font-bold">{rest}s</Text>
          </View>
        </View>
      </View>
    );
  };

  // Featured workout details panel
  const WorkoutDetails = () => {
    return (
      <Animated.View
        entering={SlideInRight.duration(400)}
        className="absolute right-0 top-0 bottom-0 bg-dark-800 w-[90%] rounded-l-3xl border-l border-dark-700 z-10"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="p-6">
            <TouchableOpacity className="self-start mb-4">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <Image
              source={{ uri: featuredWorkout.image }}
              className="w-full h-48 rounded-3xl mb-4"
              resizeMode="cover"
            />

            <Text className="text-white text-2xl font-bold mb-1">
              {featuredWorkout.title}
            </Text>
            <Text className="text-gray-400 mb-4">
              with {featuredWorkout.coach}
            </Text>

            <View className="flex-row justify-between mb-6">
              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-dark-700 items-center justify-center mb-1">
                  <Ionicons name="time-outline" size={22} color="#BBFD00" />
                </View>
                <Text className="text-white font-bold">
                  {featuredWorkout.duration}
                </Text>
                <Text className="text-gray-400 text-xs">Duration</Text>
              </View>

              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-dark-700 items-center justify-center mb-1">
                  <Ionicons name="flame-outline" size={22} color="#F44336" />
                </View>
                <Text className="text-white font-bold">
                  {featuredWorkout.calories}
                </Text>
                <Text className="text-gray-400 text-xs">Calories</Text>
              </View>

              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-dark-700 items-center justify-center mb-1">
                  <Ionicons name="fitness-outline" size={22} color="#2196F3" />
                </View>
                <Text className="text-white font-bold">
                  {featuredWorkout.level}
                </Text>
                <Text className="text-gray-400 text-xs">Level</Text>
              </View>
            </View>

            <Text className="text-white text-lg font-bold mb-4">Exercises</Text>

            {[
              { name: "Barbell Bench Press", sets: 4, reps: "10-12", rest: 60 },
              {
                name: "Incline Dumbbell Press",
                sets: 3,
                reps: "12-15",
                rest: 45,
              },
              { name: "Cable Flyes", sets: 3, reps: "15-20", rest: 45 },
              { name: "Tricep Pushdowns", sets: 4, reps: "12-15", rest: 45 },
              { name: "Skull Crushers", sets: 3, reps: "10-12", rest: 60 },
              { name: "Lateral Raises", sets: 3, reps: "15-20", rest: 30 },
            ].map((exercise, index) => (
              <ExerciseItem key={index} {...exercise} />
            ))}

            <TouchableOpacity className="bg-primary py-4 rounded-full mt-6">
              <Text className="text-dark-900 font-bold text-center text-lg">
                Start Workout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-dark-900">
      {/* Header */}
      <View style={{ paddingTop: insets.top + 30 }} className="px-6 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-2xl font-bold">Workouts</Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center">
            <Ionicons name="options-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100, // Extra space for bottom tab bar
        }}
      >
        {/* Category selection */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          className="mb-6"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedCategory === category.id
                  ? "bg-primary"
                  : "bg-dark-800 border border-dark-700"
              }`}
            >
              <Text
                className={
                  selectedCategory === category.id
                    ? "text-dark-900 font-bold"
                    : "text-white"
                }
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured workout */}
        <Animated.View
          entering={FadeIn.delay(100).duration(500)}
          className="px-6 mb-8"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">
              Featured Workout
            </Text>
          </View>

          <TouchableOpacity className="bg-dark-800 rounded-3xl overflow-hidden border border-dark-700">
            <Image
              source={{ uri: featuredWorkout.image }}
              className="w-full h-48"
              resizeMode="cover"
            />

            <View className="p-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-bold text-xl">
                  {featuredWorkout.title}
                </Text>
                <View className="bg-primary/20 px-3 py-1 rounded-full">
                  <Text className="text-primary font-bold">
                    {featuredWorkout.level}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mb-4">
                <View className="flex-row items-center">
                  <Ionicons
                    name="person-circle-outline"
                    size={18}
                    color="#A0A0A0"
                  />
                  <Text className="text-gray-400 ml-1">
                    with {featuredWorkout.coach}
                  </Text>
                </View>

                <View className="flex-row">
                  <View className="flex-row items-center mr-3">
                    <Ionicons name="time-outline" size={16} color="#A0A0A0" />
                    <Text className="text-gray-400 ml-1">
                      {featuredWorkout.duration}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons name="flame-outline" size={16} color="#A0A0A0" />
                    <Text className="text-gray-400 ml-1">
                      {featuredWorkout.calories} kcal
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity className="bg-primary py-3 rounded-full flex-row items-center justify-center">
                <Ionicons name="play" size={18} color="#121212" />
                <Text className="text-dark-900 font-bold ml-2">
                  Start Workout
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Workout Plans */}
        <View className="mb-8">
          <View className="px-6 mb-4 flex-row justify-between items-center">
            <Text className="text-white text-lg font-bold">Workout Plans</Text>
            <TouchableOpacity>
              <Text className="text-primary">View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
          >
            {workoutPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </ScrollView>
        </View>

        {/* Recommended workouts */}
        <View>
          <View className="px-6 mb-4">
            <Text className="text-white text-lg font-bold">
              Recommended for You
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
          >
            {filteredWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Uncomment to show workout details panel */}
      {/* <WorkoutDetails /> */}
    </View>
  );
}

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  SlideInRight,
  Layout,
} from "react-native-reanimated";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

// Import our newly created components
import {
  Calendar,
  WorkoutHistoryItem,
  DietHistoryItem,
  WorkoutDetail,
  MealDetail,
} from "../../../components/history";

// Import types
import { Workout, Meal, DateString } from "../../../types/history";

const { width } = Dimensions.get("window");

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  // Tab state and animations
  const [activeTab, setActiveTab] = useState("workouts");
  const tabIndicatorPosition = useSharedValue(0);

  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeDate, setActiveDate] = useState<DateString>("2025-04-24");

  // Format selected date for display
  const formattedDate = useMemo(() => {
    const date = new Date(activeDate);
    const today = new Date();

    // Check if the selected date is today
    const isToday = date.toDateString() === today.toDateString();

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return isToday
      ? `Today - ${date.toLocaleDateString("en-US", options)}`
      : date.toLocaleDateString("en-US", options);
  }, [activeDate]);

  // Selected workout/meal state for detail view
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Sample workout dates with activity (for calendar highlighting)
  const workoutDates: DateString[] = [
    "2025-04-14",
    "2025-04-16",
    "2025-04-18",
    "2025-04-24",
    "2025-04-28",
    "2025-05-01",
  ];

  // Sample diet dates with activity (for calendar highlighting)
  const dietDates: DateString[] = [
    "2025-04-14",
    "2025-04-15",
    "2025-04-16",
    "2025-04-17",
    "2025-04-18",
    "2025-04-24",
    "2025-04-28",
    "2025-05-01",
  ];

  // Sample workout data
  const workouts: Workout[] = [
    {
      id: "1",
      name: "Chest-back",
      date: "Wednesday, May 6, 2025",
      duration: "1h 15m",
      sets: 18,
      exerciseCount: 6,
      volume: 14837,
      prs: 3,
      notes: "Great workout today! Felt strong on chest press.",
      exercises: [
        {
          name: "Incline Chest Press (Machine)",
          sets: [
            { weight: 30, reps: 10, volume: "40", isPersonalBest: false },
            { weight: 35, reps: 8, volume: "43", isPersonalBest: false },
            { weight: 35, reps: 8, volume: "43", isPersonalBest: false },
          ],
        },
        {
          name: "Lat Pulldown - Wide Grip (Cable)",
          sets: [
            { weight: 90, reps: 10, volume: "120", isPersonalBest: false },
            { weight: 110, reps: 8, volume: "137", isPersonalBest: true },
            { weight: 110, reps: 7, volume: "132", isPersonalBest: false },
          ],
        },
        {
          name: "Chest Press (Machine)",
          sets: [
            { weight: 80, reps: 10, volume: "107", isPersonalBest: false },
            { weight: 90, reps: 7, volume: "108", isPersonalBest: false },
            { weight: 90, reps: 6, volume: "105", isPersonalBest: false },
          ],
        },
        {
          name: "Lat Pulldown (Single Arm)",
          sets: [
            { weight: 60, reps: 10, volume: "80", isPersonalBest: false },
            { weight: 60, reps: 8, volume: "74", isPersonalBest: false },
          ],
        },
        {
          name: "Cable Crossover",
          sets: [
            { weight: 20, reps: 12, volume: "28", isPersonalBest: false },
            { weight: 25, reps: 12, volume: "35", isPersonalBest: false },
            { weight: 30, reps: 8, volume: "37", isPersonalBest: true },
            { weight: 20, reps: 10, volume: "27", isPersonalBest: false },
            { weight: 25, reps: 10, volume: "33", isPersonalBest: false },
          ],
        },
        {
          name: "Seated Wide-Grip Row (Cable)",
          sets: [{ weight: 75, reps: 10, volume: "100", isPersonalBest: true }],
        },
      ],
    },
    {
      id: "2",
      name: "Arms",
      date: "Monday, May 4, 2025",
      duration: "1h 24m",
      sets: 24,
      exerciseCount: 8,
      volume: 32860,
      prs: 7,
      notes: "Arms day was intense. New PR on tricep pushdowns!",
      exercises: [
        {
          name: "Preacher Curl (Machine)",
          sets: [
            { weight: 30, reps: 12, volume: "45", isPersonalBest: true },
            { weight: 35, reps: 10, volume: "50", isPersonalBest: false },
            { weight: 35, reps: 9, volume: "48", isPersonalBest: false },
          ],
        },
        {
          name: "Triceps Pushdown (Cable)",
          sets: [
            { weight: 90, reps: 15, volume: "135", isPersonalBest: true },
            { weight: 95, reps: 12, volume: "122", isPersonalBest: true },
            { weight: 90, reps: 10, volume: "110", isPersonalBest: false },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Evening Workout",
      date: "Friday, May 1, 2025",
      duration: "1h 15m",
      sets: 16,
      exerciseCount: 5,
      volume: 14837,
      prs: 3,
      notes: "Focused on shoulders today. Great pump!",
      exercises: [
        {
          name: "Shoulder Press (Plate Loaded)",
          sets: [
            { weight: 40, reps: 6, volume: "40", isPersonalBest: true },
            { weight: 35, reps: 10, volume: "43", isPersonalBest: false },
            { weight: 35, reps: 8, volume: "40", isPersonalBest: false },
          ],
        },
        {
          name: "Lateral Raise (Cable)",
          sets: [
            { weight: 20, reps: 10, volume: "25", isPersonalBest: false },
            { weight: 20, reps: 10, volume: "25", isPersonalBest: false },
            { weight: 20, reps: 10, volume: "25", isPersonalBest: false },
            { weight: 15, reps: 12, volume: "20", isPersonalBest: false },
            { weight: 15, reps: 12, volume: "20", isPersonalBest: false },
            { weight: 15, reps: 12, volume: "20", isPersonalBest: false },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "Legs Day",
      date: "Saturday, April 26, 2025",
      duration: "1h 45m",
      sets: 20,
      exerciseCount: 6,
      volume: 22560,
      prs: 2,
      notes: "Heavy squat day. Feeling great progress.",
      exercises: [
        {
          name: "Barbell Squat",
          sets: [
            { weight: 135, reps: 10, volume: "1350", isPersonalBest: false },
            { weight: 185, reps: 8, volume: "1480", isPersonalBest: false },
            { weight: 225, reps: 5, volume: "1125", isPersonalBest: true },
          ],
        },
      ],
    },
    {
      id: "5",
      name: "Upper Body",
      date: "Sunday, April 20, 2025",
      duration: "55m",
      sets: 15,
      exerciseCount: 4,
      volume: 9250,
      prs: 1,
      notes: "Quick upper body session.",
      exercises: [
        {
          name: "Bench Press",
          sets: [
            { weight: 135, reps: 10, volume: "1350", isPersonalBest: false },
            { weight: 155, reps: 8, volume: "1240", isPersonalBest: false },
          ],
        },
      ],
    },
    {
      id: "6",
      name: "Core Focus",
      date: "Thursday, April 17, 2025",
      duration: "45m",
      sets: 12,
      exerciseCount: 4,
      volume: 0,
      prs: 0,
      notes: "Focused on core strength today.",
      exercises: [
        {
          name: "Planks",
          sets: [
            { weight: 0, reps: 60, volume: "60s", isPersonalBest: false },
            { weight: 0, reps: 45, volume: "45s", isPersonalBest: false },
          ],
        },
      ],
    },
  ];

  // Sample meal data
  const meals: Meal[] = [
    {
      id: "1",
      title: "Breakfast",
      date: "Wednesday, May 6, 2025",
      time: "8:30 AM",
      calories: 620,
      protein: 35,
      carbs: 65,
      fat: 22,
      color: "#FF9800",
      items: [
        {
          name: "Scrambled Eggs",
          amount: "3 eggs",
          calories: 210,
          macros: "P: 18g, C: 2g, F: 15g",
          icon: "egg-outline",
          color: "#FF9800",
        },
        {
          name: "Whole Wheat Toast",
          amount: "2 slices",
          calories: 180,
          macros: "P: 8g, C: 30g, F: 2g",
          icon: "restaurant-outline",
          color: "#8D6E63",
        },
        {
          name: "Avocado",
          amount: "1/2 medium",
          calories: 120,
          macros: "P: 1g, C: 6g, F: 10g",
          icon: "leaf-outline",
          color: "#4CAF50",
        },
        {
          name: "Protein Shake",
          amount: "1 scoop",
          calories: 110,
          macros: "P: 20g, C: 3g, F: 1g",
          icon: "cafe-outline",
          color: "#9C27B0",
        },
      ],
    },
    {
      id: "2",
      title: "Lunch",
      date: "Wednesday, May 6, 2025",
      time: "1:00 PM",
      calories: 850,
      protein: 55,
      carbs: 85,
      fat: 30,
      color: "#2196F3",
      items: [
        {
          name: "Grilled Chicken Breast",
          amount: "6 oz",
          calories: 180,
          macros: "P: 36g, C: 0g, F: 4g",
          icon: "restaurant-outline",
          color: "#FF5722",
        },
        {
          name: "Brown Rice",
          amount: "1 cup",
          calories: 220,
          macros: "P: 5g, C: 45g, F: 2g",
          icon: "restaurant-outline",
          color: "#8D6E63",
        },
        {
          name: "Mixed Vegetables",
          amount: "2 cups",
          calories: 120,
          macros: "P: 4g, C: 24g, F: 0g",
          icon: "leaf-outline",
          color: "#4CAF50",
        },
        {
          name: "Olive Oil",
          amount: "1 tbsp",
          calories: 120,
          macros: "P: 0g, C: 0g, F: 14g",
          icon: "water-outline",
          color: "#FFC107",
        },
      ],
    },
    {
      id: "3",
      title: "Dinner",
      date: "Tuesday, May 5, 2025",
      time: "7:30 PM",
      calories: 720,
      protein: 45,
      carbs: 60,
      fat: 28,
      color: "#F44336",
      items: [
        {
          name: "Salmon",
          amount: "5 oz",
          calories: 250,
          macros: "P: 30g, C: 0g, F: 14g",
          icon: "fish-outline",
          color: "#F44336",
        },
        {
          name: "Sweet Potato",
          amount: "1 medium",
          calories: 180,
          macros: "P: 4g, C: 40g, F: 0g",
          icon: "restaurant-outline",
          color: "#FF9800",
        },
        {
          name: "Broccoli",
          amount: "2 cups",
          calories: 110,
          macros: "P: 6g, C: 20g, F: 1g",
          icon: "leaf-outline",
          color: "#4CAF50",
        },
        {
          name: "Butter",
          amount: "1 tbsp",
          calories: 100,
          macros: "P: 0g, C: 0g, F: 12g",
          icon: "square-outline",
          color: "#FFC107",
        },
      ],
    },
    {
      id: "4",
      title: "Post-workout Shake",
      date: "Monday, May 4, 2025",
      time: "5:00 PM",
      calories: 350,
      protein: 30,
      carbs: 40,
      fat: 8,
      color: "#9C27B0",
      items: [
        {
          name: "Protein Powder",
          amount: "2 scoops",
          calories: 240,
          macros: "P: 48g, C: 6g, F: 2g",
          icon: "cafe-outline",
          color: "#9C27B0",
        },
        {
          name: "Banana",
          amount: "1 medium",
          calories: 110,
          macros: "P: 1g, C: 28g, F: 0g",
          icon: "nutrition-outline",
          color: "#FFC107",
        },
      ],
    },
    {
      id: "5",
      title: "Breakfast",
      date: "Saturday, April 26, 2025",
      time: "9:00 AM",
      calories: 520,
      protein: 25,
      carbs: 60,
      fat: 18,
      color: "#FF9800",
      items: [
        {
          name: "Oatmeal",
          amount: "1 cup",
          calories: 300,
          macros: "P: 10g, C: 54g, F: 5g",
          icon: "restaurant-outline",
          color: "#8D6E63",
        },
        {
          name: "Blueberries",
          amount: "1/2 cup",
          calories: 40,
          macros: "P: 0g, C: 10g, F: 0g",
          icon: "nutrition-outline",
          color: "#3F51B5",
        },
      ],
    },
    {
      id: "6",
      title: "Lunch",
      date: "Tuesday, April 15, 2025",
      time: "12:30 PM",
      calories: 650,
      protein: 40,
      carbs: 50,
      fat: 25,
      color: "#2196F3",
      items: [
        {
          name: "Grilled Chicken Salad",
          amount: "1 large bowl",
          calories: 450,
          macros: "P: 35g, C: 20g, F: 15g",
          icon: "restaurant-outline",
          color: "#4CAF50",
        },
        {
          name: "Whole Grain Bread",
          amount: "1 slice",
          calories: 120,
          macros: "P: 4g, C: 22g, F: 2g",
          icon: "restaurant-outline",
          color: "#8D6E63",
        },
      ],
    },
  ];

  // Get active dates based on the current tab and real data
  const getActiveDates = useMemo((): DateString[] => {
    // Function to extract datestring in YYYY-MM-DD format from date strings like "Thursday, April 24, 2025"
    const extractDateString = (dateStr: string): string | null => {
      try {
        const datePart = dateStr.split(", ")[1];
        const date = new Date(datePart);

        if (isNaN(date.getTime())) return null;

        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error("Error extracting date string:", dateStr);
        return null;
      }
    };

    // Get unique dates based on the active tab
    if (activeTab === "workouts") {
      // Extract dates from workouts
      const workoutDates = workouts
        .map((workout) => extractDateString(workout.date))
        .filter((date): date is string => date !== null);

      // Return unique dates
      return [...new Set(workoutDates)];
    } else {
      // Extract dates from meals
      const mealDates = meals
        .map((meal) => extractDateString(meal.date))
        .filter((date): date is string => date !== null);

      // Return unique dates
      return [...new Set(mealDates)];
    }
  }, [activeTab, workouts, meals]);

  // Handle tab change
  const handleTabChange = (tab: "workouts" | "diet") => {
    setActiveTab(tab);
    tabIndicatorPosition.value = withTiming(tab === "workouts" ? 0 : 1, {
      duration: 250,
      easing: Easing.bezierFn(0.33, 1, 0.68, 1),
    });
  };

  // Animate tab indicator position
  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: width * 0.5 * tabIndicatorPosition.value }],
    };
  });

  // Handle workout selection
  const handleWorkoutPress = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  // Handle meal selection
  const handleMealPress = (meal: Meal) => {
    setSelectedMeal(meal);
  };

  // Handle date selection in calendar
  const handleDateSelect = (date: DateString) => {
    setActiveDate(date);
    // When a new date is selected, reset any selected meal or workout
    setSelectedWorkout(null);
    setSelectedMeal(null);
  };

  // Filter workouts and meals by the selected date
  const filteredWorkouts = useMemo(() => {
    if (!activeDate) return workouts;

    console.log("Filtering workouts for date:", activeDate);

    // Parse the selected date
    const selectedDate = new Date(activeDate);
    // Format for comparison (YYYY-MM-DD)
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
    const selectedDay = selectedDate.getDate();

    console.log(
      `Selected date: ${selectedYear}-${selectedMonth}-${selectedDay}`
    );

    return workouts.filter((workout) => {
      try {
        console.log("Checking workout date:", workout.date);

        // Extract date parts separately (e.g., "Wednesday, May 6, 2025")
        if (!workout.date.includes(", ")) return false;

        const parts = workout.date.split(", ");
        if (parts.length < 2) return false;

        // Handle date like "May 6, 2025"
        const dateParts = parts[1].split(" ");
        if (dateParts.length < 2) return false;

        const month = dateParts[0]; // "May"
        const day = parseInt(dateParts[1].replace(",", "")); // "6"
        const year = parseInt(parts[2] || dateParts[2]); // "2025"

        // Map month name to month number
        const monthNames = {
          January: 1,
          February: 2,
          March: 3,
          April: 4,
          May: 5,
          June: 6,
          July: 7,
          August: 8,
          September: 9,
          October: 10,
          November: 11,
          December: 12,
        };

        const workoutMonth = monthNames[month as keyof typeof monthNames];
        const workoutDay = day;
        const workoutYear = year;

        console.log(
          `Parsed workout date: ${workoutYear}-${workoutMonth}-${workoutDay}`
        );

        // Compare year, month, and day
        const matches =
          workoutYear === selectedYear &&
          workoutMonth === selectedMonth &&
          workoutDay === selectedDay;

        console.log("Matches:", matches);

        return matches;
      } catch (error) {
        console.error("Error parsing workout date:", workout.date, error);
        return false;
      }
    });
  }, [workouts, activeDate]);

  // Filter meals by the selected date
  const filteredMeals = useMemo(() => {
    if (!activeDate) return meals;

    // Parse the selected date
    const selectedDate = new Date(activeDate);
    // Format for comparison (YYYY-MM-DD)
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
    const selectedDay = selectedDate.getDate();

    return meals.filter((meal) => {
      try {
        // Extract date parts separately (e.g., "Wednesday, May 6, 2025")
        if (!meal.date.includes(", ")) return false;

        const parts = meal.date.split(", ");
        if (parts.length < 2) return false;

        // Handle date like "May 6, 2025"
        const dateParts = parts[1].split(" ");
        if (dateParts.length < 2) return false;

        const month = dateParts[0]; // "May"
        const day = parseInt(dateParts[1].replace(",", "")); // "6"
        const year = parseInt(parts[2] || dateParts[2]); // "2025"

        // Map month name to month number
        const monthNames = {
          January: 1,
          February: 2,
          March: 3,
          April: 4,
          May: 5,
          June: 6,
          July: 7,
          August: 8,
          September: 9,
          October: 10,
          November: 11,
          December: 12,
        };

        const mealMonth = monthNames[month as keyof typeof monthNames];
        const mealDay = day;
        const mealYear = year;

        // Compare year, month, and day
        return (
          mealYear === selectedYear &&
          mealMonth === selectedMonth &&
          mealDay === selectedDay
        );
      } catch (error) {
        console.error("Error parsing meal date:", meal.date, error);
        return false;
      }
    });
  }, [meals, activeDate]);

  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Detail Views */}
      {selectedWorkout ? (
        <WorkoutDetail
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          isDark={isDark}
        />
      ) : selectedMeal ? (
        <MealDetail
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          isDark={isDark}
        />
      ) : (
        <>
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
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              History
            </Text>
            <TouchableOpacity
              className={`p-2 rounded-full ${
                isDark ? "bg-dark-800" : "bg-light-200"
              }`}
              onPress={() => setShowCalendar(true)}
            >
              <Ionicons
                name="calendar"
                size={22}
                color={isDark ? "white" : "#121212"}
              />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View className="px-6 mb-4">
            <View
              className={`relative w-full h-12 rounded-full flex-row p-1 ${
                isDark ? "bg-dark-800" : "bg-light-200"
              }`}
            >
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    width: "50%",
                    height: 40,
                    backgroundColor: "#BBFD00",
                    borderRadius: 999,
                    top: 4,
                    left: 4,
                  },
                  tabIndicatorStyle,
                ]}
              />

              <TouchableOpacity
                className="flex-1 items-center justify-center z-10"
                onPress={() => handleTabChange("workouts")}
              >
                <Text
                  className={`font-bold ${
                    activeTab === "workouts"
                      ? "text-dark-900"
                      : isDark
                      ? "text-white"
                      : "text-dark-900"
                  }`}
                >
                  Workouts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 items-center justify-center z-10"
                onPress={() => handleTabChange("diet")}
              >
                <Text
                  className={`font-bold ${
                    activeTab === "diet"
                      ? "text-dark-900"
                      : isDark
                      ? "text-white"
                      : "text-dark-900"
                  }`}
                >
                  Diet
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content based on active tab */}
          <View className="flex-1">
            {activeTab === "workouts" ? (
              <Animated.View
                className="flex-1"
                entering={SlideInRight.duration(300).delay(100)}
                layout={Layout.duration(300)}
              >
                <FlatList
                  data={filteredWorkouts}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <WorkoutHistoryItem
                      workout={item}
                      onPress={handleWorkoutPress}
                      isDark={isDark}
                      isLast={index === filteredWorkouts.length - 1}
                    />
                  )}
                  contentContainerStyle={{
                    paddingBottom: 100,
                  }}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={
                    <View className="px-6 mb-4">
                      <Text
                        className={`text-lg font-bold mb-2 ${
                          isDark ? "text-white" : "text-dark-900"
                        }`}
                      >
                        {formattedDate}
                      </Text>
                      <Text
                        className={
                          isDark ? "text-gray-400 mb-4" : "text-gray-600 mb-4"
                        }
                      >
                        Showing all workouts for this date
                      </Text>
                    </View>
                  }
                  ItemSeparatorComponent={() => <View className="h-[1px]" />}
                  ListEmptyComponent={
                    <View className="flex-1 items-center justify-center p-6">
                      <Ionicons
                        name="barbell-outline"
                        size={64}
                        color={isDark ? "#333" : "#ddd"}
                      />
                      <Text
                        className={`mt-4 text-center ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        No workouts found for this date.
                      </Text>
                    </View>
                  }
                />
              </Animated.View>
            ) : (
              <Animated.View
                className="flex-1"
                entering={SlideInRight.duration(300).delay(100)}
                layout={Layout.duration(300)}
              >
                <FlatList
                  data={filteredMeals}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <DietHistoryItem
                      meal={item}
                      onPress={handleMealPress}
                      isDark={isDark}
                      isLast={index === filteredMeals.length - 1}
                    />
                  )}
                  contentContainerStyle={{
                    paddingBottom: 100,
                  }}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={
                    <View className="px-6 mb-4">
                      <Text
                        className={`text-lg font-bold mb-2 ${
                          isDark ? "text-white" : "text-dark-900"
                        }`}
                      >
                        {formattedDate}
                      </Text>
                      <Text
                        className={
                          isDark ? "text-gray-400 mb-4" : "text-gray-600 mb-4"
                        }
                      >
                        Showing all meals for this date
                      </Text>
                    </View>
                  }
                  ItemSeparatorComponent={() => <View className="h-[1px]" />}
                  ListEmptyComponent={
                    <View className="flex-1 items-center justify-center p-6">
                      <Ionicons
                        name="nutrition-outline"
                        size={64}
                        color={isDark ? "#333" : "#ddd"}
                      />
                      <Text
                        className={`mt-4 text-center ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        No meals found for this date.
                      </Text>
                    </View>
                  }
                />
              </Animated.View>
            )}
          </View>

          {/* Calendar Modal */}
          <Calendar
            isVisible={showCalendar}
            onClose={() => setShowCalendar(false)}
            activeDate={activeDate}
            onSelectDate={handleDateSelect}
            activeDates={
              activeTab === "workouts"
                ? ([
                    ...new Set(
                      workouts
                        .map((workout) => {
                          try {
                            // Parse date parts directly instead of using Date constructor
                            const parts = workout.date.split(", ");
                            if (parts.length < 2) return null;

                            let dateString = "";
                            // Handle date like "Wednesday, May 6, 2025"
                            if (parts.length === 2) {
                              // Format is "Weekday, Month Day, Year"
                              const dateParts = parts[1].split(" ");
                              if (dateParts.length < 3) return null;

                              const month = dateParts[0]; // "May"
                              const day = parseInt(
                                dateParts[1].replace(",", "")
                              ); // "6"
                              const year = parseInt(dateParts[2]); // "2025"

                              const monthNames = {
                                January: "01",
                                February: "02",
                                March: "03",
                                April: "04",
                                May: "05",
                                June: "06",
                                July: "07",
                                August: "08",
                                September: "09",
                                October: "10",
                                November: "11",
                                December: "12",
                              };

                              dateString = `${year}-${
                                monthNames[month as keyof typeof monthNames]
                              }-${String(day).padStart(2, "0")}`;
                            } else if (parts.length === 3) {
                              // Format is "Weekday, Month Day, Year"
                              const month = parts[1].split(" ")[0]; // "May"
                              const day = parseInt(
                                parts[1].split(" ")[1].replace(",", "")
                              ); // "6"
                              const year = parseInt(parts[2]); // "2025"

                              const monthNames = {
                                January: "01",
                                February: "02",
                                March: "03",
                                April: "04",
                                May: "05",
                                June: "06",
                                July: "07",
                                August: "08",
                                September: "09",
                                October: "10",
                                November: "11",
                                December: "12",
                              };

                              dateString = `${year}-${
                                monthNames[month as keyof typeof monthNames]
                              }-${String(day).padStart(2, "0")}`;
                            }

                            console.log(
                              `Workout date extracted: ${dateString} from ${workout.date}`
                            );
                            return dateString;
                          } catch (error) {
                            console.error("Error parsing workout date:", error);
                            return null;
                          }
                        })
                        .filter(Boolean)
                    ),
                  ] as DateString[])
                : ([
                    ...new Set(
                      meals
                        .map((meal) => {
                          try {
                            // Parse date parts directly instead of using Date constructor
                            const parts = meal.date.split(", ");
                            if (parts.length < 2) return null;

                            let dateString = "";
                            // Handle date like "Wednesday, May 6, 2025"
                            if (parts.length === 2) {
                              // Format is "Weekday, Month Day, Year"
                              const dateParts = parts[1].split(" ");
                              if (dateParts.length < 3) return null;

                              const month = dateParts[0]; // "May"
                              const day = parseInt(
                                dateParts[1].replace(",", "")
                              ); // "6"
                              const year = parseInt(dateParts[2]); // "2025"

                              const monthNames = {
                                January: "01",
                                February: "02",
                                March: "03",
                                April: "04",
                                May: "05",
                                June: "06",
                                July: "07",
                                August: "08",
                                September: "09",
                                October: "10",
                                November: "11",
                                December: "12",
                              };

                              dateString = `${year}-${
                                monthNames[month as keyof typeof monthNames]
                              }-${String(day).padStart(2, "0")}`;
                            } else if (parts.length === 3) {
                              // Format is "Weekday, Month Day, Year"
                              const month = parts[1].split(" ")[0]; // "May"
                              const day = parseInt(
                                parts[1].split(" ")[1].replace(",", "")
                              ); // "6"
                              const year = parseInt(parts[2]); // "2025"

                              const monthNames = {
                                January: "01",
                                February: "02",
                                March: "03",
                                April: "04",
                                May: "05",
                                June: "06",
                                July: "07",
                                August: "08",
                                September: "09",
                                October: "10",
                                November: "11",
                                December: "12",
                              };

                              dateString = `${year}-${
                                monthNames[month as keyof typeof monthNames]
                              }-${String(day).padStart(2, "0")}`;
                            }

                            console.log(
                              `Meal date extracted: ${dateString} from ${meal.date}`
                            );
                            return dateString;
                          } catch (error) {
                            console.error("Error parsing meal date:", error);
                            return null;
                          }
                        })
                        .filter(Boolean)
                    ),
                  ] as DateString[])
            }
            isDark={isDark}
          />
        </>
      )}
    </View>
  );
}

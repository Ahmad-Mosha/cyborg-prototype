import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ExerciseItem,
  ExerciseDetailModal,
  FilterModal,
  SortModal,
  RecordsHistoryModal,
} from "../../../components/exercises";
import { Exercise } from "../../../types/exercises"; // Changed from types/workout
import { useTheme } from "../../../contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

// Mock data for exercises
const exercisesData = [
  {
    id: "1",
    name: "Arnold Press (Dumbbell)",
    category: "Dumbbell",
    bodyPart: "Shoulders",
    image:
      "https://www.inspireusafoundation.org/wp-content/uploads/2022/04/arnold-press-1024x576.jpg",
    instructions: [
      "Sit upright on a bench and hold a dumbbell in each hand, at chest level. Keep your palms facing your body, as if you are performing a dumbbell curl.",
      "Press the dumbbells upward, while rotating your wrists so your palms face forward at the top of the movement.",
      "Lower the dumbbells back to the starting position, rotating your wrists back so your palms face your body.",
      "Repeat for the desired number of repetitions.",
    ],
    frequency: 3,
    lastPerformed: "2025-04-28T10:30:00",
  },
  {
    id: "2",
    name: "Barbell Bench Press",
    category: "Barbell",
    bodyPart: "Chest",
    image:
      "https://www.inspireusafoundation.org/wp-content/uploads/2022/01/bench-press-form.jpg",
    instructions: [
      "Lie flat on a bench with your feet on the floor.",
      "Grip the barbell slightly wider than shoulder-width apart.",
      "Lower the barbell to your mid-chest.",
      "Press the barbell back up until your arms are fully extended.",
      "Repeat for the desired number of repetitions.",
    ],
    frequency: 5,
    lastPerformed: "2025-05-01T08:45:00",
  },
  {
    id: "3",
    name: "Pull-ups",
    category: "Bodyweight",
    bodyPart: "Back",
    image: "https://images.unsplash.com/photo-1598971639058-a9aea9f55fa6",
    instructions: [
      "Hang from a pull-up bar with your palms facing away from you.",
      "Pull yourself up until your chin is above the bar.",
      "Lower yourself back to the starting position with control.",
      "Repeat for the desired number of repetitions.",
    ],
    frequency: 4,
    lastPerformed: "2025-04-30T15:20:00",
  },
  {
    id: "4",
    name: "Squats",
    category: "Bodyweight",
    bodyPart: "Legs",
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77",
    instructions: [
      "Stand with your feet shoulder-width apart.",
      "Bend your knees and lower your hips as if sitting in a chair.",
      "Keep your chest up and back straight.",
      "Lower until your thighs are parallel to the ground.",
      "Return to the starting position by pushing through your heels.",
      "Repeat for the desired number of repetitions.",
    ],
    frequency: 6,
    lastPerformed: "2025-05-01T13:15:00",
  },
  {
    id: "5",
    name: "Ab Wheel Rollout",
    category: "Machine/Other",
    bodyPart: "Core",
    image: "https://images.unsplash.com/photo-1613940075814-6576b284b9f9",
    instructions: [
      "Kneel on the floor with the ab wheel in front of you.",
      "Place your hands on the handles of the wheel.",
      "Slowly roll the wheel forward, extending your body as far as you can without touching the ground with your body.",
      "Use your core muscles to roll the wheel back to the starting position.",
      "Repeat for the desired number of repetitions.",
    ],
    frequency: 2,
    lastPerformed: "2025-04-29T17:00:00",
  },
  {
    id: "6",
    name: "Lateral Raises",
    category: "Dumbbell",
    bodyPart: "Shoulders",
    image: "https://images.unsplash.com/photo-1582656975874-599d1e3c2253",
    instructions: [
      "Stand with your feet shoulder-width apart.",
      "Hold a dumbbell in each hand at your sides with your palms facing your body.",
      "Keeping your arms straight, lift the dumbbells out to the sides until they reach shoulder height.",
      "Slowly lower the dumbbells back to your sides.",
      "Repeat for the desired number of repetitions.",
    ],
    frequency: 3,
    lastPerformed: "2025-04-29T09:45:00",
  },
  {
    id: "7",
    name: "Plank",
    category: "Bodyweight",
    bodyPart: "Core",
    image: "https://images.unsplash.com/photo-1572859733417-23595cf5f1f6",
    instructions: [
      "Get into a forearm plank position with your elbows directly beneath your shoulders.",
      "Keep your body in a straight line from head to heels.",
      "Engage your core and hold the position.",
      "Hold for the desired amount of time.",
    ],
    frequency: 7,
    lastPerformed: "2025-05-02T07:30:00",
  },
  {
    id: "8",
    name: "Back Extension (Machine)",
    category: "Machine/Other",
    bodyPart: "Back",
    image:
      "https://www.inspireusafoundation.org/wp-content/uploads/2022/11/back-extension-machine.jpg",
    instructions: [
      "Adjust the machine so that your hips align with the pad's edge.",
      "Position your feet securely under the footpads.",
      "Cross your arms over your chest or place them behind your head.",
      "Bend at the waist and lower your upper body toward the floor.",
      "Use your lower back muscles to raise your upper body back to the starting position.",
      "Repeat for the desired number of repetitions.",
    ],
    frequency: 4,
    lastPerformed: "2025-04-28T16:20:00",
  },
];

// Filter options
const bodyPartFilters = [
  "Arms",
  "Back",
  "Cardio",
  "Chest",
  "Core",
  "Full Body",
  "Legs",
  "Olympic",
  "Other",
  "Shoulders",
];
const categoryFilters = [
  "Barbell",
  "Dumbbell",
  "Machine/Other",
  "Bodyweight",
  "Assisted Bodyweight",
  "Reps Only",
  "Cardio",
  "Duration",
];

// Mock exercise history data
const exerciseHistoryData = [
  {
    date: "Tuesday, September 3, 2024, 12:19 PM",
    sets: [
      { reps: 11, weight: 65, oneRepMax: 89 },
      { reps: 9, weight: 75, oneRepMax: 97 },
      { reps: 7, weight: 85, oneRepMax: 102 },
    ],
  },
  {
    date: "Monday, August 26, 2024, 11:39 AM",
    sets: [
      { reps: 11, weight: 40, oneRepMax: 55 },
      { reps: 9, weight: 40, oneRepMax: 52 },
      { reps: 7, weight: 50, oneRepMax: 60 },
    ],
  },
  {
    date: "Tuesday, August 20, 2024, 5:36 AM",
    sets: [
      { reps: 11, weight: 60, oneRepMax: 82 },
      { reps: 9, weight: 75, oneRepMax: 97 },
      { reps: 7, weight: 90, oneRepMax: 108 },
    ],
  },
  {
    date: "Thursday, August 15, 2024, 5:16 AM",
    sets: [
      { reps: 11, weight: 60, oneRepMax: 82 },
      { reps: 9, weight: 75, oneRepMax: 97 },
      { reps: 8, weight: 85, oneRepMax: 106 },
    ],
  },
  {
    date: "Wednesday, August 7, 2024, 11:25 PM",
    sets: [
      { reps: 11, weight: 60, oneRepMax: 82 },
      { reps: 9, weight: 75, oneRepMax: 97 },
      { reps: 8, weight: 85, oneRepMax: 106 },
    ],
  },
  {
    date: "Tuesday, July 30, 2024, 4:10 PM",
    sets: [
      { reps: 11, weight: 60, oneRepMax: 82 },
      { reps: 9, weight: 70, oneRepMax: 90 },
      { reps: 8, weight: 75, oneRepMax: 93 },
    ],
  },
];

// Mock exercise records data
const exerciseRecordsData = {
  estimatedOneRepMax: 125, // in kg
  maxVolume: 3000, // in kg
  maxWeight: 90, // in kg
  bestPerformance: [
    { reps: 1, weight: 90, sets: 7, date: "Aug 20, 2024", estimated: 125 },
    { reps: 2, weight: 90, sets: 7, date: "Aug 20, 2024", estimated: 121 },
    { reps: 3, weight: 90, sets: 7, date: "Aug 20, 2024", estimated: 117 },
    { reps: 4, weight: 90, sets: 7, date: "Aug 20, 2024", estimated: 114 },
    { reps: 5, weight: 90, sets: 7, date: "Aug 20, 2024", estimated: 110 },
    { reps: 6, weight: 90, sets: 7, date: "Aug 20, 2024", estimated: 107 },
    { reps: 7, weight: 90, sets: 7, date: "Aug 20, 2024", estimated: 104 },
    { reps: 8, weight: 85, sets: 8, date: "Aug 8, 2024", estimated: 101 },
    { reps: 9, weight: 75, sets: 9, date: "Aug 8, 2024", estimated: 99 },
    { reps: 10, weight: 70, sets: 10, date: "Sep 12, 2024", estimated: 96 },
    { reps: 11, weight: 65, sets: 11, date: "Sep 3, 2024", estimated: 94 },
    { reps: 12, weight: 55, sets: 12, date: "May 12, 2024", estimated: 91 },
  ],
  lifetimeStats: {
    totalReps: 1758,
    totalVolume: 211128, // kg
  },
  // Add historical records data that matches what's in the image
  recordsHistory: {
    estimated1RM: [
      { value: 125, date: "Jan 31, 2024" },
      { value: 117, date: "Nov 7, 2023" },
      { value: 108, date: "Nov 1, 2023" },
      { value: 100, date: "Oct 15, 2023" },
      { value: 78, date: "Sep 23, 2023" },
      { value: 78, date: "Sep 5, 2023" },
    ],
    maxWeight: [
      { value: 90, date: "Aug 20, 2024" },
      { value: 85, date: "Aug 8, 2024" },
      { value: 75, date: "Jan 31, 2024" },
      { value: 70, date: "Nov 7, 2023" },
      { value: 65, date: "Nov 1, 2023" },
      { value: 65, date: "Sep 23, 2023" },
      { value: 65, date: "Sep 16, 2023" },
      { value: 60, date: "Sep 5, 2023" },
    ],
    maxVolume: [
      { value: 3000, date: "Jan 31, 2024" },
      { value: 2800, date: "Nov 7, 2023" },
      { value: 2600, date: "Nov 1, 2023" },
      { value: 2400, date: "Oct 15, 2023" },
      { value: 1080, date: "Sep 5, 2023" },
    ],
  },
};

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [favorites, setFavorites] = useState<string[]>([]);

  // Add state for records history modal
  const [showRecordsHistory, setShowRecordsHistory] = useState(false);

  // Filter states
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Sort state
  const [sortBy, setSortBy] = useState("name"); // Options: name, frequency, lastPerformed

  // Exercise details tab state
  const [activeTab, setActiveTab] = useState("about");

  // Animation values
  const searchInputWidth = useSharedValue(0);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  const toggleFavorite = async (exerciseId: string) => {
    try {
      let updatedFavorites = [];
      if (favorites.includes(exerciseId)) {
        updatedFavorites = favorites.filter((id) => id !== exerciseId);
      } else {
        updatedFavorites = [...favorites, exerciseId];
      }
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Failed to update favorites:", error);
    }
  };

  // Handle search visibility
  const toggleSearch = () => {
    if (showSearch) {
      searchInputWidth.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
      });
      setTimeout(() => {
        setShowSearch(false);
      }, 300);
    } else {
      setShowSearch(true);
      searchInputWidth.value = withTiming(width - 120, {
        duration: 300,
        easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
      });
    }
  };

  // Filter exercises based on search and filters
  const filteredExercises = exercisesData.filter((exercise) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Body part filter
    const matchesBodyPart =
      selectedBodyParts.length === 0 ||
      selectedBodyParts.includes(exercise.bodyPart);

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(exercise.category);

    return matchesSearch && matchesBodyPart && matchesCategory;
  });

  // Sort exercises
  const sortedExercises = [...filteredExercises].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "frequency") {
      return b.frequency - a.frequency; // Higher frequency first
    } else if (sortBy === "lastPerformed") {
      return (
        new Date(b.lastPerformed).getTime() -
        new Date(a.lastPerformed).getTime()
      ); // Most recent first
    }
    return 0;
  });

  // Toggle body part filter
  const toggleBodyPartFilter = (bodyPart: string) => {
    setSelectedBodyParts((prev) =>
      prev.includes(bodyPart)
        ? prev.filter((item) => item !== bodyPart)
        : [...prev, bodyPart]
    );
  };

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  // Apply sort
  const applySort = (sortOption: string) => {
    setSortBy(sortOption);
    setShowSort(false);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedBodyParts([]);
    setSelectedCategories([]);
  };

  // Animation styles
  const searchContainerStyle = useAnimatedStyle(() => {
    return {
      width: searchInputWidth.value,
    };
  });

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Function to handle opening the records history modal
  const handleViewRecordsHistory = () => {
    console.log("View Records History clicked");

    // Force close the exercise detail modal first
    setSelectedExercise(null);

    // Use a short timeout to ensure modals don't conflict
    setTimeout(() => {
      setShowRecordsHistory(true);
    }, 100);
  };

  // Get theme from context
  const { isDark } = useTheme();

  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 30 }} className="px-6 pt-6 pb-4">
        <View className="flex-row items-center">
          {!showSearch ? (
            <>
              <Text
                className={
                  isDark
                    ? "text-white text-2xl font-bold flex-1"
                    : "text-dark-900 text-2xl font-bold flex-1"
                }
              >
                Exercises
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  className={`w-10 h-10 rounded-full ${
                    isDark ? "bg-dark-800" : "bg-light-200"
                  } items-center justify-center mr-2`}
                  onPress={toggleSearch}
                >
                  <Ionicons
                    name="search"
                    size={22}
                    color={isDark ? "white" : "#121212"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className={`w-10 h-10 rounded-full ${
                    isDark ? "bg-dark-800" : "bg-light-200"
                  } items-center justify-center mr-2`}
                  onPress={() => setShowSort(true)}
                  testID="sort-button"
                >
                  <Ionicons
                    name="swap-vertical"
                    size={22}
                    color={isDark ? "white" : "#121212"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className={`w-10 h-10 rounded-full ${
                    isDark ? "bg-dark-800" : "bg-light-200"
                  } items-center justify-center mr-2`}
                  onPress={() => setShowFilter(true)}
                  testID="filter-button"
                >
                  <Ionicons
                    name="filter"
                    size={22}
                    color={isDark ? "white" : "#121212"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-primary items-center justify-center"
                  onPress={() =>
                    alert("Create exercise functionality coming soon!")
                  }
                >
                  <Ionicons name="add" size={22} color="black" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={toggleSearch}
                className={`w-10 h-10 rounded-full ${
                  isDark ? "bg-dark-800" : "bg-light-200"
                } items-center justify-center mr-2`}
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={isDark ? "white" : "#121212"}
                />
              </TouchableOpacity>
              <Animated.View style={searchContainerStyle}>
                <TextInput
                  className={`flex-1 rounded-full ${
                    isDark
                      ? "bg-dark-800 text-white"
                      : "bg-light-200 text-dark-900"
                  } h-10 px-4`}
                  placeholder="Search exercises..."
                  placeholderTextColor={isDark ? "#777" : "#999"}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
              </Animated.View>
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className={`absolute right-2 w-6 h-6 rounded-full ${
                    isDark ? "bg-dark-700" : "bg-light-300"
                  } items-center justify-center`}
                  style={{ right: 10 }}
                >
                  <Ionicons
                    name="close"
                    size={14}
                    color={isDark ? "white" : "#121212"}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* Filter indicators */}
      {(selectedBodyParts.length > 0 || selectedCategories.length > 0) && (
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            <TouchableOpacity
              onPress={resetFilters}
              className={`${
                isDark ? "bg-dark-800" : "bg-light-200"
              } rounded-full h-5 px-2 mr-2 flex-row items-center`}
            >
              <Ionicons name="close-circle" size={10} color="#BBFD00" />
              <Text
                className={
                  isDark
                    ? "text-white ml-1 text-xs"
                    : "text-dark-900 ml-1 text-xs"
                }
              >
                Clear
              </Text>
            </TouchableOpacity>

            {/* Rest of filter indicators */}
            {/* ...existing code... */}
          </ScrollView>
        </View>
      )}

      {/* Exercises List */}
      {sortedExercises.length > 0 ? (
        <FlatList
          data={sortedExercises}
          renderItem={({ item }) => (
            <ExerciseItem
              item={item}
              onPress={(exercise) => setSelectedExercise(exercise)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 100,
            paddingTop: 0,
          }}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="fitness-outline" size={64} color="#333" />
          <Text className="text-white text-xl font-bold mt-4 mb-2">
            No exercises found
          </Text>
          <Text className="text-gray-400 text-center">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : "Try different filters or create a new exercise"}
          </Text>
          <TouchableOpacity
            className="mt-6 bg-primary rounded-full px-6 py-3"
            onPress={() => {
              setSearchQuery("");
              resetFilters();
            }}
          >
            <Text className="text-dark-900 font-bold">Clear Search</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modals */}
      {/* Keep RecordsHistoryModal separate and not dependent on ExerciseDetailModal visibility */}
      <RecordsHistoryModal
        visible={showRecordsHistory}
        onClose={() => setShowRecordsHistory(false)}
        exerciseName={selectedExercise?.name}
        recordsHistory={exerciseRecordsData.recordsHistory}
      />

      <ExerciseDetailModal
        visible={selectedExercise !== null}
        onClose={() => setSelectedExercise(null)}
        exercise={selectedExercise}
        isFavorite={
          selectedExercise ? favorites.includes(selectedExercise.id) : false
        }
        onToggleFavorite={toggleFavorite}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        exerciseHistoryData={exerciseHistoryData}
        exerciseRecordsData={exerciseRecordsData}
        onViewRecordsHistory={handleViewRecordsHistory}
        formatDate={formatDate}
      />

      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        selectedBodyParts={selectedBodyParts}
        selectedCategories={selectedCategories}
        toggleBodyPartFilter={toggleBodyPartFilter}
        toggleCategoryFilter={toggleCategoryFilter}
        resetFilters={resetFilters}
        applyFilters={() => setShowFilter(false)}
        bodyPartFilters={bodyPartFilters}
        categoryFilters={categoryFilters}
        filteredCount={filteredExercises.length}
      />

      <SortModal
        visible={showSort}
        onClose={() => setShowSort(false)}
        sortBy={sortBy}
        applySort={applySort}
      />
    </View>
  );
}

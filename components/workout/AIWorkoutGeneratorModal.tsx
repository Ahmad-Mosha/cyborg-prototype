import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";

interface AIWorkoutGeneratorModalProps {
  visible: boolean;
  onClose: () => void;
  onGenerateWorkout: (preferences: WorkoutPreferences) => void;
  isGenerating?: boolean;
}

export interface WorkoutPreferences {
  goal: string;
  duration: number;
  experience: string;
  equipment: string[];
  targetMuscles: string[];
  additionalNotes?: string;
}

const AIWorkoutGeneratorModal: React.FC<AIWorkoutGeneratorModalProps> = ({
  visible,
  onClose,
  onGenerateWorkout,
  isGenerating = false,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    goal: "muscle_building",
    duration: 60,
    experience: "intermediate",
    equipment: [],
    targetMuscles: [],
    additionalNotes: "",
  });

  const goals = [
    { id: "muscle_building", label: "Muscle Building" },
    { id: "strength", label: "Strength" },
    { id: "weight_loss", label: "Weight Loss" },
    { id: "endurance", label: "Endurance" },
    { id: "general_fitness", label: "General Fitness" },
  ];

  const experienceLevels = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  const equipmentOptions = [
    { id: "barbell", label: "Barbell" },
    { id: "dumbbell", label: "Dumbbell" },
    { id: "machine", label: "Machine" },
    { id: "cable", label: "Cable" },
    { id: "bodyweight", label: "Bodyweight" },
    { id: "resistance_bands", label: "Resistance Bands" },
  ];

  const muscleGroups = [
    { id: "chest", label: "Chest" },
    { id: "back", label: "Back" },
    { id: "shoulders", label: "Shoulders" },
    { id: "arms", label: "Arms" },
    { id: "legs", label: "Legs" },
    { id: "core", label: "Core" },
  ];

  const durations = [30, 45, 60, 90, 120];

  const toggleArraySelection = (
    array: string[],
    item: string,
    setter: (newArray: string[]) => void
  ) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleGenerate = () => {
    if (
      preferences.equipment.length === 0 ||
      preferences.targetMuscles.length === 0
    ) {
      return;
    }
    onGenerateWorkout(preferences);
  };

  const isValid =
    preferences.equipment.length > 0 && preferences.targetMuscles.length > 0;
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/50 justify-center items-center px-2 py-4">
        <View
          className={`${
            isDark ? "bg-dark-900" : "bg-white"
          } rounded-3xl w-full shadow-lg flex-1`}
          style={{ maxHeight: "95%", maxWidth: "95%", minHeight: "80%" }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <Text
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Generate AI Workout
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "white" : "#121212"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 p-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Goal Selection */}
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Fitness Goal
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    preferences.goal === goal.id
                      ? "bg-primary"
                      : isDark
                      ? "bg-dark-800"
                      : "bg-gray-200"
                  }`}
                  onPress={() =>
                    setPreferences({ ...preferences, goal: goal.id })
                  }
                >
                  <Text
                    className={`${
                      preferences.goal === goal.id
                        ? "text-dark-900 font-semibold"
                        : isDark
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Duration Selection */}
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Workout Duration (minutes)
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    preferences.duration === duration
                      ? "bg-primary"
                      : isDark
                      ? "bg-dark-800"
                      : "bg-gray-200"
                  }`}
                  onPress={() => setPreferences({ ...preferences, duration })}
                >
                  <Text
                    className={`${
                      preferences.duration === duration
                        ? "text-dark-900 font-semibold"
                        : isDark
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Experience Level */}
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Experience Level
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {experienceLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    preferences.experience === level.id
                      ? "bg-primary"
                      : isDark
                      ? "bg-dark-800"
                      : "bg-gray-200"
                  }`}
                  onPress={() =>
                    setPreferences({ ...preferences, experience: level.id })
                  }
                >
                  <Text
                    className={`${
                      preferences.experience === level.id
                        ? "text-dark-900 font-semibold"
                        : isDark
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Equipment Selection */}
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Available Equipment *
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {equipmentOptions.map((equipment) => (
                <TouchableOpacity
                  key={equipment.id}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    preferences.equipment.includes(equipment.id)
                      ? "bg-primary"
                      : isDark
                      ? "bg-dark-800"
                      : "bg-gray-200"
                  }`}
                  onPress={() =>
                    toggleArraySelection(
                      preferences.equipment,
                      equipment.id,
                      (newEquipment) =>
                        setPreferences({
                          ...preferences,
                          equipment: newEquipment,
                        })
                    )
                  }
                >
                  <Text
                    className={`${
                      preferences.equipment.includes(equipment.id)
                        ? "text-dark-900 font-semibold"
                        : isDark
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {equipment.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Target Muscle Groups */}
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Target Muscle Groups *
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {muscleGroups.map((muscle) => (
                <TouchableOpacity
                  key={muscle.id}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    preferences.targetMuscles.includes(muscle.id)
                      ? "bg-primary"
                      : isDark
                      ? "bg-dark-800"
                      : "bg-gray-200"
                  }`}
                  onPress={() =>
                    toggleArraySelection(
                      preferences.targetMuscles,
                      muscle.id,
                      (newMuscles) =>
                        setPreferences({
                          ...preferences,
                          targetMuscles: newMuscles,
                        })
                    )
                  }
                >
                  <Text
                    className={`${
                      preferences.targetMuscles.includes(muscle.id)
                        ? "text-dark-900 font-semibold"
                        : isDark
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {muscle.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Additional Notes */}
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Additional Notes (Optional)
            </Text>
            <TextInput
              className={`p-4 rounded-2xl text-base mb-6 ${
                isDark
                  ? "bg-dark-800 text-white border border-gray-700"
                  : "bg-gray-100 text-dark-900 border border-gray-300"
              }`}
              placeholder="Any specific requirements, injuries, or preferences..."
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              value={preferences.additionalNotes}
              onChangeText={(text) =>
                setPreferences({ ...preferences, additionalNotes: text })
              }
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />{" "}
          </ScrollView>

          {/* Generate Button */}
          <View className="p-4 border-t border-gray-200 dark:border-gray-700">
            <TouchableOpacity
              className={`h-12 rounded-2xl justify-center items-center flex-row ${
                isValid && !isGenerating
                  ? "bg-primary"
                  : isDark
                  ? "bg-gray-700"
                  : "bg-gray-300"
              }`}
              onPress={handleGenerate}
              disabled={!isValid || isGenerating}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold">Generating...</Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="sparkles"
                    size={20}
                    color={isValid ? "#121212" : "#9CA3AF"}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className={`font-bold ${
                      isValid ? "text-dark-900" : "text-gray-500"
                    }`}
                  >
                    Generate Workout Plan
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AIWorkoutGeneratorModal;

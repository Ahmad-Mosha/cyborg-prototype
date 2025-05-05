import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { COLORS } from "@/utils/constants/theme";
import { WorkoutExercise, ExerciseSet } from "@/types/workout";

interface WorkoutExerciseItemProps {
  workoutExercise: WorkoutExercise;
  index: number;
  onAddSet: (exerciseIndex: number) => void;
  onUpdateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: number
  ) => void;
  onToggleSetComplete: (exerciseIndex: number, setIndex: number) => void;
}

const WorkoutExerciseItem: React.FC<WorkoutExerciseItemProps> = ({
  workoutExercise,
  index,
  onAddSet,
  onUpdateSet,
  onToggleSetComplete,
}) => {
  const { isDark } = useTheme();
  const theme = {
    dimTextColor: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
  };

  return (
    <View
      className={`mb-4 p-4 border ${
        isDark ? "bg-dark-800 border-dark-700" : "bg-white border-light-300"
      } rounded-3xl ${
        workoutExercise.isSuperSet ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <View className="mb-4">
        <Text
          className={
            isDark
              ? "text-white font-bold text-lg"
              : "text-dark-900 font-bold text-lg"
          }
        >
          {workoutExercise.exercise.name}
        </Text>
        <Text
          className={isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}
        >
          {workoutExercise.exercise.category}
        </Text>
      </View>

      {workoutExercise.sets.map((set, setIndex) => (
        <View key={set.id} className="flex-row items-center mb-3">
          <Text
            className={
              isDark
                ? "text-white font-medium w-12"
                : "text-dark-900 font-medium w-12"
            }
          >
            Set {setIndex + 1}
          </Text>
          <View className="flex-row items-center flex-1 mx-2">
            <TextInput
              className={`w-16 h-10 text-center rounded-lg border ${
                isDark
                  ? "border-dark-700 text-white bg-dark-900"
                  : "border-light-300 text-dark-900 bg-light-50"
              }`}
              placeholder="0"
              placeholderTextColor={theme.dimTextColor}
              keyboardType="numeric"
              value={set.weight > 0 ? set.weight.toString() : ""}
              onChangeText={(text) =>
                onUpdateSet(index, setIndex, "weight", Number(text) || 0)
              }
            />
            <Text
              className={isDark ? "text-gray-400 ml-2" : "text-gray-600 ml-2"}
            >
              kg
            </Text>
          </View>
          <View className="flex-row items-center flex-1 mx-2">
            <TextInput
              className={`w-16 h-10 text-center rounded-lg border ${
                isDark
                  ? "border-dark-700 text-white bg-dark-900"
                  : "border-light-300 text-dark-900 bg-light-50"
              }`}
              placeholder="0"
              placeholderTextColor={theme.dimTextColor}
              keyboardType="numeric"
              value={set.reps > 0 ? set.reps.toString() : ""}
              onChangeText={(text) =>
                onUpdateSet(index, setIndex, "reps", Number(text) || 0)
              }
            />
            <Text
              className={isDark ? "text-gray-400 ml-2" : "text-gray-600 ml-2"}
            >
              reps
            </Text>
          </View>
          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center ${
              set.completed ? "bg-primary" : "bg-primary/30"
            }`}
            onPress={() => onToggleSetComplete(index, setIndex)}
          >
            <Ionicons
              name={set.completed ? "checkmark" : "add"}
              size={24}
              color={COLORS.textDark}
            />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        className={`h-10 rounded-xl justify-center items-center mt-2 border border-dashed ${
          isDark ? "border-dark-700" : "border-light-300"
        }`}
        onPress={() => onAddSet(index)}
      >
        <Text className="text-primary font-medium">Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutExerciseItem;

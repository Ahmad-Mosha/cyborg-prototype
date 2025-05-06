import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActiveWorkout, WeightUnit } from "@/types/workout";
import WorkoutTimer from "./WorkoutTimer";
import WorkoutExerciseItem from "./WorkoutExerciseItem";
import ExerciseSelectionModal from "./ExerciseSelectionModal";

interface ActiveWorkoutScreenProps {
  workout: ActiveWorkout;
  onWorkoutNameChange: (name: string) => void;
  onGoBack: () => void;
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
  onAddExercise: () => void;
  onAddSet: (exerciseIndex: number) => void;
  onUpdateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: number
  ) => void;
  onToggleSetComplete: (exerciseIndex: number, setIndex: number) => void;
  onDeleteSet: (exerciseIndex: number, setIndex: number) => void;
  onDeleteExercise: (exerciseIndex: number) => void;
  onSetTypeChange: (
    exerciseIndex: number,
    setIndex: number,
    type: string
  ) => void;
  onSetRestTimeChange: (
    exerciseIndex: number,
    setIndex: number,
    time: number
  ) => void;
  onToggleWeightUnit: () => void;
  onChangeDefaultRestTime: (time: number) => void;
  showExerciseModal: boolean;
  setShowExerciseModal: (show: boolean) => void;
  exercises: any[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedExercises: string[];
  onToggleExerciseSelection: (id: string) => void;
  onAddSelectedExercises: () => void;
}

const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  workout,
  onWorkoutNameChange,
  onGoBack,
  onFinishWorkout,
  onCancelWorkout,
  onAddExercise,
  onAddSet,
  onUpdateSet,
  onToggleSetComplete,
  onDeleteSet,
  onDeleteExercise,
  onSetTypeChange,
  onSetRestTimeChange,
  onToggleWeightUnit,
  onChangeDefaultRestTime,
  showExerciseModal,
  setShowExerciseModal,
  exercises,
  searchQuery,
  onSearchChange,
  selectedExercises,
  onToggleExerciseSelection,
  onAddSelectedExercises,
}) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const handleStartRestTimer = (time: number) => {
    // This function is passed to WorkoutExerciseItem
    // The rest timer is now handled directly in the WorkoutExerciseItem component
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#121212" : "#F5F5F5",
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={onGoBack}
          className={
            isDark
              ? "bg-dark-800 rounded-full p-2"
              : "bg-light-200 rounded-full p-2"
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "white" : "#121212"}
          />
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <TouchableOpacity
            className={
              isDark
                ? "bg-dark-800 rounded-full p-2"
                : "bg-light-200 rounded-full p-2"
            }
          >
            <Ionicons
              name="refresh"
              size={22}
              color={isDark ? "white" : "#121212"}
            />
          </TouchableOpacity>
          {/* Main workout timer (not rest timer) */}
          <WorkoutTimer startTime={workout.startTime} restMode={false} />
          <TouchableOpacity
            className="bg-primary/20 rounded-full px-4 py-2"
            onPress={onFinishWorkout}
          >
            <Text className="text-primary font-bold">FINISH</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.workoutTitleContainer}>
        <TextInput
          style={[styles.workoutTitle, { color: isDark ? "white" : "#121212" }]}
          value={workout.name}
          onChangeText={onWorkoutNameChange}
        />
        <TouchableOpacity
          className={
            isDark
              ? "bg-dark-800 rounded-full p-2"
              : "bg-light-200 rounded-full p-2"
          }
          onPress={onToggleWeightUnit}
        >
          <Text className="font-bold">
            {workout.weightUnit || WeightUnit.Kg}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.exercisesContainer}
        showsVerticalScrollIndicator={false}
      >
        {workout.exercises.map((workoutExercise, index) => (
          <WorkoutExerciseItem
            key={`${workoutExercise.exercise.id}-${index}`}
            workoutExercise={workoutExercise}
            index={index}
            onAddSet={onAddSet}
            onUpdateSet={onUpdateSet}
            onToggleSetComplete={onToggleSetComplete}
            onDeleteSet={onDeleteSet}
            onDeleteExercise={onDeleteExercise}
            onSetTypeChange={onSetTypeChange}
            onSetRestTimeChange={onSetRestTimeChange}
            weightUnit={workout.weightUnit || WeightUnit.Kg}
            onToggleWeightUnit={onToggleWeightUnit}
            onStartRestTimer={handleStartRestTimer}
          />
        ))}
      </ScrollView>

      <View className="flex-row p-4">
        <TouchableOpacity
          className={`flex-1 h-12 rounded-2xl justify-center items-center mr-2 border ${
            isDark ? "border-dark-700" : "border-light-300"
          }`}
          onPress={onCancelWorkout}
        >
          <Text className="text-red-500 font-bold">CANCEL WORKOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 h-12 rounded-2xl justify-center items-center ml-2 bg-primary"
          onPress={onAddExercise}
        >
          <Text className="text-dark-900 font-bold">ADD EXERCISE</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise Selection Modal */}
      <ExerciseSelectionModal
        visible={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        exercises={exercises}
        selectedExercises={selectedExercises}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onToggleSelection={onToggleExerciseSelection}
        onAddSelected={onAddSelectedExercises}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  workoutTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  workoutTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
  },
  exercisesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default ActiveWorkoutScreen;

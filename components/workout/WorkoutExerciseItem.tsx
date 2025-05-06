import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { COLORS } from "@/utils/constants/theme";
import {
  WorkoutExercise,
  ExerciseSet,
  SetType,
  WeightUnit,
} from "@/types/workout";
import { Swipeable } from "react-native-gesture-handler";
import { showAlert, destructiveAlert } from "@/utils/AlertUtil";
import { WorkoutTimer } from "@/components/workout";

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
  weightUnit: WeightUnit;
  onToggleWeightUnit: () => void;
  onStartRestTimer: (time: number) => void;
}

const WorkoutExerciseItem: React.FC<WorkoutExerciseItemProps> = ({
  workoutExercise,
  index,
  onAddSet,
  onUpdateSet,
  onToggleSetComplete,
  onDeleteSet,
  onDeleteExercise,
  onSetTypeChange,
  onSetRestTimeChange,
  weightUnit,
  onToggleWeightUnit,
  onStartRestTimer,
}) => {
  const { isDark } = useTheme();
  const [showSetTypeModal, setShowSetTypeModal] = useState(false);
  const [selectedSetIndex, setSelectedSetIndex] = useState(-1);
  const [activeRestTimers, setActiveRestTimers] = useState<{
    [key: number]: boolean;
  }>({});
  const swipeableRefs = useRef<Array<Swipeable | null>>([]);

  const theme = {
    dimTextColor: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
  };

  // Conversion factor from kg to lbs
  const kgToLbs = 2.20462;

  const handleSetTypePress = (setIndex: number) => {
    setSelectedSetIndex(setIndex);
    setShowSetTypeModal(true);
  };

  const handleSetTypeSelect = (type: string) => {
    if (selectedSetIndex >= 0) {
      onSetTypeChange(index, selectedSetIndex, type);
      setShowSetTypeModal(false);
    }
  };

  // Set type labels and colors
  const getSetTypeLabel = (type?: string) => {
    switch (type) {
      case SetType.WarmUp:
        return "W";
      case SetType.DropSet:
        return "D";
      case SetType.Failure:
        return "F";
      default:
        return "";
    }
  };

  const getSetTypeColor = (type?: string) => {
    switch (type) {
      case SetType.WarmUp:
        return "#FFA500"; // Orange
      case SetType.DropSet:
        return "#800080"; // Purple
      case SetType.Failure:
        return "#FF0000"; // Red
      default:
        return "transparent";
    }
  };

  const handleSetComplete = (setIndex: number) => {
    // Check current completion state
    const isCurrentlyCompleted = workoutExercise.sets[setIndex].completed;

    if (!isCurrentlyCompleted) {
      // We're marking it as complete
      // First, clear any existing timers to ensure only one timer runs at a time
      setActiveRestTimers({});

      // Now set the timer for this set only
      const restTime = workoutExercise.sets[setIndex].restTime || 120;
      setActiveRestTimers({ [setIndex]: true });
    } else {
      // We're unmarking it - remove any active rest timer
      const newActiveTimers = { ...activeRestTimers };
      delete newActiveTimers[setIndex];
      setActiveRestTimers(newActiveTimers);
    }

    // Toggle set completion state through the parent component
    onToggleSetComplete(index, setIndex);
  };

  const handleRestComplete = (setIndex: number) => {
    // Deactivate rest timer when it completes
    const newActiveTimers = { ...activeRestTimers };
    delete newActiveTimers[setIndex];
    setActiveRestTimers(newActiveTimers);
  };

  const confirmDeleteSet = (setIndex: number) => {
    // Check if this is the last set
    if (workoutExercise.sets.length <= 1) {
      // Instead of showing an alert, confirm deletion of the entire exercise
      destructiveAlert(
        "Delete Exercise",
        "This is the last set. Deleting it will remove the entire exercise. Continue?",
        () => onDeleteExercise(index),
        () => swipeableRefs.current[setIndex]?.close(),
        "Delete Exercise",
        "Cancel",
        "trash-outline"
      );
      return;
    }

    // Use destructiveAlert for better styling
    destructiveAlert(
      "Delete Set",
      "Are you sure you want to delete this set?",
      () => onDeleteSet(index, setIndex),
      () => swipeableRefs.current[setIndex]?.close(),
      "Delete",
      "Cancel",
      "trash-outline"
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    return (
      <Animated.View
        style={{
          width: "100%",
          transform: [{ translateX: trans }],
          backgroundColor: "#FF4D4F",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </Animated.View>
    );
  };

  return (
    <View
      className={`mb-4 p-4 border ${
        isDark ? "bg-dark-800 border-dark-700" : "bg-white border-light-300"
      } rounded-3xl ${
        workoutExercise.isSuperSet ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <View className="mb-4 flex-row justify-between items-center">
        <View>
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
            className={
              isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
            }
          >
            {workoutExercise.exercise.category}
          </Text>
        </View>

        <TouchableOpacity onPress={onToggleWeightUnit}>
          <Text className="text-primary font-bold">{weightUnit}</Text>
        </TouchableOpacity>
      </View>

      {workoutExercise.sets.map((set, setIndex) => (
        <React.Fragment key={set.id}>
          <Swipeable
            ref={(el) => (swipeableRefs.current[setIndex] = el)}
            renderRightActions={(progress) => renderRightActions(progress)}
            overshootRight={false}
            onSwipeableRightOpen={() => confirmDeleteSet(setIndex)}
            friction={2}
            rightThreshold={40}
          >
            <View
              className={`flex-row items-center mb-3 ${
                set.completed
                  ? isDark
                    ? "rounded-xl"
                    : "rounded-xl"
                  : "bg-transparent"
              }`}
              style={
                set.completed
                  ? {
                      backgroundColor: isDark
                        ? "rgb(169, 228, 7)"
                        : "rgb(169, 228, 7)",
                      borderLeftWidth: 3,
                      borderLeftColor: COLORS.primary,
                      shadowColor: COLORS.primary,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: isDark ? 0.2 : 0.1,
                      shadowRadius: 3,
                      elevation: 2,
                    }
                  : {}
              }
            >
              <TouchableOpacity
                onPress={() => handleSetTypePress(setIndex)}
                className={`w-12 h-10 rounded-lg justify-center items-center ${
                  set.type ? "border-2" : ""
                }`}
                style={{ borderColor: getSetTypeColor(set.type) }}
              >
                <Text
                  className={`font-medium ${
                    isDark ? "text-white" : "text-dark-900"
                  }`}
                >
                  {getSetTypeLabel(set.type) || `${setIndex + 1}`}
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center flex-1 mx-2">
                <TextInput
                  className={`w-16 h-12 text-center rounded-lg border ${
                    isDark
                      ? "border-dark-700 text-white bg-dark-900"
                      : "border-light-300 text-dark-900 bg-light-50"
                  }`}
                  placeholder="0"
                  placeholderTextColor={theme.dimTextColor}
                  keyboardType="numeric"
                  value={
                    set.weight > 0
                      ? weightUnit === WeightUnit.Kg
                        ? set.weight.toString()
                        : Math.round(set.weight * kgToLbs).toString()
                      : ""
                  }
                  onChangeText={(text) => {
                    const value = Number(text) || 0;
                    // Convert lbs to kg if needed
                    const weightValue =
                      weightUnit === WeightUnit.Kg ? value : value / kgToLbs;
                    onUpdateSet(index, setIndex, "weight", weightValue);
                  }}
                />
                <Text
                  className={
                    isDark ? "text-gray-400 ml-2" : "text-gray-600 ml-2"
                  }
                >
                  {weightUnit}
                </Text>
              </View>

              <View className="flex-row items-center flex-1 mx-2">
                <TextInput
                  className={`w-16 h-12 text-center rounded-lg border ${
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
                  className={
                    isDark ? "text-gray-400 ml-2" : "text-gray-600 ml-2"
                  }
                >
                  reps
                </Text>
              </View>

              <TouchableOpacity
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  set.completed
                    ? "bg-primary"
                    : isDark
                    ? "bg-dark-700"
                    : "bg-light-300"
                }`}
                onPress={() => handleSetComplete(setIndex)}
                style={
                  set.completed
                    ? {
                        shadowColor: COLORS.primary,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6,
                        shadowRadius: 4,
                        elevation: 3,
                      }
                    : {}
                }
              >
                <Ionicons
                  name="checkmark"
                  size={24}
                  color={
                    set.completed
                      ? COLORS.textDark
                      : isDark
                      ? COLORS.textDim
                      : COLORS.textGray
                  }
                />
              </TouchableOpacity>
            </View>
          </Swipeable>

          {/* Show rest timer between sets when a set is completed */}
          {activeRestTimers[setIndex] && (
            <View
              className={`mx-2 mb-3 rounded-xl overflow-hidden ${
                isDark ? "bg-dark-700" : "bg-light-200"
              }`}
              style={{
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.4 : 0.2,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <WorkoutTimer
                startTime={null}
                restMode={true}
                restDuration={set.restTime || 120}
                onRestComplete={() => handleRestComplete(setIndex)}
                onRestDurationChange={(newDuration) => {
                  onSetRestTimeChange(index, setIndex, newDuration);
                  // Update the current timer with the new duration
                  const updatedSet = { ...set, restTime: newDuration };
                  const updatedSets = [...workoutExercise.sets];
                  updatedSets[setIndex] = updatedSet;
                }}
              />
            </View>
          )}
        </React.Fragment>
      ))}

      <TouchableOpacity
        className={`h-10 rounded-xl justify-center items-center mt-2 border border-dashed ${
          isDark ? "border-dark-700" : "border-light-300"
        }`}
        onPress={() => onAddSet(index)}
      >
        <Text className="text-primary font-medium">Add Set</Text>
      </TouchableOpacity>

      {/* Set Type Selection Modal */}
      <Modal
        visible={showSetTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSetTypeModal(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowSetTypeModal(false)}
        >
          <View
            className={`w-80 p-5 rounded-3xl ${
              isDark ? "bg-dark-900" : "bg-white"
            }`}
            onStartShouldSetResponder={() => true}
          >
            <Text
              className={`text-xl font-bold mb-4 text-center ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Set Type
            </Text>

            <TouchableOpacity
              className={`p-4 border-b ${
                isDark ? "border-dark-700" : "border-light-300"
              }`}
              onPress={() => handleSetTypeSelect(SetType.Regular)}
            >
              <Text className={isDark ? "text-white" : "text-dark-900"}>
                Regular Set
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`p-4 border-b ${
                isDark ? "border-dark-700" : "border-light-300"
              }`}
              onPress={() => handleSetTypeSelect(SetType.WarmUp)}
            >
              <Text className={isDark ? "text-white" : "text-dark-900"}>
                Warm Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`p-4 border-b ${
                isDark ? "border-dark-700" : "border-light-300"
              }`}
              onPress={() => handleSetTypeSelect(SetType.DropSet)}
            >
              <Text className={isDark ? "text-white" : "text-dark-900"}>
                Drop Set
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4"
              onPress={() => handleSetTypeSelect(SetType.Failure)}
            >
              <Text className={isDark ? "text-white" : "text-dark-900"}>
                Failure
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default WorkoutExerciseItem;

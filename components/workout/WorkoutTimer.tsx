import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { FONTS, SIZES, COLORS } from "@/utils/constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface WorkoutTimerProps {
  startTime: Date | null;
  restMode?: boolean;
  restDuration?: number; // in seconds
  onRestComplete?: () => void;
  onRestDurationChange?: (newDuration: number) => void; // Callback when rest duration is changed
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  startTime,
  restMode = false,
  restDuration = 120,
  onRestComplete,
  onRestDurationChange,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restTimeRemaining, setRestTimeRemaining] = useState(restDuration);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [timerCompleted, setTimerCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isDark } = useTheme();

  // Reset the timer state when rest duration changes
  useEffect(() => {
    if (restMode) {
      setRestTimeRemaining(restDuration);
      setTimerCompleted(false);
    }
  }, [restDuration, restMode]);

  useEffect(() => {
    // Clear any existing timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (restMode && !isEditing) {
      // Rest timer countdown
      timerRef.current = setInterval(() => {
        setRestTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up
            if (timerRef.current) clearInterval(timerRef.current);
            setTimerCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (startTime) {
      // Regular workout timer
      timerRef.current = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
        setElapsedTime(seconds);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime, restMode, isEditing]);

  // Handle timer completion in a separate useEffect
  useEffect(() => {
    if (timerCompleted && onRestComplete) {
      onRestComplete();
      setTimerCompleted(false);
    }
  }, [timerCompleted, onRestComplete]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle starting edit mode
  const handleStartEdit = () => {
    if (onRestDurationChange) {
      // Pause the timer while editing
      setIsEditing(true);
      // Set initial value to current minutes
      const mins = Math.floor(restTimeRemaining / 60);
      setEditValue(mins.toString());
    }
  };

  // Handle saving the edit
  const handleSaveEdit = () => {
    const mins = parseInt(editValue, 10) || 1; // Default to 1 minute if invalid
    const newDuration = mins * 60; // Convert to seconds

    if (onRestDurationChange) {
      onRestDurationChange(newDuration);
      setRestTimeRemaining(newDuration);
    }

    setIsEditing(false);
  };

  // Calculate progress percentage for rest timer
  const restProgress = (restTimeRemaining / restDuration) * 100;

  if (!restMode) {
    // Regular workout timer
    return (
      <View style={styles.timer}>
        <Text
          style={[styles.timerText, { color: isDark ? "white" : "#121212" }]}
        >
          {formatTime(elapsedTime)}
        </Text>
      </View>
    );
  }

  // Rest timer edit mode
  if (isEditing) {
    return (
      <View
        style={[
          styles.inlineRestContainer,
          {
            backgroundColor: isDark
              ? "rgba(187, 253, 0, 0.1)"
              : "rgba(187, 253, 0, 0.15)",
          },
        ]}
      >
        <View style={styles.editContainer}>
          <Text
            style={[
              styles.editLabel,
              { color: isDark ? COLORS.primary : COLORS.primaryDark },
            ]}
          >
            Rest time (minutes):
          </Text>
          <TextInput
            style={[
              styles.editInput,
              {
                color: isDark ? COLORS.primary : COLORS.primaryDark,
                borderColor: COLORS.primary,
              },
            ]}
            value={editValue}
            onChangeText={setEditValue}
            keyboardType="numeric"
            maxLength={2}
            selectTextOnFocus
            autoFocus
          />
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: COLORS.primary }]}
            onPress={handleSaveEdit}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Rest timer with professional design (now clickable)
  return (
    <Pressable
      onPress={handleStartEdit}
      style={[
        styles.inlineRestContainer,
        {
          backgroundColor: isDark
            ? "rgba(187, 253, 0, 0.05)"
            : "rgba(187, 253, 0, 0.08)",
        },
      ]}
    >
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${restProgress}%`,
              backgroundColor: isDark
                ? "rgba(187, 253, 0, 0.25)"
                : "rgba(187, 253, 0, 0.4)",
            },
          ]}
        />
      </View>
      <View style={styles.inlineRestContent}>
        <Ionicons
          name="time-outline"
          size={20}
          color={COLORS.primary}
          style={styles.timerIcon}
        />
        <Text
          style={[
            styles.inlineRestTimeText,
            { color: isDark ? COLORS.primary : COLORS.primaryDark },
          ]}
        >
          {formatTime(restTimeRemaining)}
        </Text>
        <Ionicons
          name="pencil-outline"
          size={16}
          color={COLORS.primary}
          style={styles.editIcon}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  timer: {
    marginHorizontal: 16,
  },
  timerText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body,
  },
  // Styles for inline rest timer
  inlineRestContainer: {
    width: "100%",
    height: 44,
    overflow: "hidden",
    position: "relative",
  },
  progressBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressBarFill: {
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: COLORS.primary,
  },
  inlineRestContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  timerIcon: {
    marginRight: 6,
  },
  inlineRestTimeText: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  editIcon: {
    marginLeft: 8,
  },
  // Styles for edit mode
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingHorizontal: 12,
  },
  editLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginRight: 8,
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 4,
    width: 40,
    height: 30,
    textAlign: "center",
    fontSize: 16,
    fontFamily: FONTS.medium,
    padding: 0,
  },
  saveButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saveButtonText: {
    color: "#000",
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
});

export default WorkoutTimer;

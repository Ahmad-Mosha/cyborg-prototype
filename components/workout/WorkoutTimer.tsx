import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { FONTS, SIZES } from "@/utils/constants/theme";

interface WorkoutTimerProps {
  startTime: Date | null;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ startTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!startTime) return;

    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
      setElapsedTime(seconds);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.timer}>
      <Text style={[styles.timerText, { color: isDark ? "white" : "#121212" }]}>
        {formatTime(elapsedTime)}
      </Text>
    </View>
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
});

export default WorkoutTimer;

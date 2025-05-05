import React, { useEffect } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface CyborgBrainVisualizationProps {
  isDark?: boolean;
}

const CyborgBrainVisualization = ({
  isDark = true,
}: CyborgBrainVisualizationProps) => {
  // Animation values
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  // Initialize animations
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1, // Infinite repeat
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1, // Infinite repeat
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: pulseOpacity.value,
    };
  });

  return (
    <View
      className={
        isDark
          ? "w-full items-center justify-center py-2"
          : "w-full items-center justify-center py-2 bg-light-100"
      }
    >
      <View className="relative w-20 h-20 items-center justify-center">
        <Animated.View
          style={pulseStyle}
          className="absolute w-20 h-20 rounded-full bg-primary opacity-30"
        />
        <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
          <Ionicons name="fitness" size={24} color="#121212" />
        </View>
      </View>
    </View>
  );
};

export default CyborgBrainVisualization;

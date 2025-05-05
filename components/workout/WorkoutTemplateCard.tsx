import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { WorkoutTemplate } from "@/types/workout";

interface WorkoutTemplateCardProps {
  template: WorkoutTemplate;
  isExample?: boolean;
  onPress: () => void;
  onOptionsPress: () => void;
}

const WorkoutTemplateCard: React.FC<WorkoutTemplateCardProps> = ({
  template,
  isExample = false,
  onPress,
  onOptionsPress,
}) => {
  const { isDark } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  // Format template last used date
  const formatTimeAgo = (date: Date) => {
    const days = Math.round(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${days} days ago`;
  };

  // Debounced press handler to prevent multiple clicks
  const handlePress = () => {
    if (isPressed) return; // If already pressed, ignore subsequent presses

    setIsPressed(true);
    onPress();

    // Reset press state after a delay
    setTimeout(() => {
      setIsPressed(false);
    }, 1000);
  };

  // Debounced options press handler
  const handleOptionsPress = (e: any) => {
    e.stopPropagation(); // Prevent triggering the parent touch event

    if (isPressed) return;

    setIsPressed(true);
    onOptionsPress();

    // Reset press state after a delay
    setTimeout(() => {
      setIsPressed(false);
    }, 1000);
  };

  return (
    <TouchableOpacity
      key={template.id}
      className={`w-48 h-32 mr-4 rounded-3xl p-4 ${
        isDark
          ? "bg-dark-800 border border-dark-700"
          : "bg-white border border-light-300 shadow"
      }`}
      onPress={handlePress}
      activeOpacity={0.7} // Make it more responsive by showing visual feedback
      disabled={isPressed} // Disable while processing to prevent double clicks
    >
      <View className="flex-1">
        <Text
          className={`font-bold ${isDark ? "text-white" : "text-dark-900"}`}
        >
          {template.name}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
          numberOfLines={2}
        >
          {template.exercises
            .map((ex) => `${ex.name}${ex.count ? ` (${ex.count})` : ""}`)
            .join(", ")}
        </Text>
      </View>

      <View className="flex-row justify-between items-center">
        {isExample ? (
          <Text
            className={`text-xs ${isDark ? "text-primary" : "text-primary"}`}
          >
            Example workout
          </Text>
        ) : (
          <View className="flex-row items-center">
            <Ionicons
              name="time-outline"
              size={14}
              color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
            />
            <Text
              className={`text-xs ml-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {template.lastUsed ? formatTimeAgo(template.lastUsed) : "New"}
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={handleOptionsPress}
          disabled={isPressed} // Disable while processing
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={16}
            color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutTemplateCard;

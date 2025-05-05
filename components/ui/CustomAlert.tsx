import React, { useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: {
    text: string;
    style?: "default" | "cancel" | "destructive";
    onPress?: () => void;
  }[];
  icon?: string;
  iconColor?: string;
  onClose?: () => void;
}

const CustomAlert = ({
  visible,
  title,
  message,
  buttons = [{ text: "OK" }],
  icon,
  iconColor,
  onClose,
}: CustomAlertProps) => {
  const { isDark } = useTheme();
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withTiming(1.05, { duration: 150 }),
        withTiming(1, { duration: 100 })
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        if (onClose) onClose();
        else if (buttons.length > 0 && buttons[0].onPress) buttons[0].onPress();
      }}
    >
      <View className="flex-1 justify-center items-center bg-black/60">
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={[animatedStyle]}
          className={`w-11/12 p-5 rounded-3xl ${
            isDark ? "bg-dark-800" : "bg-white"
          } shadow-lg max-w-md`}
        >
          {/* Title row with optional icon */}
          <View className="flex-row items-center justify-center mb-2">
            {icon && (
              <View className="mr-2">
                <Ionicons
                  name={icon as any}
                  size={24}
                  color={iconColor || (isDark ? "#BBFD00" : "#BBFD00")}
                />
              </View>
            )}
            <Text
              className={`text-center text-xl font-bold ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              {title}
            </Text>
          </View>

          {/* Message */}
          <Text
            className={`text-center mb-6 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {message}
          </Text>

          {/* Buttons */}
          <View
            className={`${
              buttons.length > 1 ? "flex-row justify-between" : "items-center"
            }`}
          >
            {buttons.map((button, index) => {
              const isDestructive = button.style === "destructive";
              const isCancel = button.style === "cancel";

              return (
                <TouchableOpacity
                  key={index}
                  className={`${buttons.length > 1 ? "flex-1" : "w-32"} 
                   h-12 rounded-xl justify-center items-center
                   ${index > 0 && buttons.length > 1 ? "ml-2" : ""}
                   ${
                     isDestructive
                       ? isDark
                         ? "bg-red-900/30"
                         : "bg-red-100"
                       : isCancel
                       ? isDark
                         ? "bg-dark-700"
                         : "bg-light-200"
                       : "bg-primary"
                   }`}
                  onPress={() => {
                    if (button.onPress) button.onPress();
                    else if (onClose) onClose();
                  }}
                >
                  <Text
                    className={`font-bold
                      ${
                        isDestructive
                          ? "text-red-500"
                          : isCancel
                          ? isDark
                            ? "text-gray-300"
                            : "text-gray-700"
                          : "text-dark-900"
                      }`}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

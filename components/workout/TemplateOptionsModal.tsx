import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { COLORS } from "@/utils/constants/theme";
import { WorkoutTemplate } from "@/types/workout";

interface TemplateOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  template: WorkoutTemplate | null;
  onStartWorkout: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TemplateOptionsModal: React.FC<TemplateOptionsModalProps> = ({
  visible,
  onClose,
  template,
  onStartWorkout,
  onEdit,
  onDelete,
}) => {
  const { isDark } = useTheme();

  if (!template) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 justify-end items-center bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          className={`w-full p-4 rounded-t-3xl ${
            isDark ? "bg-dark-800" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

          <Text
            className={`text-center text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-dark-900"
            }`}
          >
            {template.name}
          </Text>

          <TouchableOpacity
            className={`flex-row items-center p-4 mb-2 rounded-xl ${
              isDark ? "bg-dark-700" : "bg-light-200"
            }`}
            onPress={onStartWorkout}
          >
            <Ionicons
              name="play-circle-outline"
              size={24}
              color={COLORS.primary}
            />
            <Text
              className={`ml-3 font-medium ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Start Workout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row items-center p-4 mb-2 rounded-xl ${
              isDark ? "bg-dark-700" : "bg-light-200"
            }`}
            onPress={onEdit}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={isDark ? "white" : "#121212"}
            />
            <Text
              className={`ml-3 font-medium ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Edit Template
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row items-center p-4 mb-4 rounded-xl ${
              isDark ? "bg-dark-700" : "bg-light-200"
            }`}
            onPress={onDelete}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={isDark ? "#FF6B6B" : "#FF4757"}
            />
            <Text className="ml-3 font-medium text-red-500">
              Delete Template
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`p-4 rounded-xl ${
              isDark ? "bg-dark-700" : "bg-light-200"
            }`}
            onPress={onClose}
          >
            <Text
              className={`text-center font-medium ${
                isDark ? "text-white" : "text-dark-900"
              }`}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default TemplateOptionsModal;

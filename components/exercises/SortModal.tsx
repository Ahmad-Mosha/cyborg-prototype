import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  sortBy: string;
  applySort: (sortOption: string) => void;
}

const SortModal = ({ visible, onClose, sortBy, applySort }: SortModalProps) => {
  const { isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/60"
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          className={`absolute top-28 right-6 ${
            isDark ? "bg-dark-800 border-dark-700" : "bg-white border-gray-200"
          } rounded-xl overflow-hidden border`}
          style={{ width: 200, zIndex: 9999 }}
        >
          <TouchableOpacity
            onPress={() => applySort("name")}
            className="flex-row justify-between items-center py-3 px-4"
          >
            <Text
              className={
                isDark ? "text-white text-base" : "text-dark-900 text-base"
              }
            >
              Name
            </Text>
            {sortBy === "name" && (
              <Ionicons name="checkmark" size={22} color="#BBFD00" />
            )}
          </TouchableOpacity>

          <View className={isDark ? "h-px bg-dark-700" : "h-px bg-gray-200"} />

          <TouchableOpacity
            onPress={() => applySort("frequency")}
            className="flex-row justify-between items-center py-3 px-4"
          >
            <Text
              className={
                isDark ? "text-white text-base" : "text-dark-900 text-base"
              }
            >
              Frequency
            </Text>
            {sortBy === "frequency" && (
              <Ionicons name="checkmark" size={22} color="#BBFD00" />
            )}
          </TouchableOpacity>

          <View className={isDark ? "h-px bg-dark-700" : "h-px bg-gray-200"} />

          <TouchableOpacity
            onPress={() => applySort("lastPerformed")}
            className="flex-row justify-between items-center py-3 px-4"
          >
            <Text
              className={
                isDark ? "text-white text-base" : "text-dark-900 text-base"
              }
            >
              Last performed
            </Text>
            {sortBy === "lastPerformed" && (
              <Ionicons name="checkmark" size={22} color="#BBFD00" />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SortModal;

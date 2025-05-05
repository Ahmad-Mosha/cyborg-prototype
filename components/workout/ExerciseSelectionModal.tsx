import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { COLORS } from "@/utils/constants/theme";
import { Exercise } from "@/types/workout";

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  exercises: Exercise[];
  selectedExercises: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSelection: (id: string) => void;
  onAddSelected: () => void;
  forTemplate?: boolean;
}

const ExerciseSelectionModal: React.FC<ExerciseSelectionModalProps> = ({
  visible,
  onClose,
  exercises,
  selectedExercises,
  searchQuery,
  onSearchChange,
  onToggleSelection,
  onAddSelected,
  forTemplate = false,
}) => {
  const { isDark } = useTheme();
  const theme = {
    dimTextColor: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className={`flex-1 ${isDark ? "bg-dark-900" : "bg-light-100"}`}>
        <View
          className={`flex-row justify-between items-center h-16 px-4 border-b ${
            isDark ? "border-dark-700" : "border-light-300"
          }`}
        >
          <Text
            className={
              isDark
                ? "text-white font-bold text-lg"
                : "text-dark-900 font-bold text-lg"
            }
          >
            {forTemplate ? "Select Exercises" : "Add exercises"}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "white" : "#121212"}
            />
          </TouchableOpacity>
        </View>

        <View
          className={`flex-row items-center h-12 mx-4 my-4 px-4 rounded-xl border ${
            isDark ? "bg-dark-800 border-dark-700" : "bg-white border-light-300"
          }`}
        >
          <Ionicons name="search" size={20} color={theme.dimTextColor} />
          <TextInput
            className={`flex-1 ml-2 ${isDark ? "text-white" : "text-dark-900"}`}
            placeholder="Search exercises..."
            placeholderTextColor={theme.dimTextColor}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => onSearchChange("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.dimTextColor}
              />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`p-4 mb-2 rounded-xl border ${
                isDark
                  ? "bg-dark-800 border-dark-700"
                  : "bg-white border-light-300"
              } ${selectedExercises.includes(item.id) ? "border-primary" : ""}`}
              onPress={() => onToggleSelection(item.id)}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text
                    className={
                      isDark
                        ? "text-white font-medium text-base"
                        : "text-dark-900 font-medium text-base"
                    }
                  >
                    {item.name}
                  </Text>
                  <Text
                    className={
                      isDark ? "text-gray-400 text-sm" : "text-gray-600 text-sm"
                    }
                  >
                    {item.category}
                  </Text>
                </View>

                {selectedExercises.includes(item.id) && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={COLORS.primary}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}
        />

        <View className="absolute bottom-0 left-0 right-0 p-4 items-center">
          {selectedExercises.length > 0 && (
            <Text
              className={`mb-2 ${
                isDark ? "text-white" : "text-dark-900"
              } font-medium`}
            >
              {selectedExercises.length} selected
              {selectedExercises.length > 1 && !forTemplate
                ? " (Superset)"
                : ""}
            </Text>
          )}
          <TouchableOpacity
            className={`w-full h-12 rounded-2xl justify-center items-center ${
              selectedExercises.length > 0
                ? "bg-primary"
                : isDark
                ? "bg-dark-800"
                : "bg-light-200"
            }`}
            style={{ opacity: selectedExercises.length > 0 ? 1 : 0.5 }}
            disabled={selectedExercises.length === 0}
            onPress={onAddSelected}
          >
            <Text
              className={`font-bold ${
                selectedExercises.length > 0
                  ? "text-dark-900"
                  : isDark
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              {forTemplate ? "Done" : "Add Selected"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ExerciseSelectionModal;

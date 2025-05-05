import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/utils/constants/theme";
import { Exercise, NewTemplate } from "@/types/workout";

interface TemplateFormModalProps {
  visible: boolean;
  onClose: () => void;
  template: NewTemplate;
  onTemplateChange: (field: keyof NewTemplate, value: string) => void;
  selectedExercises: Exercise[];
  onRemoveExercise: (exerciseId: string) => void;
  onAddExercisesPress: () => void;
  onSave: () => void;
  isValid: boolean;
  isEditing?: boolean;
}

const TemplateFormModal: React.FC<TemplateFormModalProps> = ({
  visible,
  onClose,
  template,
  onTemplateChange,
  selectedExercises,
  onRemoveExercise,
  onAddExercisesPress,
  onSave,
  isValid,
  isEditing = false,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

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
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-dark-900"
            }`}
          >
            {isEditing
              ? t("workout.editTemplate", "Edit Template")
              : t("workout.createTemplate", "Create Template")}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "white" : "#121212"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
          <Text
            className={`font-bold mb-2 ${
              isDark ? "text-white" : "text-dark-900"
            }`}
          >
            {t("workout.templateName", "Template Name")} *
          </Text>
          <TextInput
            className={`border rounded-xl h-12 px-4 mb-4 ${
              isDark
                ? "bg-dark-800 border-dark-700 text-white"
                : "bg-white border-light-300 text-dark-900"
            }`}
            placeholder={t("workout.enterTemplateName", "Enter template name")}
            placeholderTextColor={isDark ? COLORS.textDim : "#9CA3AF"}
            value={template.name}
            onChangeText={(text) => onTemplateChange("name", text)}
          />

          <Text
            className={`font-bold mb-2 ${
              isDark ? "text-white" : "text-dark-900"
            }`}
          >
            {t("workout.templateDescription", "Description")}
          </Text>
          <TextInput
            className={`border rounded-xl h-24 px-4 py-2 mb-6 ${
              isDark
                ? "bg-dark-800 border-dark-700 text-white"
                : "bg-white border-light-300 text-dark-900"
            }`}
            placeholder={t(
              "workout.enterTemplateDescription",
              "Enter template description (optional)"
            )}
            placeholderTextColor={isDark ? COLORS.textDim : "#9CA3AF"}
            multiline={true}
            textAlignVertical="top"
            value={template.description}
            onChangeText={(text) => onTemplateChange("description", text)}
          />

          <Text
            className={`font-bold mb-2 ${
              isDark ? "text-white" : "text-dark-900"
            }`}
          >
            {t("workout.exercises", "Exercises")} *
          </Text>

          {/* Selected exercises list */}
          {selectedExercises.length === 0 ? (
            <Text
              className={`mb-2 italic ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {t(
                "workout.noExercisesSelected",
                "No exercises selected. Add exercises below."
              )}
            </Text>
          ) : (
            <View className="mb-4">
              {selectedExercises.map((exercise) => (
                <View
                  key={exercise.id}
                  className={`flex-row items-center justify-between p-3 mb-2 rounded-xl border ${
                    isDark
                      ? "bg-dark-800 border-dark-700"
                      : "bg-white border-light-300"
                  }`}
                >
                  <View className="flex-1">
                    <Text
                      className={`font-medium ${
                        isDark ? "text-white" : "text-dark-900"
                      }`}
                    >
                      {exercise.name}
                    </Text>
                    <Text
                      className={
                        isDark
                          ? "text-gray-400 text-xs"
                          : "text-gray-600 text-xs"
                      }
                    >
                      {exercise.category}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className={`p-2 rounded-full ${
                      isDark ? "bg-dark-700" : "bg-light-200"
                    }`}
                    onPress={() => onRemoveExercise(exercise.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={isDark ? "#FF6B6B" : "#FF4757"}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add exercise button */}
          <TouchableOpacity
            className={`flex-row items-center justify-center p-3 mb-6 rounded-xl border border-dashed ${
              isDark ? "border-primary/50" : "border-primary/50"
            }`}
            onPress={onAddExercisesPress}
          >
            <Ionicons name="add-circle" size={20} color={COLORS.primary} />
            <Text className="text-primary font-medium ml-2">
              {t("workout.addExercise", "Add Exercises")}
            </Text>
          </TouchableOpacity>

          {/* Save button */}
          <TouchableOpacity
            className={`h-12 rounded-xl justify-center items-center ${
              isValid ? "bg-primary" : isDark ? "bg-dark-700" : "bg-light-200"
            }`}
            onPress={onSave}
            disabled={!isValid}
          >
            <Text
              className={`font-bold ${
                isValid
                  ? "text-dark-900"
                  : isDark
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {isEditing
                ? t("workout.saveChanges", "Save Changes")
                : t("workout.createTemplate", "Create Template")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TemplateFormModal;

import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Exercise, WorkoutTemplate } from "@/types/workout";
import { useTranslation } from "react-i18next";
import WorkoutTemplateCard from "./WorkoutTemplateCard";
import TemplateFormModal from "./TemplateFormModal";
import TemplateOptionsModal from "./TemplateOptionsModal";
import ExerciseSelectionModal from "./ExerciseSelectionModal";

interface WorkoutHomeScreenProps {
  templates: WorkoutTemplate[];
  exampleTemplates: WorkoutTemplate[];
  onStartEmptyWorkout: () => void;
  onStartTemplateWorkout: (template: WorkoutTemplate) => void;
  onCreateTemplate: () => void;
  onSettingsPress: () => void;
  onGenerateAIWorkout: () => void; // Add this new prop
  // Template form modal props
  showCreateTemplateModal: boolean;
  setShowCreateTemplateModal: (show: boolean) => void;
  newTemplate: {
    name: string;
    description: string;
  };
  onTemplateChange: (field: string, value: string) => void;
  selectedTemplateExercises: Exercise[];
  onRemoveExerciseFromTemplate: (exerciseId: string) => void;
  onShowExerciseSelectionForTemplate: () => void;
  onCreateTemplateSubmit: () => void;
  isTemplateFormValid: boolean;
  // Template options modal props
  showTemplateOptionsModal: boolean;
  setShowTemplateOptionsModal: (show: boolean) => void;
  selectedTemplate: WorkoutTemplate | null;
  onTemplateOptionsPress: (template: WorkoutTemplate) => void;
  onEditTemplate: () => void;
  onDeleteTemplate: () => void;
  // Exercise selection modal props
  showExerciseSelectionForTemplate: boolean;
  setShowExerciseSelectionForTemplate: (show: boolean) => void;
  exercises: Exercise[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectExerciseForTemplate: (exercise: Exercise) => void;
}

const WorkoutHomeScreen: React.FC<WorkoutHomeScreenProps> = ({
  templates,
  exampleTemplates,
  onStartEmptyWorkout,
  onStartTemplateWorkout,
  onCreateTemplate,
  onSettingsPress,
  onGenerateAIWorkout, // Add this parameter
  showCreateTemplateModal,
  setShowCreateTemplateModal,
  newTemplate,
  onTemplateChange,
  selectedTemplateExercises,
  onRemoveExerciseFromTemplate,
  onShowExerciseSelectionForTemplate,
  onCreateTemplateSubmit,
  isTemplateFormValid,
  showTemplateOptionsModal,
  setShowTemplateOptionsModal,
  selectedTemplate,
  onTemplateOptionsPress,
  onEditTemplate,
  onDeleteTemplate,
  showExerciseSelectionForTemplate,
  setShowExerciseSelectionForTemplate,
  exercises,
  searchQuery,
  onSearchChange,
  onSelectExerciseForTemplate,
}) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // Format template last used date
  const formatTimeAgo = (date: Date) => {
    const days = Math.round(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${days} ${t("workout.daysAgo", "days ago")}`;
  };

  return (
    <View
      className={`flex-1 ${isDark ? "bg-dark-900" : "bg-light-100"}`}
      style={{ paddingTop: insets.top }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View className="flex-row justify-between items-center px-6 pt-4">
        <Text
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-dark-900"
          }`}
        >
          {t("workout.workout", "Workout")}
        </Text>
        <TouchableOpacity
          className={`w-10 h-10 rounded-full items-center justify-center ${
            isDark ? "bg-dark-800" : "bg-light-200"
          }`}
          onPress={onSettingsPress}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={isDark ? "white" : "#121212"}
          />
        </TouchableOpacity>
      </View>

      <View className="mt-6 px-6">
        <Text
          className={`text-lg font-bold ${
            isDark ? "text-white" : "text-dark-900"
          }`}
        >
          {t("workout.quickStart", "Quick start")}
        </Text>{" "}
        <TouchableOpacity
          className="h-12 bg-primary rounded-2xl justify-center items-center mt-2 mb-3"
          onPress={onStartEmptyWorkout}
        >
          <Text className="text-dark-900 font-bold">
            {t("workout.startEmptyWorkout", "START AN EMPTY WORKOUT")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`h-12 rounded-2xl justify-center items-center mb-6 border-2 flex-row ${
            isDark ? "border-primary bg-dark-800" : "border-primary bg-white"
          }`}
          onPress={onGenerateAIWorkout}
        >
          <Ionicons
            name="sparkles"
            size={20}
            color="#9333EA"
            style={{ marginRight: 8 }}
          />
          <Text className="text-primary font-bold">
            {t("workout.generateAIWorkout", "GENERATE AI WORKOUT PLAN")}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-dark-900"
            }`}
          >
            {t("workout.templates", "Templates")}
          </Text>
          <View className="flex-row">
            <TouchableOpacity
              className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                isDark ? "bg-dark-800" : "bg-light-200"
              }`}
              onPress={onCreateTemplate}
            >
              <Ionicons
                name="add"
                size={20}
                color={isDark ? "white" : "#121212"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                isDark ? "bg-dark-800" : "bg-light-200"
              }`}
            >
              <Ionicons
                name="calendar"
                size={20}
                color={isDark ? "white" : "#121212"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-8 h-8 rounded-full items-center justify-center ${
                isDark ? "bg-dark-800" : "bg-light-200"
              }`}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={isDark ? "white" : "#121212"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text
          className={`${
            isDark ? "text-white" : "text-dark-900"
          } font-medium mb-2`}
        >
          {t("workout.myTemplates", "My Templates")} ({templates.length})
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
          className="mb-4"
        >
          {templates.map((template) => (
            <WorkoutTemplateCard
              key={template.id}
              template={template}
              onPress={() => onStartTemplateWorkout(template)}
              onOptionsPress={() => onTemplateOptionsPress(template)}
            />
          ))}
        </ScrollView>

        <Text
          className={`${
            isDark ? "text-white" : "text-dark-900"
          } font-medium mb-2`}
        >
          {t("workout.exampleTemplates", "Example Templates")} (
          {exampleTemplates.length})
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {exampleTemplates.map((template) => (
            <WorkoutTemplateCard
              key={template.id}
              template={template}
              isExample={true}
              onPress={() => onStartTemplateWorkout(template)}
              onOptionsPress={() => {}}
            />
          ))}
        </ScrollView>
      </View>

      {/* Template Form Modal */}
      <TemplateFormModal
        visible={showCreateTemplateModal}
        onClose={() => setShowCreateTemplateModal(false)}
        template={newTemplate}
        onTemplateChange={(field, value) => onTemplateChange(field, value)}
        selectedExercises={selectedTemplateExercises}
        onRemoveExercise={onRemoveExerciseFromTemplate}
        onAddExercisesPress={onShowExerciseSelectionForTemplate}
        onSave={onCreateTemplateSubmit}
        isValid={isTemplateFormValid}
      />

      {/* Template Options Modal */}
      <TemplateOptionsModal
        visible={showTemplateOptionsModal}
        onClose={() => setShowTemplateOptionsModal(false)}
        template={selectedTemplate}
        onStartWorkout={() => {
          setShowTemplateOptionsModal(false);
          if (selectedTemplate) {
            onStartTemplateWorkout(selectedTemplate);
          }
        }}
        onEdit={onEditTemplate}
        onDelete={onDeleteTemplate}
      />

      {/* Exercise Selection Modal for Template */}
      <ExerciseSelectionModal
        visible={showExerciseSelectionForTemplate}
        onClose={() => setShowExerciseSelectionForTemplate(false)}
        exercises={exercises}
        selectedExercises={selectedTemplateExercises.map((ex) => ex.id)}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onToggleSelection={(id) => {
          const exercise = exercises.find((ex) => ex.id === id);
          if (exercise) {
            onSelectExerciseForTemplate(exercise);
          }
        }}
        onAddSelected={() => setShowExerciseSelectionForTemplate(false)}
        forTemplate={true}
      />

      {/* AI Workout Plan Button - New Section */}
      <View className="px-6 mb-4">
        <TouchableOpacity
          className="h-12 bg-success rounded-2xl justify-center items-center"
          onPress={onGenerateAIWorkout}
        >
          <Text className="text-dark-900 font-bold">
            {t("workout.generateAIWorkout", "GENERATE AI WORKOUT PLAN")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkoutHomeScreen;

import React, { useState, useRef } from "react";
import { router } from "expo-router";
import { useTabBar } from "@/contexts/TabBarContext";
import { showAlert, confirmAlert, destructiveAlert } from "@/utils/AlertUtil";
import {
  ActiveWorkout,
  Exercise,
  NewTemplate,
  WorkoutExercise,
  WorkoutTemplate,
  WeightUnit,
  SetType,
} from "@/types/workout";
import { WorkoutHomeScreen, ActiveWorkoutScreen } from "@/components/workout";

const WorkoutScreen = () => {
  const { setIsVisible } = useTabBar();

  // States
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([
    {
      id: "1",
      name: "Shoulders",
      exercises: [
        {
          id: "101",
          name: "Shoulder Press (Plate Loaded)",
          category: "Shoulders",
        },
        { id: "102", name: "Lateral Raise (Cable)", category: "Shoulders" },
        { id: "103", name: "Arnold Press (Dumbbell)", category: "Shoulders" },
      ],
      lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: "2",
      name: "Arms",
      exercises: [
        { id: "201", name: "Preacher Curl (Machine)", category: "Arms" },
        { id: "202", name: "Triceps Pushdown (Cable)", category: "Arms" },
      ],
      lastUsed: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    },
    {
      id: "3",
      name: "Chest-back",
      exercises: [
        { id: "301", name: "Incline Chest Press (Machine)", category: "Chest" },
        { id: "302", name: "Lat Pulldown - Wide Grip", category: "Back" },
      ],
      lastUsed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
  ]);

  const [exampleTemplates, setExampleTemplates] = useState<WorkoutTemplate[]>([
    {
      id: "ex1",
      name: "Strong 5×5 - Workout B",
      exercises: [
        { id: "ex101", name: "Squat (Barbell)", category: "Legs", count: 5 },
        {
          id: "ex102",
          name: "Bench Press (Barbell)",
          category: "Chest",
          count: 5,
        },
        { id: "ex103", name: "Barbell Row", category: "Back", count: 5 },
      ],
    },
    {
      id: "ex2",
      name: "Legs",
      exercises: [
        { id: "ex201", name: "Squat (Barbell)", category: "Legs" },
        { id: "ex202", name: "Leg Extension (Machine)", category: "Legs" },
        { id: "ex203", name: "Romanian Deadlift", category: "Legs" },
      ],
    },
  ]);

  const [allExercises, setAllExercises] = useState<Exercise[]>([
    { id: "1", name: "Arnold Press (Dumbbell)", category: "Shoulders" },
    { id: "2", name: "Around the World", category: "Chest" },
    { id: "3", name: "Back Extension", category: "Back" },
    { id: "4", name: "Back Extension (Machine)", category: "Back" },
    { id: "5", name: "Back Shoulder", category: "Shoulders" },
    { id: "6", name: "Ball Slams", category: "Full Body" },
    { id: "7", name: "Battle Ropes", category: "Cardio" },
    { id: "8", name: "Bench Dip", category: "Arms" },
    { id: "9", name: "Bench Press (Barbell)", category: "Chest" },
    { id: "10", name: "Bench Press (Cable)", category: "Chest" },
    { id: "11", name: "Bench Press (Dumbbell)", category: "Chest" },
  ]);

  // Active workout
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout>({
    name: "Evening Workout",
    exercises: [],
    startTime: null,
    isActive: false,
    weightUnit: WeightUnit.Kg, // Default to kg
    defaultRestTime: 120, // Default rest time 2 minutes
  });

  // Modal states
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<NewTemplate>({
    name: "",
    description: "",
  });
  const [selectedTemplateExercises, setSelectedTemplateExercises] = useState<
    Exercise[]
  >([]);
  const [
    showExerciseSelectionForTemplate,
    setShowExerciseSelectionForTemplate,
  ] = useState(false);

  // New state for template options modal
  const [showTemplateOptionsModal, setShowTemplateOptionsModal] =
    useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<WorkoutTemplate | null>(null);

  const [showWorkoutConfirmModal, setShowWorkoutConfirmModal] = useState(false);

  // Filtered exercises based on search
  const filteredExercises =
    searchQuery.trim() === ""
      ? allExercises
      : allExercises.filter(
          (exercise) =>
            exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // Handle starting a new empty workout
  const startEmptyWorkout = () => {
    // Hide the bottom tab bar when starting a workout
    setIsVisible(false);
    setActiveWorkout({
      name: "New Workout",
      exercises: [],
      startTime: new Date(),
      isActive: true,
      weightUnit: WeightUnit.Kg,
      defaultRestTime: 120,
    });
  };

  // Handle starting a workout from template
  const startTemplateWorkout = (template: WorkoutTemplate) => {
    // Hide the bottom tab bar when starting a workout
    setIsVisible(false);

    // Convert template exercises to workout exercises
    const workoutExercises: WorkoutExercise[] = template.exercises.map(
      (exercise) => ({
        exercise,
        sets: [
          {
            id: `set-${Date.now()}-1`,
            weight: 0,
            reps: 0,
            completed: false,
            type: SetType.Regular,
            restTime: 120,
          },
        ],
        isSuperSet: false,
      })
    );

    setActiveWorkout({
      name: template.name,
      exercises: workoutExercises,
      startTime: new Date(),
      isActive: true,
      weightUnit: WeightUnit.Kg,
      defaultRestTime: 120,
    });
  };

  // Show confirmation before starting a workout from template
  const confirmStartWorkout = (template: WorkoutTemplate) => {
    showAlert(
      "Start Workout",
      `Are you ready to start "${template.name}" with ${
        template.exercises.length
      } ${template.exercises.length === 1 ? "exercise" : "exercises"}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Start Now",
          onPress: () => startTemplateWorkout(template),
        },
      ],
      "barbell-outline",
      "#BBFD00"
    );
  };

  // Add selected exercises to workout
  const addExercisesToWorkout = () => {
    if (selectedExercises.length === 0) return;

    const newExercises: WorkoutExercise[] = [];
    const isSuperSet = selectedExercises.length > 1;
    const superSetGroup = isSuperSet ? `ss-${Date.now()}` : undefined;

    selectedExercises.forEach((id) => {
      const exercise = allExercises.find((e) => e.id === id);
      if (exercise) {
        newExercises.push({
          exercise,
          sets: [
            {
              id: `set-${Date.now()}-${id}`,
              weight: 0,
              reps: 0,
              completed: false,
              type: SetType.Regular,
              restTime: activeWorkout.defaultRestTime,
            },
          ],
          isSuperSet,
          superSetGroup,
        });
      }
    });

    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, ...newExercises],
    });

    setSelectedExercises([]);
    setShowExerciseModal(false);
  };

  // Save current workout as template
  const saveAsTemplate = () => {
    if (!newTemplateName.trim()) {
      showAlert("Error", "Please enter a template name");
      return;
    }

    const templateExercises = activeWorkout.exercises.map((we) => we.exercise);
    const newTemplate: WorkoutTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      exercises: templateExercises,
      lastUsed: new Date(),
    };

    setTemplates([newTemplate, ...templates]);
    setNewTemplateName("");
    setShowSaveTemplateModal(false);
    showAlert(
      "Success",
      "Workout saved as template",
      [],
      "checkmark-circle",
      "#BBFD00"
    );
  };

  // Handle creating a new template
  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      showAlert("Error", "Please enter a template name");
      return;
    }

    if (selectedTemplateExercises.length === 0) {
      showAlert("Error", "Please add at least one exercise");
      return;
    }

    const newTemplateObj: WorkoutTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplate.name.trim(),
      description: newTemplate.description.trim(),
      exercises: selectedTemplateExercises,
      lastUsed: new Date(),
    };

    // Add the new template to the top of the list
    setTemplates([newTemplateObj, ...templates]);

    // Reset state
    setNewTemplate({ name: "", description: "" });
    setSelectedTemplateExercises([]);
    setShowCreateTemplateModal(false);

    showAlert(
      "Success",
      "Template created successfully",
      [],
      "checkmark-circle",
      "#BBFD00"
    );
  };

  // Handle selecting exercises for template
  const handleSelectExerciseForTemplate = (exercise: Exercise) => {
    // Check if exercise already exists in selected exercises
    const isAlreadySelected = selectedTemplateExercises.some(
      (ex) => ex.id === exercise.id
    );

    if (isAlreadySelected) {
      // Remove the exercise if already selected
      setSelectedTemplateExercises(
        selectedTemplateExercises.filter((ex) => ex.id !== exercise.id)
      );
    } else {
      // Add the exercise
      setSelectedTemplateExercises([...selectedTemplateExercises, exercise]);
    }
  };

  // Handle removing exercise from template selection
  const handleRemoveExerciseFromTemplate = (exerciseId: string) => {
    setSelectedTemplateExercises(
      selectedTemplateExercises.filter((ex) => ex.id !== exerciseId)
    );
  };

  // Handle adding a set to an exercise
  const handleAddSet = (exerciseIndex: number) => {
    const newExercises = [...activeWorkout.exercises];
    newExercises[exerciseIndex].sets.push({
      id: `set-${Date.now()}-${exerciseIndex}-${
        newExercises[exerciseIndex].sets.length
      }`,
      weight: 0,
      reps: 0,
      completed: false,
      type: SetType.Regular,
      restTime: activeWorkout.defaultRestTime,
    });
    setActiveWorkout({
      ...activeWorkout,
      exercises: newExercises,
    });
  };

  // Handle updating a set's weight or reps
  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: number
  ) => {
    const newExercises = [...activeWorkout.exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setActiveWorkout({
      ...activeWorkout,
      exercises: newExercises,
    });
  };

  // Handle toggling a set's completion status
  const handleToggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...activeWorkout.exercises];
    newExercises[exerciseIndex].sets[setIndex].completed =
      !newExercises[exerciseIndex].sets[setIndex].completed;
    setActiveWorkout({
      ...activeWorkout,
      exercises: newExercises,
    });
  };

  // Handle deleting a set
  const handleDeleteSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...activeWorkout.exercises];
    // Don't delete if it's the only set
    if (newExercises[exerciseIndex].sets.length <= 1) {
      showAlert("Cannot Delete", "An exercise must have at least one set.");
      return;
    }

    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    setActiveWorkout({
      ...activeWorkout,
      exercises: newExercises,
    });
  };

  // Handle deleting an entire exercise
  const handleDeleteExercise = (exerciseIndex: number) => {
    const newExercises = [...activeWorkout.exercises];
    newExercises.splice(exerciseIndex, 1);
    setActiveWorkout({
      ...activeWorkout,
      exercises: newExercises,
    });
  };

  // Handle set type change
  const handleSetTypeChange = (
    exerciseIndex: number,
    setIndex: number,
    type: string
  ) => {
    const newExercises = [...activeWorkout.exercises];
    newExercises[exerciseIndex].sets[setIndex].type = type;
    setActiveWorkout({
      ...activeWorkout,
      exercises: newExercises,
    });
  };

  // Handle set rest time change
  const handleSetRestTimeChange = (
    exerciseIndex: number,
    setIndex: number,
    time: number
  ) => {
    const newExercises = [...activeWorkout.exercises];
    newExercises[exerciseIndex].sets[setIndex].restTime = time;
    setActiveWorkout({
      ...activeWorkout,
      exercises: newExercises,
    });
  };

  // Handle toggling weight unit between kg and lbs
  const handleToggleWeightUnit = () => {
    setActiveWorkout({
      ...activeWorkout,
      weightUnit:
        activeWorkout.weightUnit === WeightUnit.Kg
          ? WeightUnit.Lbs
          : WeightUnit.Kg,
    });
  };

  // Handle changing default rest time
  const handleChangeDefaultRestTime = (time: number) => {
    setActiveWorkout({
      ...activeWorkout,
      defaultRestTime: time,
    });
  };

  // Finish current workout
  const finishWorkout = () => {
    confirmAlert(
      "Finish Workout",
      "Are you sure you want to finish this workout?",
      () => {
        // Show the bottom tab bar when finishing a workout
        setIsVisible(true);
        setActiveWorkout({
          name: "New Workout",
          exercises: [],
          startTime: null,
          isActive: false,
          weightUnit: WeightUnit.Kg,
          defaultRestTime: 120,
        });
      }
    );
  };

  // Cancel current workout
  const cancelWorkout = () => {
    destructiveAlert(
      "Cancel Workout",
      "Are you sure you want to cancel this workout? All progress will be lost.",
      () => {
        // Show the bottom tab bar when cancelling a workout
        setIsVisible(true);
        setActiveWorkout({
          name: "New Workout",
          exercises: [],
          startTime: null,
          isActive: false,
          weightUnit: WeightUnit.Kg,
          defaultRestTime: 120,
        });
      },
      undefined,
      "Cancel Workout",
      "Keep Working Out",
      "close-circle-outline"
    );
  };

  // Toggle exercise selection for supersets
  const toggleExerciseSelection = (id: string) => {
    if (selectedExercises.includes(id)) {
      setSelectedExercises(selectedExercises.filter((exId) => exId !== id));
    } else {
      setSelectedExercises([...selectedExercises, id]);
    }
  };

  // Handle template options
  const handleTemplateOptions = (template: WorkoutTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateOptionsModal(true);
  };

  // Handle template deletion
  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return;

    destructiveAlert(
      "Delete Template",
      `Are you sure you want to delete "${selectedTemplate.name}" template?`,
      () => {
        setTemplates(
          templates.filter((template) => template.id !== selectedTemplate.id)
        );
        setShowTemplateOptionsModal(false);
        setSelectedTemplate(null);
      },
      () => setShowTemplateOptionsModal(false)
    );
  };

  // Handle edit template (placeholder for future implementation)
  const handleEditTemplate = () => {
    setShowTemplateOptionsModal(false);
    showAlert(
      "Feature Coming Soon",
      "Editing templates will be available in a future update."
    );
  };

  // Handle template change for the form
  const handleTemplateChange = (field: string, value: string) => {
    setNewTemplate({
      ...newTemplate,
      [field]: value,
    });
  };

  // If we have an active workout, show the workout screen
  if (activeWorkout.isActive) {
    return (
      <ActiveWorkoutScreen
        workout={activeWorkout}
        onWorkoutNameChange={(name) =>
          setActiveWorkout({ ...activeWorkout, name })
        }
        onGoBack={() => {
          setIsVisible(true);
          setActiveWorkout({ ...activeWorkout, isActive: false });
        }}
        onFinishWorkout={finishWorkout}
        onCancelWorkout={cancelWorkout}
        onAddExercise={() => setShowExerciseModal(true)}
        onAddSet={handleAddSet}
        onUpdateSet={handleUpdateSet}
        onToggleSetComplete={handleToggleSetComplete}
        onDeleteSet={handleDeleteSet}
        onDeleteExercise={handleDeleteExercise}
        onSetTypeChange={handleSetTypeChange}
        onSetRestTimeChange={handleSetRestTimeChange}
        onToggleWeightUnit={handleToggleWeightUnit}
        onChangeDefaultRestTime={handleChangeDefaultRestTime}
        showExerciseModal={showExerciseModal}
        setShowExerciseModal={setShowExerciseModal}
        exercises={filteredExercises}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedExercises={selectedExercises}
        onToggleExerciseSelection={toggleExerciseSelection}
        onAddSelectedExercises={addExercisesToWorkout}
      />
    );
  }

  // Main template selection screen
  return (
    <WorkoutHomeScreen
      templates={templates}
      exampleTemplates={exampleTemplates}
      onStartEmptyWorkout={startEmptyWorkout}
      onStartTemplateWorkout={confirmStartWorkout}
      onCreateTemplate={() => setShowCreateTemplateModal(true)}
      onSettingsPress={() => router.push("/(main)/settings")}
      showCreateTemplateModal={showCreateTemplateModal}
      setShowCreateTemplateModal={setShowCreateTemplateModal}
      newTemplate={newTemplate}
      onTemplateChange={handleTemplateChange}
      selectedTemplateExercises={selectedTemplateExercises}
      onRemoveExerciseFromTemplate={handleRemoveExerciseFromTemplate}
      onShowExerciseSelectionForTemplate={() =>
        setShowExerciseSelectionForTemplate(true)
      }
      onCreateTemplateSubmit={handleCreateTemplate}
      isTemplateFormValid={
        newTemplate.name.trim() !== "" && selectedTemplateExercises.length > 0
      }
      showTemplateOptionsModal={showTemplateOptionsModal}
      setShowTemplateOptionsModal={setShowTemplateOptionsModal}
      selectedTemplate={selectedTemplate}
      onTemplateOptionsPress={handleTemplateOptions}
      onEditTemplate={handleEditTemplate}
      onDeleteTemplate={handleDeleteTemplate}
      showExerciseSelectionForTemplate={showExerciseSelectionForTemplate}
      setShowExerciseSelectionForTemplate={setShowExerciseSelectionForTemplate}
      exercises={filteredExercises}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSelectExerciseForTemplate={handleSelectExerciseForTemplate}
    />
  );
};

export default WorkoutScreen;

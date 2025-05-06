// Type definitions for history components

// Basic date string type for calendar
export type DateString = string;

// Set type for workout exercises
export interface ExerciseSet {
  weight: number;
  reps: number;
  volume: string;
  isPersonalBest: boolean;
}

// Exercise entry in a workout
export interface WorkoutExercise {
  name: string;
  sets: ExerciseSet[];
}

// Workout type
export interface Workout {
  id: string;
  name: string;
  date: string;
  duration: string;
  sets: number;
  exerciseCount: number;
  volume: number;
  prs: number;
  notes?: string;
  exercises: WorkoutExercise[];
}

// Food item type
export interface FoodItem {
  name: string;
  amount: string;
  calories: number;
  macros: string;
  icon?: string;
  color?: string;
}

// Meal type
export interface Meal {
  id: string;
  title: string;
  date: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  color: string;
  items: FoodItem[];
}

// Calendar day item
export interface CalendarDay {
  day: string | number;
  isCurrentMonth: boolean;
  isActive?: boolean;
  dateString?: string;
}

// Props for the Calendar component
export interface CalendarProps {
  activeDate: DateString;
  onSelectDate: (date: DateString) => void;
  activeDates: DateString[];
  isDark: boolean;
  isVisible: boolean;
  onClose: () => void;
}

// Props for workout history item component
export interface WorkoutHistoryItemProps {
  workout: Workout;
  onPress: (workout: Workout) => void;
  isDark: boolean;
  isLast: boolean;
}

// Props for diet history item component
export interface DietHistoryItemProps {
  meal: Meal;
  onPress: (meal: Meal) => void;
  isDark: boolean;
  isLast: boolean;
}

// Props for workout detail component
export interface WorkoutDetailProps {
  workout: Workout;
  onClose: () => void;
  isDark: boolean;
}

// Props for meal detail component
export interface MealDetailProps {
  meal: Meal;
  onClose: () => void;
  isDark: boolean;
}

// Props for history screen
export interface HistoryScreenProps {
  isDark: boolean;
}

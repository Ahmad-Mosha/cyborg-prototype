export interface Category {
  id: string;
  name: string;
}

export interface Workout {
  id: string;
  title: string;
  level: string;
  duration: string;
  calories: number;
  category: string;
  image: string;
  coach?: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  workouts: number;
  category: string;
}

// Component props interfaces
export interface WorkoutCardProps {
  workout: Workout;
}

export interface PlanCardProps {
  plan: WorkoutPlan;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment?: string;
  icon?: string;
  count?: number; // For showing exercise count in templates
}

export interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  type?: "regular" | "warm_up" | "drop_set" | "failure";
  restTime?: number; // Rest time in seconds
}

// Add enum for set types
export enum SetType {
  Regular = "regular",
  WarmUp = "warm_up",
  DropSet = "drop_set",
  Failure = "failure",
}

// Add enum for weight units
export enum WeightUnit {
  Kg = "kg",
  Lbs = "lbs",
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
  isSuperSet: boolean;
  superSetGroup?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
  lastUsed?: Date;
  description?: string;
}

export interface ActiveWorkout {
  name: string;
  exercises: WorkoutExercise[];
  startTime: Date | null;
  isActive: boolean;
  weightUnit: WeightUnit; // Added weight unit preference
  defaultRestTime: number; // Default rest time in seconds
}

export interface NewTemplate {
  name: string;
  description: string;
}

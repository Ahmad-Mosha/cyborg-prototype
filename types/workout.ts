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

// User data interface for onboarding information
export interface UserData {
  // Basic info
  age?: number;
  gender?: "male" | "female";
  weight?: number;
  height?: number;
  bmi?: number; // Calculated field
  bmr?: number; // Calculated field

  // Body composition
  muscleMass?: number;
  fatPercentage?: number;
  waterPercentage?: number;

  // Fitness goals and activity
  fitnessGoals?: string;
  activityLevel?: string;
  workoutLocation?: string;

  // Equipment and preferences
  availableEquipment?: string[];
  additionalNotes?: string;
  nationality?: string;
}

// Response from creating user data
export interface UserDataResponse {
  id: string;
  user: {
    id: string;
  };
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  bmi?: number;
  bmr?: number;
  muscleMass?: number;
  fatPercentage?: number;
  waterPercentage?: number;
  fitnessGoals?: string;
  activityLevel?: string;
  workoutLocation?: string;
  availableEquipment?: string[];
  additionalNotes?: string;
  nationality?: string;
  createdAt: string;
  updatedAt: string;
}

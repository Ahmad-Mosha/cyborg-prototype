export type PortionType = {
  name: string;
  multiplier: number;
};

export type NutritionFactsType = {
  servingSize: string;
  calories: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbs: number;
  dietaryFiber: number;
  sugars: number;
  protein: number;
  vitaminA: number;
  vitaminC: number;
  calcium: number;
  iron: number;
};

export type FoodType = {
  id: number;
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving: string;
  nutritionFacts: NutritionFactsType;
  portions: PortionType[];
};

// Types for food-related API responses and requests

export interface FoodAnalysisResult {
  id: number;
  title: string;
  nutrition: {
    nutrients: NutrientInfo[];
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
    calories: number;
    fat: string;
    protein: string;
    carbs: string;
  };
  servings: {
    number: number;
    size: number;
    unit: string;
  };
  category: string;
  image?: string;
}

export interface NutrientInfo {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds?: number;
}

export interface BarcodeProductResult {
  id: number;
  title: string;
  badges: string[];
  importantBadges: string[];
  breadcrumbs: string[];
  generatedText: string;
  imageType: string;
  ingredientCount?: number;
  ingredients?: string[];
  likes: number;
  nutrition: {
    nutrients: NutrientInfo[];
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
  };
  price?: number;
  servings: {
    number: number;
    size: number;
    unit: string;
  };
  spoonacularScore?: number;
  image?: string; // Adding image property
}

export interface AnalyzeUrlRequest {
  url: string;
}

export interface Meal {
  id?: string; // Backend meal ID for operations
  time: string;
  title: string;
  calories: number;
  items: string;
  complete: boolean;
  color: string;
}

export interface Nutrient {
  name: string;
  amount: number;
  unit?: string;
}

// Backend API types
export interface CalorieDistribution {
  mealName: string;
  percentage: number;
  calorieAmount?: number;
}

export interface CreateMealPlanRequest {
  name: string;
  description: string;
  targetCalories: number;
  startDate: string;
  endDate: string;
  calorieDistribution: CalorieDistribution[];
  createMealsAutomatically: boolean;
}

export interface MealNutrients {
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  cholesterol: number | null;
}

export interface NutritionGoals {
  protein: number;
  carbs: number;
  fat: number;
}

export interface BackendMeal {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  targetCalories: number;
  nutritionGoals: NutritionGoals;
  targetTime: string;
  eaten: boolean;
  eatenAt: string | null;
  nutrients: MealNutrients;
  mealFoods: any[]; // We'll define this later when implementing food management
}

export interface MealPlan {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetCalories: number;
  calorieDistribution: CalorieDistribution[];
  createMealsAutomatically: boolean;
  meals?: BackendMeal[];
}

export interface MealPlansResponse {
  data: MealPlan[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Types for meal management
export interface CreateMealRequest {
  name: string;
  targetTime: string; // Format: "HH:MM"
  targetCalories: number;
  nutritionGoals: NutritionGoals;
}

export interface UpdateMealRequest {
  name?: string;
  targetTime?: string;
  targetCalories?: number;
  nutritionGoals?: NutritionGoals;
}

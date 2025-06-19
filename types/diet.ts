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
  mealFoods?: MealFoodResponse[]; // Updated to use proper type
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
  nutritionGoals?: Partial<NutritionGoals>;
}

// USDA Food API Types
export interface USDAFood {
  name: string;
  description: string;
  usdaId: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  fat: number;
  cholesterol: number;
  sodium: number;
  potassium: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  protein: number;
  vitamin_a: number;
  vitamin_c: number;
  calcium: number;
  iron: number;
}

export interface USDAFoodSearchResponse {
  foods: USDAFood[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

export interface AddFoodToMealRequest {
  usdaId: string;
  quantity: number;
  unit: string;
}

export interface MealFood {
  id: string;
  mealId: string;
  usdaId: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  createdAt: string;
  updatedAt: string;
}

// New types for backend response
export interface MealFoodResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  servingSize: number;
  servingUnit: string;
  nutrients: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    cholesterol: number;
  };
  meal: BackendMeal;
  food: {
    id: string;
    name: string;
    description: string | null;
    calories: number;
    fat: number;
    cholesterol: number | null;
    sodium: number | null;
    potassium: number | null;
    carbohydrates: number;
    fiber: number | null;
    sugar: number | null;
    protein: number;
    vitamin_a: number | null;
    vitamin_c: number | null;
    calcium: number | null;
    iron: number | null;
    servingSize: number;
    servingUnit: string;
    usdaId: string | null;
    isCustom: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AddCustomFoodRequest {
  name: string;
  calories: number;
  quantity: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AddFoodSimpleRequest {
  foodId: string;
  quantity: number;
}

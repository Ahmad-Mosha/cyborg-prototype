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
}

export interface AnalyzeUrlRequest {
  url: string;
}

export interface Meal {
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

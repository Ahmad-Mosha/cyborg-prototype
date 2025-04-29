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

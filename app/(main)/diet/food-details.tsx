import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInUp,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PortionType,
  FoodType,
  NutritionFactsType,
  NutrientInfo,
} from "@/types/diet";
import BarcodeUtil from "@/utils/BarcodeUtil";
import { useTheme } from "@/contexts/ThemeContext";

export default function FoodDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { foodId, mealId, mealTitle } = useLocalSearchParams();
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [productExists, setProductExists] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showPortionSelector, setShowPortionSelector] = useState(false);

  // Mock food database for the example
  const foodDatabase: FoodType[] = [
    {
      id: 1,
      name: "Grilled Chicken Breast",
      brand: "Fresh Foods",
      calories: 165,
      protein: 31,
      carbs: 0,
      fats: 3.6,
      serving: "100g",
      nutritionFacts: {
        servingSize: "100g",
        calories: 165,
        totalFat: 3.6,
        saturatedFat: 1,
        transFat: 0,
        cholesterol: 85,
        sodium: 74,
        totalCarbs: 0,
        dietaryFiber: 0,
        sugars: 0,
        protein: 31,
        vitaminA: 1,
        vitaminC: 0,
        calcium: 0,
        iron: 6,
      },
      portions: [
        { name: "100g", multiplier: 1 },
        { name: "3oz (85g)", multiplier: 0.85 },
        { name: "1 breast (172g)", multiplier: 1.72 },
        { name: "Custom", multiplier: 1 },
      ],
    },
    {
      id: 2,
      name: "Greek Yogurt",
      brand: "Fage",
      calories: 130,
      protein: 17,
      carbs: 6,
      fats: 4.5,
      serving: "170g",
      nutritionFacts: {
        servingSize: "170g",
        calories: 130,
        totalFat: 4.5,
        saturatedFat: 3,
        transFat: 0,
        cholesterol: 15,
        sodium: 65,
        totalCarbs: 6,
        dietaryFiber: 0,
        sugars: 6,
        protein: 17,
        vitaminA: 0,
        vitaminC: 0,
        calcium: 20,
        iron: 0,
      },
      portions: [
        { name: "1 container (170g)", multiplier: 1 },
        { name: "1 cup (245g)", multiplier: 1.44 },
        { name: "1 tbsp (15g)", multiplier: 0.088 },
        { name: "Custom", multiplier: 1 },
      ],
    },
    {
      id: 3,
      name: "Sweet Potato",
      brand: "Organic",
      calories: 86,
      protein: 1.6,
      carbs: 20,
      fats: 0.1,
      serving: "100g",
      nutritionFacts: {
        servingSize: "100g",
        calories: 86,
        totalFat: 0.1,
        saturatedFat: 0,
        transFat: 0,
        cholesterol: 0,
        sodium: 55,
        totalCarbs: 20,
        dietaryFiber: 3,
        sugars: 4.2,
        protein: 1.6,
        vitaminA: 284,
        vitaminC: 2.4,
        calcium: 30,
        iron: 0.6,
      },
      portions: [
        { name: "100g", multiplier: 1 },
        { name: "1 medium (114g)", multiplier: 1.14 },
        { name: "1 cup cubes (133g)", multiplier: 1.33 },
        { name: "Custom", multiplier: 1 },
      ],
    },
    {
      id: 4,
      name: "Brown Rice",
      brand: "Whole Foods",
      calories: 112,
      protein: 2.6,
      carbs: 24,
      fats: 0.9,
      serving: "100g cooked",
      nutritionFacts: {
        servingSize: "100g cooked",
        calories: 112,
        totalFat: 0.9,
        saturatedFat: 0.2,
        transFat: 0,
        cholesterol: 0,
        sodium: 5,
        totalCarbs: 24,
        dietaryFiber: 1.8,
        sugars: 0.4,
        protein: 2.6,
        vitaminA: 0,
        vitaminC: 0,
        calcium: 10,
        iron: 0.5,
      },
      portions: [
        { name: "100g cooked", multiplier: 1 },
        { name: "1 cup cooked (195g)", multiplier: 1.95 },
        { name: "1/2 cup cooked (97g)", multiplier: 0.97 },
        { name: "Custom", multiplier: 1 },
      ],
    },
    {
      id: 5,
      name: "Salmon Fillet",
      brand: "Wild Caught",
      calories: 208,
      protein: 20,
      carbs: 0,
      fats: 13,
      serving: "100g",
      nutritionFacts: {
        servingSize: "100g",
        calories: 208,
        totalFat: 13,
        saturatedFat: 3.1,
        transFat: 0,
        cholesterol: 60,
        sodium: 59,
        totalCarbs: 0,
        dietaryFiber: 0,
        sugars: 0,
        protein: 20,
        vitaminA: 1,
        vitaminC: 3.9,
        calcium: 12,
        iron: 0.8,
      },
      portions: [
        { name: "100g", multiplier: 1 },
        { name: "1 fillet (170g)", multiplier: 1.7 },
        { name: "3oz (85g)", multiplier: 0.85 },
        { name: "Custom", multiplier: 1 },
      ],
    },
    {
      id: 6,
      name: "Avocado",
      brand: "Hass",
      calories: 160,
      protein: 2,
      carbs: 8,
      fats: 15,
      serving: "100g",
      nutritionFacts: {
        servingSize: "100g",
        calories: 160,
        totalFat: 15,
        saturatedFat: 2.1,
        transFat: 0,
        cholesterol: 0,
        sodium: 7,
        totalCarbs: 8,
        dietaryFiber: 6.7,
        sugars: 0.7,
        protein: 2,
        vitaminA: 7,
        vitaminC: 10,
        calcium: 12,
        iron: 0.6,
      },
      portions: [
        { name: "100g", multiplier: 1 },
        { name: "1/2 avocado (68g)", multiplier: 0.68 },
        { name: "1 whole (136g)", multiplier: 1.36 },
        { name: "Custom", multiplier: 1 },
      ],
    },
  ];

  // Check if this is a scanned barcode product
  const isScannedProduct = typeof foodId === "string" && foodId.length > 8;

  // Get the selected food from the mock database or AsyncStorage
  const [food, setFood] = useState<any>(null);

  // Load food data
  useEffect(() => {
    async function loadFoodData() {
      try {
        // For regular foods from the database
        if (!isScannedProduct) {
          const databaseFood =
            foodDatabase.find((f) => f.id.toString() === foodId) ||
            foodDatabase[0];
          setFood(databaseFood);
          setLoading(false);
          return;
        }

        // For scanned barcode products
        const storedData = await AsyncStorage.getItem("scannedBarcodeResult");

        if (storedData) {
          const scannedFood = JSON.parse(storedData);

          // Check if barcode exists
          const exists = await BarcodeUtil.productExists(foodId as string);
          setProductExists(exists);

          // Format the data to match our expected structure
          const formattedFood = {
            id: scannedFood.id,
            name: scannedFood.name,
            brand: scannedFood.brand,
            calories: scannedFood.calories,
            protein: scannedFood.protein,
            carbs: scannedFood.carbs,
            fats: scannedFood.fats,
            serving: scannedFood.serving || "70g",
            nutritionFacts: {
              servingSize: scannedFood.serving || "70g",
              calories: scannedFood.calories || 280,
              totalFat: scannedFood.fats || 8.9,
              saturatedFat: scannedFood.saturatedFat || 3.91,
              transFat: scannedFood.transFat || 3.91,
              cholesterol: scannedFood.cholesterol || 0,
              sodium: scannedFood.salt ? scannedFood.salt * 1000 : 0,
              totalCarbs: scannedFood.carbs || 38.13,
              dietaryFiber: scannedFood.fiber || 0.805,
              sugars: scannedFood.sugars || 0.805,
              protein: scannedFood.protein || 16.31,
              vitaminA: 0,
              vitaminC: 0,
              calcium: 0,
              iron: 0,
            },
            portions: [
              { name: scannedFood.serving || "70g", multiplier: 1 },
              { name: "100g", multiplier: 100 / 70 },
              { name: "Custom", multiplier: 1 },
            ],
            // Store the complete nutrition data for display
            completeNutrition: scannedFood.completeNutrition,
          };

          setFood(formattedFood);
        } else {
          // If no stored data, get from barcode API directly
          const barcodeResult = await BarcodeUtil.getProductByBarcode(
            foodId as string
          );
          const exists =
            barcodeResult.title !== `Egyptian Food Product (${foodId})`;
          setProductExists(exists);

          const getValueByName = (name: string): number => {
            const nutrient = barcodeResult.nutrition?.nutrients?.find(
              (n: NutrientInfo) => n.name === name
            );
            return nutrient ? nutrient.amount : 0;
          };

          // Convert to expected format
          const formattedFood = {
            id: barcodeResult.id,
            name: barcodeResult.title,
            brand: barcodeResult.breadcrumbs?.[0] || "N/A",
            calories: getValueByName("Calories"),
            protein: getValueByName("Protein"),
            carbs: getValueByName("Carbohydrates"),
            fats: getValueByName("Fat"),
            serving: `${barcodeResult.servings?.size || 70}${
              barcodeResult.servings?.unit || "g"
            }`,
            nutritionFacts: {
              servingSize: `${barcodeResult.servings?.size || 70}${
                barcodeResult.servings?.unit || "g"
              }`,
              calories: getValueByName("Calories"),
              totalFat: getValueByName("Fat"),
              saturatedFat: getValueByName("Saturated Fat"),
              transFat: getValueByName("Trans Fat"),
              cholesterol: getValueByName("Cholesterol"),
              sodium: getValueByName("Salt") * 1000,
              totalCarbs: getValueByName("Carbohydrates"),
              dietaryFiber: getValueByName("Fiber"),
              sugars: getValueByName("Sugars"),
              protein: getValueByName("Protein"),
              vitaminA: 0,
              vitaminC: 0,
              calcium: 0,
              iron: 0,
            },
            portions: [
              {
                name: `${barcodeResult.servings?.size || 70}${
                  barcodeResult.servings?.unit || "g"
                }`,
                multiplier: 1,
              },
              { name: "100g", multiplier: 100 / 70 },
              { name: "Custom", multiplier: 1 },
            ],
            completeNutrition: barcodeResult.nutrition,
          };

          setFood(formattedFood);
        }
      } catch (error) {
        console.error("Error loading food data:", error);
        setProductExists(false);
      } finally {
        setLoading(false);
      }
    }

    loadFoodData();
  }, [foodId, isScannedProduct]);

  // Calculate nutrition based on the selected quantity
  const [selectedPortion, setSelectedPortion] = useState<PortionType>({
    name: "70g",
    multiplier: 1,
  });

  useEffect(() => {
    if (food?.portions && food.portions.length > 0) {
      setSelectedPortion(food.portions[0]);
    }
  }, [food]);

  const calculateNutrition = (baseAmount: number): number => {
    return (
      Math.round(baseAmount * selectedPortion.multiplier * quantity * 10) / 10
    );
  };

  const handleAddToMeal = () => {
    // In a real app, we would dispatch an action to add the food to the meal
    // Here, we'll just simulate success and go back to meal details
    router.back();
  };

  const selectPortion = (portion: PortionType): void => {
    setSelectedPortion(portion);
    setShowPortionSelector(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark-900 justify-center items-center">
        <ActivityIndicator size="large" color="#BBFD00" />
        <Text className="text-white mt-4">Loading food details...</Text>
      </View>
    );
  }

  if (!productExists) {
    return (
      <View className="flex-1 bg-dark-900">
        <View
          style={{ paddingTop: insets.top + 30 }}
          className="px-6 pt-6 pb-4"
        >
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">
              Product Not Found
            </Text>
            <View className="w-10" />
          </View>
        </View>

        <View className="flex-1 justify-center items-center px-8">
          <View className="bg-dark-800 rounded-3xl border border-dark-700 p-6 items-center w-full">
            <View className="w-24 h-24 bg-dark-700 rounded-full items-center justify-center mb-6">
              <Ionicons name="alert-circle-outline" size={64} color="#BBFD00" />
            </View>
            <Text className="text-white text-xl font-bold mb-2">
              Product Not Found
            </Text>
            <Text className="text-gray-400 text-center mb-6">
              This product isn't in our database yet. We've added it to our
              queue for future updates.
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-primary rounded-2xl py-4 px-8 flex-row justify-center items-center w-full"
            >
              <Ionicons name="arrow-back" size={20} color="#000000" />
              <Text className="text-black font-bold ml-2">Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-900">
      {/* Header */}
      <View style={{ paddingTop: insets.top + 30 }} className="px-6 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">Food Details</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Food Info Card */}
        <Animated.View
          entering={FadeIn.delay(100).duration(400)}
          className="px-6 mb-6"
        >
          <View className="bg-dark-800 rounded-3xl border border-dark-700 p-5">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-dark-700 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="nutrition-outline" size={32} color="#BBFD00" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">
                  {food.name}
                </Text>
                <Text className="text-gray-400">{food.brand}</Text>
              </View>
            </View>

            {/* Nutrition Summary */}
            <View className="flex-row justify-around bg-dark-700 rounded-2xl p-4 mb-4">
              <View className="items-center">
                <Text className="text-gray-400 text-sm">Calories</Text>
                <Text className="text-white text-lg font-bold">
                  {calculateNutrition(food.calories)}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-400 text-sm">Protein</Text>
                <Text className="text-primary text-lg font-bold">
                  {calculateNutrition(food.protein)}g
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-400 text-sm">Carbs</Text>
                <Text className="text-[#FF9800] text-lg font-bold">
                  {calculateNutrition(food.carbs)}g
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-400 text-sm">Fats</Text>
                <Text className="text-[#2196F3] text-lg font-bold">
                  {calculateNutrition(food.fats)}g
                </Text>
              </View>
            </View>

            {/* Quantity Selector */}
            <View className="flex-row justify-between items-center bg-dark-700 rounded-2xl p-4">
              <Text className="text-white text-base">Quantity</Text>

              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
                >
                  <Ionicons name="remove" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold mx-4">
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  className="bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Portion Selector */}
            <TouchableOpacity
              onPress={() => setShowPortionSelector(true)}
              className="flex-row justify-between items-center bg-dark-700 rounded-2xl p-4 mt-3"
            >
              <Text className="text-white text-base">Serving Size</Text>
              <View className="flex-row items-center">
                <Text className="text-white mr-2">{selectedPortion.name}</Text>
                <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Nutrition Facts */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="px-6 mb-6"
        >
          <Text className="text-white text-lg font-bold mb-4">
            Nutrition Facts
          </Text>

          <View className="bg-dark-800 rounded-3xl border border-dark-700 p-5">
            <Text className="text-white text-base font-bold border-b border-dark-700 pb-2">
              Serving size {selectedPortion.name}
            </Text>

            <View className="py-2 border-b border-dark-700">
              <Text className="text-white text-lg font-bold">
                Calories {calculateNutrition(food.nutritionFacts.calories)}
              </Text>
            </View>

            {/* Fat section */}
            <View className="py-2 border-b border-dark-700">
              <View className="flex-row justify-between">
                <Text className="text-white font-bold">Total Fat</Text>
                <Text className="text-white font-bold">
                  {calculateNutrition(food.nutritionFacts.totalFat)}g
                </Text>
              </View>

              <View className="flex-row justify-between pl-5 mt-1">
                <Text className="text-gray-400">Saturated Fat</Text>
                <Text className="text-gray-400">
                  {calculateNutrition(food.nutritionFacts.saturatedFat)}g
                </Text>
              </View>

              <View className="flex-row justify-between pl-5 mt-1">
                <Text className="text-gray-400">Trans Fat</Text>
                <Text className="text-gray-400">
                  {calculateNutrition(food.nutritionFacts.transFat)}g
                </Text>
              </View>
            </View>

            {/* Other nutrients */}
            <View className="py-2 border-b border-dark-700">
              <View className="flex-row justify-between">
                <Text className="text-white font-bold">Cholesterol</Text>
                <Text className="text-white">
                  {calculateNutrition(food.nutritionFacts.cholesterol)}mg
                </Text>
              </View>
            </View>

            <View className="py-2 border-b border-dark-700">
              <View className="flex-row justify-between">
                <Text className="text-white font-bold">Sodium</Text>
                <Text className="text-white">
                  {calculateNutrition(food.nutritionFacts.sodium)}mg
                </Text>
              </View>
            </View>

            <View className="py-2 border-b border-dark-700">
              <View className="flex-row justify-between">
                <Text className="text-white font-bold">Total Carbohydrate</Text>
                <Text className="text-white font-bold">
                  {calculateNutrition(food.nutritionFacts.totalCarbs)}g
                </Text>
              </View>

              <View className="flex-row justify-between pl-5 mt-1">
                <Text className="text-gray-400">Dietary Fiber</Text>
                <Text className="text-gray-400">
                  {calculateNutrition(food.nutritionFacts.dietaryFiber)}g
                </Text>
              </View>

              <View className="flex-row justify-between pl-5 mt-1">
                <Text className="text-gray-400">Sugars</Text>
                <Text className="text-gray-400">
                  {calculateNutrition(food.nutritionFacts.sugars)}g
                </Text>
              </View>
            </View>

            <View className="py-2 border-b border-dark-700">
              <View className="flex-row justify-between">
                <Text className="text-white font-bold">Protein</Text>
                <Text className="text-white font-bold">
                  {calculateNutrition(food.nutritionFacts.protein)}g
                </Text>
              </View>
            </View>

            {/* Display vitamins and minerals only if they're available */}
            {(food.nutritionFacts.vitaminA > 0 ||
              food.nutritionFacts.vitaminC > 0 ||
              food.nutritionFacts.calcium > 0 ||
              food.nutritionFacts.iron > 0) && (
              <View className="pt-2">
                {food.nutritionFacts.vitaminA > 0 && (
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-gray-400">Vitamin A</Text>
                    <Text className="text-gray-400">
                      {calculateNutrition(food.nutritionFacts.vitaminA)}%
                    </Text>
                  </View>
                )}
                {food.nutritionFacts.vitaminC > 0 && (
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-gray-400">Vitamin C</Text>
                    <Text className="text-gray-400">
                      {calculateNutrition(food.nutritionFacts.vitaminC)}%
                    </Text>
                  </View>
                )}
                {food.nutritionFacts.calcium > 0 && (
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-gray-400">Calcium</Text>
                    <Text className="text-gray-400">
                      {calculateNutrition(food.nutritionFacts.calcium)}%
                    </Text>
                  </View>
                )}
                {food.nutritionFacts.iron > 0 && (
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-gray-400">Iron</Text>
                    <Text className="text-gray-400">
                      {calculateNutrition(food.nutritionFacts.iron)}%
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Source info for scanned products */}
            {isScannedProduct && (
              <View className="mt-4 pt-2 border-t border-dark-700">
                <Text className="text-gray-400 text-xs text-center">
                  Nutrition data based on standard Egyptian food values
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Add to meal button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-dark-900 to-transparent"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <TouchableOpacity
          onPress={handleAddToMeal}
          className="bg-primary rounded-2xl py-4 flex-row justify-center items-center"
        >
          <Ionicons name="add-circle-outline" size={20} color="#000000" />
          <Text className="text-black font-bold ml-2">Add to {mealTitle}</Text>
        </TouchableOpacity>
      </View>

      {/* Portion Selector Modal */}
      {showPortionSelector && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowPortionSelector(false)}
          className="absolute inset-0 bg-black bg-opacity-50 justify-end"
        >
          <Animated.View
            entering={SlideInUp.duration(300)}
            className="bg-dark-800 rounded-t-3xl"
          >
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-lg font-bold">
                  Select Portion Size
                </Text>
                <TouchableOpacity onPress={() => setShowPortionSelector(false)}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {food.portions.map((portion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectPortion(portion)}
                  className="py-4 border-b border-dark-700 flex-row justify-between"
                >
                  <Text className="text-white text-base">{portion.name}</Text>
                  {portion.name === selectedPortion.name && (
                    <Ionicons name="checkmark" size={24} color="#BBFD00" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ height: insets.bottom }} />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
}

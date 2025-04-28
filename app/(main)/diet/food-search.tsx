import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";

export default function FoodSearchScreen() {
  const insets = useSafeAreaInsets();
  const { mealId, mealTitle } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanningType, setScanningType] = useState<"barcode" | "meal" | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recognizedFoods, setRecognizedFoods] = useState<string[]>([]);

  // Mock food database
  const foodDatabase = [
    {
      id: 1,
      name: "Grilled Chicken Breast",
      brand: "Fresh Foods",
      calories: 165,
      protein: 31,
      carbs: 0,
      fats: 3.6,
      serving: "100g",
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
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      // Simulate API search delay
      setTimeout(() => {
        const results = foodDatabase.filter((food) =>
          food.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  const handleFoodSelect = (food: any) => {
    router.push({
      pathname: "/diet/food-details",
      params: {
        foodId: food.id.toString(),
        mealId,
        mealTitle,
      },
    });
  };

  const startScanning = (type: "barcode" | "meal") => {
    setScanning(true);
    setScanningType(type);

    // Simulate scanning process
    if (type === "meal") {
      setTimeout(() => {
        // Pretend the AI recognized these foods
        setRecognizedFoods([
          "Grilled Chicken Breast",
          "Brown Rice",
          "Mixed Vegetables",
        ]);
      }, 3000);
    } else {
      // For barcode, we would normally use a barcode scanner library
      // but for this demo, let's simulate finding a product
      setTimeout(() => {
        const mockBarcodeResult = foodDatabase[4]; // Salmon
        setSearchResults([mockBarcodeResult]);
        setScanning(false);
        setScanningType(null);
      }, 3000);
    }
  };

  const cancelScan = () => {
    setScanning(false);
    setScanningType(null);
    setRecognizedFoods([]);
  };

  const selectRecognizedFood = (foodName: string) => {
    const food =
      foodDatabase.find((f) => f.name === foodName) || foodDatabase[0];
    handleFoodSelect(food);
  };

  return (
    <View className="flex-1 bg-dark-900">
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="px-6 pt-6 pb-4">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">
            Add food to {mealTitle}
          </Text>
          <View className="w-10" />
        </View>

        {/* Search Bar */}
        {!scanning && (
          <Animated.View
            entering={FadeInDown.duration(400)}
            className="flex-row bg-dark-800 rounded-xl px-4 py-2 items-center mb-4"
          >
            <Ionicons name="search-outline" size={20} color="#777777" />
            <TextInput
              className="flex-1 text-white ml-2 text-base"
              placeholder="Search for a food..."
              placeholderTextColor="#777777"
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons name="close-circle" size={20} color="#777777" />
              </TouchableOpacity>
            )}
          </Animated.View>
        )}
      </View>

      {!scanning ? (
        <>
          {/* Quick scan options */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(400)}
            className="px-6 mb-6 flex-row justify-between"
          >
            <TouchableOpacity
              className="bg-dark-800 rounded-2xl p-4 flex-1 mr-4 items-center justify-center"
              onPress={() => startScanning("barcode")}
            >
              <View className="bg-dark-700 rounded-full p-3 mb-2">
                <Ionicons name="barcode-outline" size={24} color="#BBFD00" />
              </View>
              <Text className="text-white font-bold">Scan Barcode</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-dark-800 rounded-2xl p-4 flex-1 ml-4 items-center justify-center"
              onPress={() => startScanning("meal")}
            >
              <View className="bg-dark-700 rounded-full p-3 mb-2">
                <Ionicons name="camera-outline" size={24} color="#BBFD00" />
              </View>
              <Text className="text-white font-bold">Scan Meal</Text>
            </TouchableOpacity>
          </Animated.View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            {isSearching ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#BBFD00" />
                <Text className="text-gray-400 mt-4">Searching...</Text>
              </View>
            ) : searchQuery.length > 2 && searchResults.length === 0 ? (
              <View className="items-center justify-center py-10">
                <Ionicons name="search" size={48} color="#777777" />
                <Text className="text-white text-lg mt-4">No foods found</Text>
                <Text className="text-gray-400 text-center px-10 mt-2">
                  Try a different search term or add a custom food.
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              <Animated.View className="px-6">
                <Text className="text-white font-bold text-lg mb-4">
                  Search Results
                </Text>
                {searchResults.map((food, index) => (
                  <Animated.View
                    key={food.id}
                    entering={FadeInDown.delay(100 * index).duration(400)}
                  >
                    <TouchableOpacity
                      className="bg-dark-800 rounded-2xl p-4 mb-3 flex-row items-center"
                      onPress={() => handleFoodSelect(food)}
                    >
                      <View className="w-12 h-12 bg-dark-700 rounded-xl items-center justify-center mr-3">
                        <Ionicons
                          name="nutrition-outline"
                          size={22}
                          color="#BBFD00"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold">
                          {food.name}
                        </Text>
                        <Text className="text-gray-400">
                          {food.brand}, {food.serving}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-white">{food.calories} kcal</Text>
                        <View className="flex-row">
                          <Text className="text-primary mr-1">
                            P: {food.protein}g
                          </Text>
                          <Text className="text-[#FF9800] mr-1">
                            C: {food.carbs}g
                          </Text>
                          <Text className="text-[#2196F3]">
                            F: {food.fats}g
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </Animated.View>
            ) : searchQuery.length > 0 ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="small" color="#BBFD00" />
                <Text className="text-gray-400 mt-4">
                  Type more to search...
                </Text>
              </View>
            ) : (
              <View className="px-6">
                <Text className="text-white font-bold text-lg mb-4">
                  Recent Foods
                </Text>
                <Text className="text-gray-400 text-center py-10">
                  Your recently added foods will appear here
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <View className="flex-1 bg-dark-900">
          {/* Scanning overlay */}
          <Animated.View
            entering={FadeIn.duration(300)}
            className="flex-1 items-center justify-center px-6"
          >
            {scanningType === "barcode" ? (
              <>
                <View className="w-full aspect-square bg-dark-800 rounded-3xl items-center justify-center mb-6">
                  <Ionicons name="barcode-outline" size={100} color="#BBFD00" />
                  <ActivityIndicator
                    size="large"
                    color="#BBFD00"
                    className="absolute"
                  />
                </View>
                <Text className="text-white text-lg font-bold mb-2">
                  Scanning Barcode
                </Text>
                <Text className="text-gray-400 text-center mb-8">
                  Position the barcode within the frame
                </Text>
              </>
            ) : (
              <>
                {recognizedFoods.length === 0 ? (
                  <>
                    <View className="w-full aspect-square bg-dark-800 rounded-3xl items-center justify-center mb-6">
                      <Ionicons
                        name="camera-outline"
                        size={100}
                        color="#BBFD00"
                      />
                      <ActivityIndicator
                        size="large"
                        color="#BBFD00"
                        className="absolute"
                      />
                    </View>
                    <Text className="text-white text-lg font-bold mb-2">
                      Analyzing Meal
                    </Text>
                    <Text className="text-gray-400 text-center mb-8">
                      Our AI is identifying foods in your meal
                    </Text>
                  </>
                ) : (
                  <Animated.View
                    entering={SlideInRight.duration(400)}
                    className="w-full"
                  >
                    <Text className="text-white text-lg font-bold mb-4">
                      Foods Recognized
                    </Text>
                    {recognizedFoods.map((food, index) => (
                      <Animated.View
                        key={index}
                        entering={FadeInDown.delay(100 * index).duration(400)}
                      >
                        <TouchableOpacity
                          className="bg-dark-800 rounded-2xl p-4 mb-3 flex-row items-center"
                          onPress={() => selectRecognizedFood(food)}
                        >
                          <View className="w-12 h-12 bg-dark-700 rounded-xl items-center justify-center mr-3">
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={22}
                              color="#BBFD00"
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-white font-bold">{food}</Text>
                            <Text className="text-gray-400">AI identified</Text>
                          </View>
                          <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#777777"
                          />
                        </TouchableOpacity>
                      </Animated.View>
                    ))}
                  </Animated.View>
                )}
              </>
            )}

            <TouchableOpacity
              onPress={cancelScan}
              className="absolute bottom-10 left-6 right-6 bg-dark-800 rounded-2xl py-4 items-center"
            >
              <Text className="text-white font-bold">Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

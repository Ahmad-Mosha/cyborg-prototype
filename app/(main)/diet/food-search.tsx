import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import foodService from "@/api/foodService";
import nutritionService from "@/api/nutritionService";
import { useTabBar } from "@/contexts/TabBarContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Nutrient, NutrientInfo, USDAFood } from "@/types/diet";
import BarcodeUtil from "@/utils/BarcodeUtil";

export default function FoodSearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { mealId, mealTitle } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanningType, setScanningType] = useState<"barcode" | "meal" | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<USDAFood[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognizedFoods, setRecognizedFoods] = useState<string[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const { setIsVisible } = useTabBar();
  const [searchType, setSearchType] = useState<"usda" | "local">("usda");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Use TabBar context to control navbar visibility
  useEffect(() => {
    setIsVisible(!scanning);
    return () => {
      setIsVisible(true); // Ensure tab bar is visible when component unmounts
    };
  }, [scanning, setIsVisible]);
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      try {
        if (searchType === "usda") {
          const response = await nutritionService.searchUSDAFoods(query, 1, 20);
          setSearchResults(response.foods);
          setCurrentPage(response.currentPage);
          setTotalPages(response.totalPages);
          setHasMore(response.currentPage < response.totalPages);
        } else {
          // Local search (keeping the old logic for backward compatibility)
          const results = mockFoodDatabase.filter((food) =>
            food.name.toLowerCase().includes(query.toLowerCase())
          );
          setSearchResults(results.map(mapMockToUSDAFood));
        }
      } catch (error) {
        console.error("Error searching foods:", error);
        Alert.alert("Error", "Failed to search foods. Please try again.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const mapMockToUSDAFood = (mockFood: any): USDAFood => ({
    name: mockFood.name,
    description: mockFood.brand || "",
    usdaId: mockFood.id.toString(),
    servingSize: 100,
    servingUnit: "g",
    calories: mockFood.calories,
    fat: mockFood.fats || 0,
    cholesterol: 0,
    sodium: 0,
    potassium: 0,
    carbohydrates: mockFood.carbs || 0,
    fiber: 0,
    sugar: 0,
    protein: mockFood.protein || 0,
    vitamin_a: 0,
    vitamin_c: 0,
    calcium: 0,
    iron: 0,
  });

  const mockFoodDatabase = [
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
  const handleFoodSelect = (food: USDAFood) => {
    router.push({
      pathname: "/(main)/diet/add-food-to-meal",
      params: {
        foodId: food.usdaId,
        foodName: food.name,
        mealId,
        mealTitle,
        foodData: JSON.stringify(food),
      },
    });
  };

  const startScanning = async (type: "barcode" | "meal") => {
    if (!permission) {
      // Camera permissions are still loading
      return;
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet
      const { status } = await requestPermission();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }
    }

    setScanning(true);
    setScanningType(type);
    setRecognizedFoods([]); // Clear previous results
    setSearchResults([]); // Clear previous results

    // Keep simulation for meal scanning for now
    if (type === "meal") {
      // Simulation code remains the same
    }
  };

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanning(false);
    setScanningType(null);
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
    setIsSearching(true); // Show loading indicator
    setSearchResults([]); // Clear previous results

    try {
      // Use our BarcodeUtil instead of the backend service
      const result = await BarcodeUtil.getProductByBarcode(data);
      if (result && result.id) {
        // Find the nutrients from the detailed nutrition data
        const getValueByName = (name: string): number => {
          const nutrient = result.nutrition?.nutrients?.find(
            (n: NutrientInfo) => n.name === name
          );
          return nutrient ? nutrient.amount : 0;
        }; // Use the direct properties from BarcodeProductResult structure
        const formattedResult: USDAFood = {
          name: result.title || "Unknown Product",
          description: result.generatedText || "",
          usdaId: (result.id || parseInt(data)).toString(),
          servingSize: result.servings?.size || 100,
          servingUnit: result.servings?.unit || "g",
          calories: getValueByName("Calories"),
          fat: getValueByName("Fat"),
          cholesterol: getValueByName("Cholesterol"),
          sodium: getValueByName("Salt"),
          potassium: 0, // Not available in barcode result
          carbohydrates: getValueByName("Carbohydrates"),
          fiber: getValueByName("Fiber"),
          sugar: getValueByName("Sugars"),
          protein: getValueByName("Protein"),
          vitamin_a: 0, // Not available in barcode result
          vitamin_c: 0, // Not available in barcode result
          calcium: 0, // Not available in barcode result
          iron: 0, // Not available in barcode result
        };
        setSearchResults([formattedResult]);
        await AsyncStorage.setItem(
          "scannedBarcodeResult",
          JSON.stringify(formattedResult)
        );
      } else {
        // This shouldn't happen with our implementation since we always provide fallback data
        alert("Failed to process barcode data. Please try again.");
      }
    } catch (error) {
      console.error("Error processing barcode:", error);
      alert(
        "An error occurred while processing the barcode. Please try again."
      );
    } finally {
      setIsSearching(false); // Hide loading indicator
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) {
      console.log("Camera ref not available");
      return;
    }
    setIsAnalyzing(true); // Show analyzing indicator
    setScanning(false); // Hide camera view immediately
    setScanningType(null);
    setRecognizedFoods([]); // Clear previous results

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });
      if (photo && photo.uri) {
        console.log("Picture taken:", photo.uri);

        // Create FormData to send the image
        const formData = new FormData();
        // The backend expects a file, so we need name and type
        const uriParts = photo.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("file", {
          uri: photo.uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any); // Cast needed for React Native FormData

        // Call the backend service
        const analysisResult = await foodService.analyzeFoodByImage(formData);

        // Process the result based on the FoodAnalysisResult structure
        if (analysisResult && analysisResult.category) {
          // For category as string (per the type definition)
          setRecognizedFoods([analysisResult.category]);
        } else {
          alert("Could not recognize food items in the image.");
        }
      } else {
        console.log("Failed to take picture");
        alert("Could not capture image.");
      }
    } catch (error) {
      console.error("Error taking picture or analyzing food:", error);
      alert("An error occurred during meal analysis.");
    } finally {
      setIsAnalyzing(false); // Hide analyzing indicator
    }
  };

  const cancelScan = () => {
    setScanning(false);
    setScanningType(null);
    setRecognizedFoods([]);
  };
  const selectRecognizedFood = (foodName: string) => {
    const food = mockFoodDatabase.find((f: any) => f.name === foodName);
    if (food) {
      handleFoodSelect(mapMockToUSDAFood(food));
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View
        className={
          isDark
            ? "flex-1 bg-dark-900 justify-center items-center"
            : "flex-1 bg-light-100 justify-center items-center"
        }
      >
        <ActivityIndicator size="large" color="#BBFD00" />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        className={
          isDark
            ? "flex-1 bg-dark-900 justify-center items-center px-6"
            : "flex-1 bg-light-100 justify-center items-center px-6"
        }
      >
        <Text
          className={
            isDark
              ? "text-white text-center mb-4"
              : "text-dark-900 text-center mb-4"
          }
        >
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary px-6 py-3 rounded-lg"
        >
          <Text className="text-dark-900 font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      {/* Header - Conditionally render based on scanning state */}
      {!scanning && (
        <View
          style={{ paddingTop: insets.top + 30 }}
          className="px-6 pt-6 pb-4"
        >
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className={
                isDark
                  ? "bg-dark-800 w-10 h-10 rounded-full items-center justify-center"
                  : "bg-white w-10 h-10 rounded-full items-center justify-center shadow border border-light-300"
              }
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={isDark ? "#FFFFFF" : "#121212"}
              />
            </TouchableOpacity>
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold"
                  : "text-dark-900 text-lg font-bold"
              }
            >
              Add food to {mealTitle}
            </Text>
            <View className="w-10" />
          </View>

          {/* Search Bar */}
          <Animated.View
            entering={FadeInDown.duration(400)}
            className={
              isDark
                ? "flex-row bg-dark-800 rounded-xl px-4 py-2 items-center mb-4"
                : "flex-row bg-white rounded-xl px-4 py-2 items-center mb-4 shadow border border-light-300"
            }
          >
            <Ionicons
              name="search-outline"
              size={20}
              color={isDark ? "#777777" : "#999999"}
            />
            <TextInput
              className={
                isDark
                  ? "flex-1 text-white ml-2 text-base"
                  : "flex-1 text-dark-900 ml-2 text-base"
              }
              placeholder="Search for a food..."
              placeholderTextColor={isDark ? "#777777" : "#999999"}
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={isDark ? "#777777" : "#999999"}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      )}

      {!scanning ? (
        <>
          {/* Quick scan options */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(400)}
            className="px-6 mb-6 flex-row justify-between"
          >
            <TouchableOpacity
              className={
                isDark
                  ? "bg-dark-800 rounded-2xl p-4 flex-1 mr-4 items-center justify-center"
                  : "bg-white rounded-2xl p-4 flex-1 mr-4 items-center justify-center shadow border border-light-300"
              }
              onPress={() => startScanning("barcode")}
            >
              <View
                className={
                  isDark
                    ? "bg-dark-700 rounded-full p-3 mb-2"
                    : "bg-light-200 rounded-full p-3 mb-2"
                }
              >
                <Ionicons name="barcode-outline" size={24} color="#BBFD00" />
              </View>
              <Text
                className={
                  isDark ? "text-white font-bold" : "text-dark-900 font-bold"
                }
              >
                Scan Barcode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={
                isDark
                  ? "bg-dark-800 rounded-2xl p-4 flex-1 ml-4 items-center justify-center"
                  : "bg-white rounded-2xl p-4 flex-1 ml-4 items-center justify-center shadow border border-light-300"
              }
              onPress={() => startScanning("meal")}
            >
              <View
                className={
                  isDark
                    ? "bg-dark-700 rounded-full p-3 mb-2"
                    : "bg-light-200 rounded-full p-3 mb-2"
                }
              >
                <Ionicons name="camera-outline" size={24} color="#BBFD00" />
              </View>
              <Text
                className={
                  isDark ? "text-white font-bold" : "text-dark-900 font-bold"
                }
              >
                Scan Meal
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Search Results / Recent Foods */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            {isSearching ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#BBFD00" />
                <Text
                  className={
                    isDark ? "text-gray-400 mt-4" : "text-gray-500 mt-4"
                  }
                >
                  Searching Barcode...
                </Text>
              </View>
            ) : isAnalyzing ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#BBFD00" />
                <Text
                  className={
                    isDark ? "text-gray-400 mt-4" : "text-gray-500 mt-4"
                  }
                >
                  Analyzing Meal...
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              <>
                <View className="px-6 mb-4">
                  <Text
                    className={
                      isDark
                        ? "text-white text-lg font-bold mb-3"
                        : "text-dark-900 text-lg font-bold mb-3"
                    }
                  >
                    Search Results
                  </Text>
                  {searchResults.map((food, index) => (
                    <TouchableOpacity
                      key={index}
                      className={
                        isDark
                          ? "bg-dark-800 rounded-2xl border border-dark-700 p-4 mb-3"
                          : "bg-white rounded-2xl border border-light-300 p-4 mb-3 shadow"
                      }
                      onPress={() => handleFoodSelect(food)}
                    >
                      <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                          <Text
                            className={
                              isDark
                                ? "text-white font-bold"
                                : "text-dark-900 font-bold"
                            }
                          >
                            {food.name}
                          </Text>
                          <Text
                            className={
                              isDark ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            {food.description}, {food.servingSize}
                            {food.servingUnit}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text
                            className={isDark ? "text-white" : "text-dark-900"}
                          >
                            {food.calories} kcal
                          </Text>
                          <Text
                            className={
                              isDark
                                ? "text-gray-400 text-xs"
                                : "text-gray-500 text-xs"
                            }
                          >
                            P: {food.protein}g | C: {food.carbohydrates}g | F:{" "}
                            {food.fat}g
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : recognizedFoods.length > 0 ? (
              <>
                <View className="px-6 mb-4">
                  <Text
                    className={
                      isDark
                        ? "text-white text-lg font-bold mb-3"
                        : "text-dark-900 text-lg font-bold mb-3"
                    }
                  >
                    Recognized Foods
                  </Text>
                  {recognizedFoods.map((food, index) => (
                    <TouchableOpacity
                      key={index}
                      className={
                        isDark
                          ? "bg-dark-800 rounded-2xl border border-dark-700 p-4 mb-3"
                          : "bg-white rounded-2xl border border-light-300 p-4 mb-3 shadow"
                      }
                      onPress={() => selectRecognizedFood(food)}
                    >
                      <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                          <Text
                            className={
                              isDark
                                ? "text-white font-bold"
                                : "text-dark-900 font-bold"
                            }
                          >
                            {food}
                          </Text>
                          <Text
                            className={
                              isDark ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            Tap to add to meal
                          </Text>
                        </View>
                        <Ionicons
                          name="add-circle-outline"
                          size={24}
                          color="#BBFD00"
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <>
                <View className="px-6 mb-4">
                  <Text
                    className={
                      isDark
                        ? "text-white text-lg font-bold mb-3"
                        : "text-dark-900 text-lg font-bold mb-3"
                    }
                  >
                    Recent Foods
                  </Text>
                  {mockFoodDatabase
                    .slice(0, 3)
                    .map((food: any, index: number) => (
                      <TouchableOpacity
                        key={index}
                        className={
                          isDark
                            ? "bg-dark-800 rounded-2xl border border-dark-700 p-4 mb-3"
                            : "bg-white rounded-2xl border border-light-300 p-4 mb-3 shadow"
                        }
                        onPress={() => handleFoodSelect(food)}
                      >
                        <View className="flex-row justify-between items-center">
                          <View className="flex-1">
                            <Text
                              className={
                                isDark
                                  ? "text-white font-bold"
                                  : "text-dark-900 font-bold"
                              }
                            >
                              {food.name}
                            </Text>
                            <Text
                              className={
                                isDark ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              {food.brand || "Local Food"},{" "}
                              {food.serving || "100g"}
                            </Text>
                          </View>
                          <View className="items-end">
                            <Text
                              className={
                                isDark ? "text-white" : "text-dark-900"
                              }
                            >
                              {food.calories} kcal
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>

                <View className="px-6">
                  <Text
                    className={
                      isDark
                        ? "text-white text-lg font-bold mb-3"
                        : "text-dark-900 text-lg font-bold mb-3"
                    }
                  >
                    My Foods
                  </Text>
                  <Text
                    className={
                      isDark
                        ? "text-gray-400 text-center py-6"
                        : "text-gray-500 text-center py-6"
                    }
                  >
                    No saved foods yet
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <View className="flex-1 bg-dark-900">
          {/* Camera View */}
          <CameraView
            ref={cameraRef} // Assign the ref here
            style={{ flex: 1 }}
            facing={"back"}
            onBarcodeScanned={
              scanningType === "barcode" ? handleBarCodeScanned : undefined
            }
            barcodeScannerSettings={{
              barcodeTypes: [
                "qr",
                "ean13",
                "ean8",
                "upc_a",
                "upc_e",
                "code128",
              ],
            }}
          >
            <View className="flex-1 bg-transparent justify-between items-center">
              {/* Optional: Add overlay graphics for scanning area */}
              <View
                style={{ paddingTop: insets.top + 10 }}
                className="w-full flex-row justify-end px-4"
              >
                <TouchableOpacity
                  onPress={cancelScan}
                  className="bg-dark-800/70 w-10 h-10 rounded-full items-center justify-center"
                >
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Bottom controls */}
              <View className="w-full items-center pb-10 px-6">
                <Text className="text-white text-center mb-4 bg-dark-800/70 px-4 py-2 rounded-lg">
                  {scanningType === "barcode"
                    ? "Point camera at barcode"
                    : "Point camera at your meal"}
                </Text>
                {scanningType === "meal" && (
                  <TouchableOpacity
                    onPress={takePicture}
                    className="w-20 h-20 bg-white rounded-full items-center justify-center border-4 border-dark-700"
                  >
                    {/* Inner circle or icon */}
                    <View className="w-16 h-16 bg-white rounded-full" />
                  </TouchableOpacity>
                )}
                {/* Keep Cancel button accessible */}
                {/* <TouchableOpacity
                    onPress={cancelScan}
                    className="mt-6 bg-dark-800 rounded-2xl py-4 px-10 items-center"
                  >
                    <Text className="text-white font-bold">Cancel Scan</Text>
                  </TouchableOpacity> */}
              </View>
            </View>
          </CameraView>
        </View>
      )}
    </View>
  );
}

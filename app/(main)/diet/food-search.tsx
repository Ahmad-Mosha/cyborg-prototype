import React, { useState, useEffect, useRef } from "react";
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
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import foodService from "@/api/foodService";
import { useTabBar } from "@/contexts/TabBarContext";

export default function FoodSearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { mealId, mealTitle } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanningType, setScanningType] = useState<"barcode" | "meal" | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Add state for meal analysis loading
  const [recognizedFoods, setRecognizedFoods] = useState<string[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null); // Add ref for CameraView
  const { setIsVisible } = useTabBar();

  // Use TabBar context to control navbar visibility
  useEffect(() => {
    setIsVisible(!scanning);
    return () => {
      setIsVisible(true); // Ensure tab bar is visible when component unmounts
    };
  }, [scanning, setIsVisible]);

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
      // Simulate AI analysis after a delay (replace with actual capture logic)
      // setTimeout(() => {
      //   setRecognizedFoods([
      //     "Grilled Chicken Breast",
      //     "Brown Rice",
      //     "Mixed Vegetables",
      //   ]);
      //   // Keep scanning state true until user cancels or selects
      // }, 3000);
    }
    // Barcode scanning will be handled by the CameraView's onBarcodeScanned prop
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
      const result = await foodService.getProductByBarcode(data);
      if (result && result.id) {
        // Use the direct properties from BarcodeProductResult structure
        const formattedResult = {
          id: result.id || parseInt(data), // Use barcode data as fallback ID
          name: result.title || "Unknown Product",
          brand: result.breadcrumbs?.[0] || "N/A", // Use first breadcrumb as brand
          calories:
            result.nutrition?.nutrients?.find(
              (n) => n.name.toLowerCase() === "calories"
            )?.amount || 0,
          protein:
            result.nutrition?.nutrients?.find(
              (n) => n.name.toLowerCase() === "protein"
            )?.amount || 0,
          carbs:
            result.nutrition?.nutrients?.find(
              (n) => n.name.toLowerCase() === "carbohydrates"
            )?.amount || 0,
          fats:
            result.nutrition?.nutrients?.find(
              (n) => n.name.toLowerCase() === "fat"
            )?.amount || 0,
          serving: `${result.servings?.size || 0}${
            result.servings?.unit || "g"
          }`,
        };
        setSearchResults([formattedResult]);
      } else {
        alert("Barcode not found or product details unavailable.");
      }
    } catch (error) {
      console.error("Error fetching barcode product:", error);
      alert("Failed to fetch product details for the scanned barcode.");
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
    const food =
      foodDatabase.find((f) => f.name === foodName) || foodDatabase[0];
    handleFoodSelect(food);
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View className="flex-1 bg-dark-900 justify-center items-center">
        <ActivityIndicator size="large" color="#BBFD00" />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 bg-dark-900 justify-center items-center px-6">
        <Text className="text-white text-center mb-4">
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
    <View className="flex-1 bg-dark-900">
      {/* Header - Conditionally render based on scanning state */}
      {!scanning && (
        <View
          style={{ paddingTop: insets.top + 30 }}
          className="px-6 pt-6 pb-4"
        >
          {/* ... existing header content ... */}
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
        </View>
      )}

      {!scanning ? (
        <>
          {/* Quick scan options */}
          {/* ... existing scan buttons ... */}
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

          {/* Search Results / Recent Foods */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            {isSearching ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#BBFD00" />
                <Text className="text-gray-400 mt-4">Searching Barcode...</Text>
              </View>
            ) : isAnalyzing ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#BBFD00" />
                <Text className="text-gray-400 mt-4">Analyzing Meal...</Text>
              </View>
            ) : (
              <>
                {/* ... existing search results logic (uses searchResults state) ... */}
                {/* ... existing recent foods logic (uses recognizedFoods state) ... */}
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
                    onPress={takePicture} // Implement takePicture function
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

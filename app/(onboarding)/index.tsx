import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { ChevronLeft, ArrowRight, Check } from "lucide-react-native";
import { userDataService } from "../../api";
import { UserData } from "../../types/userData";

// Progress indicator component
const ProgressIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
              backgroundColor: "#BBFD00",
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>{`${Math.round(progress)}%`}</Text>
    </View>
  );
};

// Reusable number picker component with custom coloring for the selected item
const SmoothNumberPicker = ({
  minValue,
  maxValue,
  initialValue,
  step = 1,
  onChange,
  suffix = "",
  precision = 0,
}: {
  minValue: number;
  maxValue: number;
  initialValue: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
  precision?: number;
}) => {
  // Generate the array of values with proper formatting
  const data = useMemo(() => {
    const count = Math.floor((maxValue - minValue) / step) + 1;
    return Array.from({ length: count }, (_, index) => {
      const value = minValue + index * step;
      return {
        value,
        label: value.toFixed(precision) + suffix,
      };
    });
  }, [minValue, maxValue, step, precision, suffix]);

  // Calculate the initial index based on the provided initialValue
  const calculateInitialIndex = () => {
    // Ensure initialValue is within bounds
    const boundedValue = Math.max(minValue, Math.min(maxValue, initialValue));

    // Find the closest value in our data array
    const index = Math.round((boundedValue - minValue) / step);

    // Ensure the index is valid
    return Math.max(0, Math.min(index, data.length - 1));
  };

  const [selectedIndex, setSelectedIndex] = useState(calculateInitialIndex());

  // Update when initialValue changes
  useEffect(() => {
    setSelectedIndex(calculateInitialIndex());
  }, [initialValue, minValue, maxValue, step]);

  // Add some extra items for infinite scroll feel
  const extendedData = useMemo(() => [...data, ...data.slice(0, 5)], [data]);

  // Scrolling functionality
  const scrollViewRef = useRef<ScrollView>(null);
  const itemHeight = 60;

  // Scroll to the selected item when component mounts or index changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: selectedIndex * itemHeight,
        animated: false,
      });
    }
  }, [selectedIndex]);

  // Handle scroll end to snap to the nearest item
  const handleScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);

    // Calculate the actual index in our data array (handling overflow)
    const actualIndex = index % data.length;

    // Set the selected index and notify parent
    setSelectedIndex(actualIndex);
    onChange(data[actualIndex].value);

    // Snap to the exact position
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: index * itemHeight,
        animated: true,
      });
    }
  };

  // Add drag and touch handling for better performance
  const handleScrollBeginDrag = () => {
    // Cancel any animations when user starts dragging
    if (scrollViewRef.current) {
      scrollViewRef.current.flashScrollIndicators();
    }
  };

  return (
    <View style={styles.pickerContainer}>
      {/* Green selection lines */}
      <View
        style={[
          styles.selectionLine,
          { top: "50%", marginTop: -itemHeight / 2 },
        ]}
      />
      <View
        style={[
          styles.selectionLine,
          { top: "50%", marginTop: itemHeight / 2 },
        ]}
      />

      {/* Replace LinearGradient with simple fading Views for top and bottom */}
      <View style={styles.fadeTop} pointerEvents="none" />
      <View style={styles.fadeBottom} pointerEvents="none" />

      {/* The ScrollView picker */}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollBeginDrag={handleScrollBeginDrag}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingVertical: itemHeight * 2,
        }}
      >
        {extendedData.map((item, index) => (
          <View
            key={`${item.value}-${index}`}
            style={[styles.pickerItem, { height: itemHeight }]}
          >
            <Text
              style={[
                styles.pickerItemText,
                index % data.length === selectedIndex &&
                  styles.pickerItemTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Gender selection screen component
const GenderSelectionScreen = ({ onNext, onBack }: any) => {
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | null
  >(null);

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full max-w-md">
        <Text className="text-2xl font-bold text-white mb-2">
          Identify your gender
        </Text>
        <Text className="text-gray-400 mb-10">
          This is to customize your workout routine
        </Text>

        <TouchableOpacity
          className={`border-2 ${
            selectedGender === "male" ? "border-primary" : "border-gray-700"
          } rounded-2xl p-6 mb-4`}
          onPress={() => setSelectedGender("male")}
        >
          <View className="flex-row items-center">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                selectedGender === "male" ? "bg-primary" : "bg-transparent"
              }`}
            >
              <Ionicons
                name="male"
                size={24}
                color={selectedGender === "male" ? "#121212" : "#BBFD00"}
              />
            </View>
            <Text className="text-white text-lg ml-4">Man</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className={`border-2 ${
            selectedGender === "female" ? "border-primary" : "border-gray-700"
          } rounded-2xl p-6`}
          onPress={() => setSelectedGender("female")}
        >
          <View className="flex-row items-center">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                selectedGender === "female" ? "bg-primary" : "bg-transparent"
              }`}
            >
              <Ionicons
                name="female"
                size={24}
                color={selectedGender === "female" ? "#121212" : "#BBFD00"}
              />
            </View>
            <Text className="text-white text-lg ml-4">Woman</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`bg-primary rounded-full py-4 items-center mt-12 w-full max-w-md ${
          !selectedGender ? "opacity-50" : "opacity-100"
        }`}
        onPress={() => onNext(selectedGender)}
        disabled={!selectedGender}
      >
        <Text className="text-dark-900 font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Age selection screen component - improved animation
const AgeSelectionScreen = ({ onNext, onBack }: any) => {
  // Set a more realistic default age
  const [selectedAge, setSelectedAge] = useState(25);

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full max-w-md">
        <TouchableOpacity onPress={onBack} className="mb-6 p-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white mb-2">Specify age</Text>
        <Text className="text-gray-400 mb-10">
          This is to customize your workout routine
        </Text>

        <View className="items-center justify-center mb-8 self-center">
          <SmoothNumberPicker
            minValue={15}
            maxValue={85}
            initialValue={selectedAge}
            onChange={setSelectedAge}
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-primary rounded-full py-4 items-center mt-12 w-full max-w-md"
        onPress={() => onNext(selectedAge)}
        activeOpacity={0.8}
        style={{
          shadowColor: "#BBFD00",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text className="text-dark-900 font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Weight selection screen component with improved number picker
const WeightSelectionScreen = ({ onNext, onBack }: any) => {
  // More realistic starting weight
  const [selectedWeight, setSelectedWeight] = useState(70);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");

  const toggleUnit = () => {
    if (unit === "kg") {
      // Convert kg to lbs (multiply by 2.20462)
      const weightInLbs = Math.round(selectedWeight * 2.20462);
      setSelectedWeight(weightInLbs);
      setUnit("lbs");
    } else {
      // Convert lbs to kg (divide by 2.20462)
      const weightInKg = Math.round(selectedWeight / 2.20462);
      setSelectedWeight(weightInKg);
      setUnit("kg");
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full max-w-md">
        <TouchableOpacity onPress={onBack} className="mb-6 p-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white mb-2">
          Specify weight
        </Text>
        <Text className="text-gray-400 mb-4">
          This helps us calculate your workout intensity
        </Text>

        <View className="flex-row items-center justify-center mb-6">
          <TouchableOpacity
            onPress={toggleUnit}
            className="flex-row items-center bg-dark-800 px-4 py-2 rounded-full"
          >
            <Text className="text-white mr-2">Unit: </Text>
            <Text className="text-primary font-bold">{unit.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center justify-center mb-8 self-center">
          <SmoothNumberPicker
            minValue={unit === "kg" ? 30 : 66}
            maxValue={unit === "kg" ? 200 : 440}
            initialValue={selectedWeight}
            onChange={setSelectedWeight}
            suffix={` ${unit}`}
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-primary rounded-full py-4 items-center mt-12 w-full max-w-md"
        onPress={() => onNext(selectedWeight)}
        activeOpacity={0.8}
        style={{
          shadowColor: "#BBFD00",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text className="text-dark-900 font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Height selection screen component with improved number picker
const HeightSelectionScreen = ({ onNext, onBack }: any) => {
  // More realistic starting height
  const [selectedHeight, setSelectedHeight] = useState(170);
  const [unit, setUnit] = useState<"cm" | "ft">("cm");

  // For feet/inches display when in imperial units
  const [feet, inches] = useMemo(() => {
    if (unit === "ft") {
      const totalInches = Math.round(selectedHeight);
      const ft = Math.floor(totalInches / 12);
      const inch = totalInches % 12;
      return [ft, inch];
    }
    return [0, 0];
  }, [selectedHeight, unit]);

  const toggleUnit = () => {
    if (unit === "cm") {
      // Convert cm to inches (multiply by 0.393701)
      const totalInches = Math.round(selectedHeight * 0.393701);
      setSelectedHeight(totalInches);
      setUnit("ft");
    } else {
      // Convert inches to cm (divide by 0.393701)
      const totalCm = Math.round(selectedHeight / 0.393701);
      setSelectedHeight(totalCm);
      setUnit("cm");
    }
  };

  // Special handler for updating height in feet/inches
  const handleHeightChange = (value: number) => {
    setSelectedHeight(value);
  };

  // Special handlers for feet and inches in the imperial view
  const handleFeetChange = (ft: number) => {
    // Calculate the new total inches (current feet * 12 + current inches)
    const newTotalInches = ft * 12 + inches;
    setSelectedHeight(newTotalInches);
  };

  const handleInchesChange = (inch: number) => {
    // Calculate the new total inches (current feet * 12 + new inches)
    const newTotalInches = feet * 12 + inch;
    setSelectedHeight(newTotalInches);
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full max-w-md">
        <TouchableOpacity onPress={onBack} className="mb-6 p-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white mb-2">
          Specify height
        </Text>
        <Text className="text-gray-400 mb-4">
          This helps us tailor your workout experience
        </Text>

        <View className="flex-row items-center justify-center mb-6">
          <TouchableOpacity
            onPress={toggleUnit}
            className="flex-row items-center bg-dark-800 px-4 py-2 rounded-full"
          >
            <Text className="text-white mr-2">Unit: </Text>
            <Text className="text-primary font-bold">
              {unit === "cm" ? "CM" : "FT/IN"}
            </Text>
          </TouchableOpacity>
        </View>

        {unit === "cm" ? (
          <View className="items-center justify-center mb-8 self-center">
            <SmoothNumberPicker
              minValue={140}
              maxValue={220}
              initialValue={selectedHeight}
              onChange={handleHeightChange}
              suffix=" cm"
            />
          </View>
        ) : (
          <View className="flex-row items-center justify-center mb-8">
            <View className="mr-6">
              <Text className="text-gray-400 text-center mb-2">Feet</Text>
              <SmoothNumberPicker
                minValue={4}
                maxValue={7}
                initialValue={feet}
                onChange={handleFeetChange}
                suffix=" ft"
              />
            </View>
            <View>
              <Text className="text-gray-400 text-center mb-2">Inches</Text>
              <SmoothNumberPicker
                minValue={0}
                maxValue={11}
                initialValue={inches}
                onChange={handleInchesChange}
                suffix=" in"
              />
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        className="bg-primary rounded-full py-4 items-center mt-12 w-full max-w-md"
        onPress={() => onNext(selectedHeight)}
        activeOpacity={0.8}
        style={{
          shadowColor: "#BBFD00",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text className="text-dark-900 font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Goal selection screen component
const GoalSelectionScreen = ({ onNext, onBack }: any) => {
  const [goals, setGoals] = useState({
    muscleMass: true,
    weightLoss: false,
    immunityEnhancement: true,
    muscleTone: false,
    other: false,
  });

  const toggleGoal = (goal: keyof typeof goals) => {
    setGoals((prev) => ({
      ...prev,
      [goal]: !prev[goal],
    }));
  };

  // Function to get selected goals as a string
  const getSelectedGoalsString = () => {
    const selectedGoals = Object.keys(goals).filter(
      (goal) => goals[goal as keyof typeof goals]
    );

    // Map keys to more readable text
    const goalLabels: { [key: string]: string } = {
      muscleMass: "Gaining muscle mass",
      weightLoss: "Weight loss",
      immunityEnhancement: "Immunity enhancement",
      muscleTone: "Muscle tone",
      other: "Other fitness goals",
    };

    return selectedGoals.map((goal) => goalLabels[goal]).join(", ");
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full max-w-md">
        <TouchableOpacity onPress={onBack} className="mb-6 p-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white mb-2">
          Specify your goal
        </Text>
        <Text className="text-gray-400 mb-10">
          This is to customize your workout routine
        </Text>

        <View className="space-y-4">
          <GoalOption
            label="Gaining muscle mass"
            isSelected={goals.muscleMass}
            onToggle={() => toggleGoal("muscleMass")}
          />
          <GoalOption
            label="Weight loss"
            isSelected={goals.weightLoss}
            onToggle={() => toggleGoal("weightLoss")}
          />
          <GoalOption
            label="Immunity enhancement"
            isSelected={goals.immunityEnhancement}
            onToggle={() => toggleGoal("immunityEnhancement")}
          />
          <GoalOption
            label="Muscle tone"
            isSelected={goals.muscleTone}
            onToggle={() => toggleGoal("muscleTone")}
          />
          <GoalOption
            label="Other"
            isSelected={goals.other}
            onToggle={() => toggleGoal("other")}
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-primary rounded-full py-4 items-center mt-12 w-full max-w-md"
        onPress={() => onNext(getSelectedGoalsString())}
      >
        <Text className="text-dark-900 font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Goal option component
const GoalOption = ({ label, isSelected, onToggle }: any) => (
  <TouchableOpacity
    className={`flex-row items-center justify-between ${
      isSelected ? "bg-dark-700" : "bg-dark-800"
    } rounded-xl p-4 mb-3`}
    onPress={onToggle}
    activeOpacity={0.7}
    style={{
      borderWidth: 1,
      borderColor: isSelected ? "#BBFD00" : "transparent",
      shadowColor: isSelected ? "#BBFD00" : "transparent",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: isSelected ? 3 : 0,
    }}
  >
    <Text
      className={`${
        isSelected ? "text-primary font-semibold" : "text-white"
      } text-base`}
    >
      {label}
    </Text>
    <View
      className={`w-12 h-7 rounded-full ${
        isSelected ? "bg-primary" : "bg-gray-600"
      } p-1 justify-center`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 2,
      }}
    >
      <Animated.View
        className="w-5 h-5 rounded-full bg-white"
        style={{
          alignSelf: isSelected ? "flex-end" : "flex-start",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1,
          elevation: 1,
        }}
      />
    </View>
  </TouchableOpacity>
);

// Body Composition screen component
const BodyCompositionScreen = ({ onNext, onBack }: any) => {
  const [musclePercentage, setMusclePercentage] = useState(30);
  const [fatPercentage, setFatPercentage] = useState(20);
  const [waterPercentage, setWaterPercentage] = useState(50);

  // Simplified input field component with better input handling
  const CompositionField = ({
    value,
    onChange,
    label,
    icon,
    color,
    min = 5,
    max = 70,
  }: {
    value: number;
    onChange: (value: number) => void;
    label: string;
    icon: string;
    color: string;
    min?: number;
    max?: number;
  }) => {
    const [localValue, setLocalValue] = useState(value.toString());

    // Update local value when prop changes
    useEffect(() => {
      setLocalValue(value.toString());
    }, [value]);

    // Simplified input handling
    const handleTextChange = (text: string) => {
      // Allow empty input temporary during typing
      setLocalValue(text.replace(/[^0-9]/g, ""));
    };

    // Handle blur to validate and update parent state
    const handleBlur = () => {
      let numValue = parseInt(localValue, 10);

      // If empty or invalid, default to min
      if (isNaN(numValue)) {
        numValue = min;
      }

      // Clamp between min and max
      numValue = Math.min(Math.max(numValue, min), max);

      // Update local display value
      setLocalValue(numValue.toString());

      // Update parent state
      onChange(numValue);
    };

    return (
      <View className="w-full mb-6">
        <View className="flex-row items-center mb-2">
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: color,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Ionicons name={icon as any} size={20} color="#121212" />
          </View>

          <Text className="text-white text-base flex-1">{label}</Text>
        </View>

        <View
          className="flex-row items-center bg-dark-800 rounded-xl px-4 py-3"
          style={{ borderWidth: 1, borderColor: color }}
        >
          <TextInput
            className="flex-1 text-white text-lg"
            keyboardType="number-pad"
            value={localValue}
            onChangeText={handleTextChange}
            onBlur={handleBlur}
            maxLength={3}
            style={{
              color: "white",
              fontSize: 20,
              minHeight: 40,
              padding: 0,
            }}
            selectTextOnFocus
            placeholder="Enter value"
            placeholderTextColor="#555"
          />
          <Text style={{ color: color, fontWeight: "bold", fontSize: 20 }}>
            %
          </Text>
        </View>

        <View className="flex-row justify-between mt-1">
          <Text className="text-gray-500 text-xs">Min: {min}%</Text>
          <Text className="text-gray-500 text-xs">Max: {max}%</Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View entering={FadeInRight.duration(400)} className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md self-center">
          <TouchableOpacity onPress={onBack} className="mb-4 p-2">
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-white mb-2">
            Body Composition
          </Text>
          <Text className="text-gray-400 mb-6">
            Enter your estimated body composition for more accurate results
          </Text>

          <CompositionField
            value={musclePercentage}
            onChange={setMusclePercentage}
            label="Muscle Mass"
            icon="fitness-outline"
            color="#4CAF50"
            min={10}
            max={60}
          />

          <CompositionField
            value={fatPercentage}
            onChange={setFatPercentage}
            label="Body Fat"
            icon="body-outline"
            color="#FF9800"
            min={5}
            max={50}
          />

          <CompositionField
            value={waterPercentage}
            onChange={setWaterPercentage}
            label="Body Water"
            icon="water-outline"
            color="#2196F3"
            min={40}
            max={70}
          />

          <Text className="text-gray-400 text-sm italic mt-2 mb-4">
            Note: These are estimates. Don't worry if you're not sure - you can
            update these values later.
          </Text>

          <TouchableOpacity
            className="bg-primary rounded-full py-4 items-center mt-4 w-full"
            onPress={() =>
              onNext({
                muscleMass: musclePercentage,
                fatPercentage,
                waterPercentage,
              })
            }
            activeOpacity={0.8}
            style={{
              shadowColor: "#BBFD00",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
              marginBottom: 40, // Extra space at bottom for keyboard
            }}
          >
            <Text className="text-dark-900 font-bold text-lg">Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

// Workout Location screen with only backend-supported options
const WorkoutLocationScreen = ({ onNext, onBack }: any) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Keep only the locations supported by the backend
  const locations = [
    {
      id: "home",
      title: "Home",
      description: "Work out in the comfort of your home",
      icon: "home-outline",
    },
    {
      id: "gym",
      title: "Gym",
      description: "Access to full gym equipment",
      icon: "barbell-outline",
    },
  ];

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full max-w-md">
        <TouchableOpacity onPress={onBack} className="mb-6 p-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white mb-2">
          Workout Location
        </Text>
        <Text className="text-gray-400 mb-8">
          Where do you plan to work out most often?
        </Text>

        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            className={`border-2 ${
              selectedLocation === location.id
                ? "border-primary"
                : "border-gray-700"
            } rounded-2xl p-5 mb-4`}
            onPress={() => setSelectedLocation(location.id)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  selectedLocation === location.id
                    ? "bg-primary"
                    : "bg-dark-700"
                }`}
              >
                <Ionicons
                  name={location.icon as any}
                  size={24}
                  color={
                    selectedLocation === location.id ? "#121212" : "#BBFD00"
                  }
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-lg font-semibold">
                  {location.title}
                </Text>
                <Text className="text-gray-400">{location.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className={`bg-primary rounded-full py-4 items-center mt-6 w-full max-w-md ${
          !selectedLocation ? "opacity-50" : "opacity-100"
        }`}
        onPress={() => onNext(selectedLocation)}
        disabled={!selectedLocation}
        activeOpacity={0.8}
        style={{
          shadowColor: "#BBFD00",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text className="text-dark-900 font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Available Equipment screen
const EquipmentScreen = ({ onNext, onBack }: any) => {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const equipment = [
    { id: "dumbbells", name: "Dumbbells", icon: "barbell-outline" },
    {
      id: "resistanceBands",
      name: "Resistance Bands",
      icon: "ellipse-outline",
    },
    { id: "bench", name: "Workout Bench", icon: "bed-outline" },
    { id: "pullupBar", name: "Pull-up Bar", icon: "remove-outline" },
    { id: "kettlebells", name: "Kettlebells", icon: "bowling-ball-outline" },
    { id: "foamRoller", name: "Foam Roller", icon: "radio-outline" },
    { id: "yogaMat", name: "Yoga Mat", icon: "square-outline" },
    {
      id: "stabilityBall",
      name: "Stability Ball",
      icon: "ellipsis-horizontal-circle-outline",
    },
  ];

  const toggleEquipment = (id: string) => {
    if (selectedEquipment.includes(id)) {
      setSelectedEquipment(selectedEquipment.filter((item) => item !== id));
    } else {
      setSelectedEquipment([...selectedEquipment, id]);
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full max-w-md">
        <TouchableOpacity onPress={onBack} className="mb-6 p-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white mb-2">
          Available Equipment
        </Text>
        <Text className="text-gray-400 mb-8">
          Select any equipment you have access to
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {equipment.map((item) => (
            <TouchableOpacity
              key={item.id}
              className={`w-[48%] border-2 ${
                selectedEquipment.includes(item.id)
                  ? "border-primary"
                  : "border-gray-700"
              } rounded-2xl p-4 mb-4`}
              onPress={() => toggleEquipment(item.id)}
              activeOpacity={0.7}
            >
              <View className="items-center">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                    selectedEquipment.includes(item.id)
                      ? "bg-primary"
                      : "bg-dark-700"
                  }`}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={
                      selectedEquipment.includes(item.id)
                        ? "#121212"
                        : "#BBFD00"
                    }
                  />
                </View>
                <Text className="text-white text-center">{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        className="bg-primary rounded-full py-4 items-center mt-6 w-full max-w-md"
        onPress={() => onNext(selectedEquipment)}
        activeOpacity={0.8}
        style={{
          shadowColor: "#BBFD00",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text className="text-dark-900 font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Activity Level selection screen
const ActivityLevelScreen = ({ onNext, onBack }: any) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const activityLevels = [
    {
      id: "sedentary",
      title: "Sedentary",
      description: "Little or no exercise, desk job",
      icon: "body-outline",
    },
    {
      id: "light",
      title: "Lightly Active",
      description: "Light exercise 1-3 days/week",
      icon: "walk-outline",
    },
    {
      id: "moderate",
      title: "Moderately Active",
      description: "Moderate exercise 3-5 days/week",
      icon: "bicycle-outline",
    },
    {
      id: "active",
      title: "Active",
      description: "Hard exercise 6-7 days/week",
      icon: "fitness-outline",
    },
    {
      id: "veryActive",
      title: "Very Active",
      description: "Hard daily exercise & physical job",
      icon: "barbell-outline",
    },
  ];

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full max-w-md">
        <TouchableOpacity onPress={onBack} className="mb-6 p-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white mb-2">
          Activity Level
        </Text>
        <Text className="text-gray-400 mb-8">
          This helps us calculate your daily calorie needs
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 400 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {activityLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              className={`border-2 ${
                selectedLevel === level.id
                  ? "border-primary"
                  : "border-gray-700"
              } rounded-2xl p-5 mb-4`}
              onPress={() => setSelectedLevel(level.id)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    selectedLevel === level.id ? "bg-primary" : "bg-dark-700"
                  }`}
                >
                  <Ionicons
                    name={level.icon as any}
                    size={24}
                    color={selectedLevel === level.id ? "#121212" : "#BBFD00"}
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-white text-lg font-semibold">
                    {level.title}
                  </Text>
                  <Text className="text-gray-400">{level.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        className={`bg-primary rounded-full py-4 items-center mt-6 w-full max-w-md ${
          !selectedLevel ? "opacity-50" : "opacity-100"
        }`}
        onPress={() => onNext(selectedLevel)}
        disabled={!selectedLevel}
        activeOpacity={0.8}
        style={{
          shadowColor: "#BBFD00",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text className="text-dark-900 font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Nationality Screen with proper country picker
const NationalityScreen = ({ onNext, onBack }: any) => {
  const [country, setCountry] = useState<any>(null);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  // Import country picker component
  const CountryPicker = require("react-native-country-picker-modal").default;

  const onSelectCountry = (selectedCountry: any) => {
    setCountry(selectedCountry);
    setCountryPickerVisible(false);
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full max-w-md">
        <TouchableOpacity onPress={onBack} className="mb-6 p-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white mb-2">Nationality</Text>
        <Text className="text-gray-400 mb-8">
          This helps us customize your experience
        </Text>

        <TouchableOpacity
          onPress={() => setCountryPickerVisible(true)}
          className="bg-dark-800 rounded-xl py-4 px-4 flex-row items-center justify-between"
          style={{ borderWidth: 1, borderColor: country ? "#BBFD00" : "#333" }}
        >
          <View className="flex-row items-center">
            {country ? (
              <>
                <CountryPicker
                  countryCode={country.cca2}
                  withFlag
                  withCountryNameButton={false}
                  onSelect={onSelectCountry}
                  visible={false}
                />
                <Text className="text-white text-lg ml-3">{country.name}</Text>
              </>
            ) : (
              <Text className="text-gray-400">Select your country</Text>
            )}
          </View>
          <Ionicons name="chevron-down" size={20} color="#777" />
        </TouchableOpacity>

        <CountryPicker
          onSelect={onSelectCountry}
          visible={countryPickerVisible}
          onClose={() => setCountryPickerVisible(false)}
          withFilter
          withFlag
          withAlphaFilter
          withCallingCode={false}
          withEmoji
          containerButtonStyle={{ display: "none" }}
          theme={{
            backgroundColor: "#121212",
            onBackgroundTextColor: "#ffffff",
            fontSize: 16,
            primaryColor: "#BBFD00",
            primaryColorVariant: "#333",
          }}
        />
      </View>

      <TouchableOpacity
        className={`bg-primary rounded-full py-4 items-center mt-12 w-full max-w-md ${
          !country ? "opacity-50" : "opacity-100"
        }`}
        onPress={() => country && onNext(country.name)}
        disabled={!country}
        activeOpacity={0.8}
        style={{
          shadowColor: "#BBFD00",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text className="text-dark-900 font-bold text-lg">Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Additional Notes Screen
const AdditionalNotesScreen = ({ onNext, onBack, loading }: any) => {
  const [notes, setNotes] = useState("");

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full max-w-md">
        <TouchableOpacity onPress={onBack} className="mb-6 p-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white mb-2">
          Additional Information
        </Text>
        <Text className="text-gray-400 mb-6">
          Tell us if you have any injuries, medical conditions, or specific
          goals
        </Text>

        <View className="bg-dark-800 rounded-xl p-4 mb-4">
          <TextInput
            className="text-white min-h-[150px] text-base"
            placeholder="Ex: I have a lower back injury; I want to focus on upper body strength; I'm training for a marathon..."
            placeholderTextColor="#777"
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View className="flex-row items-center mb-8">
          <Ionicons
            name="information-circle"
            size={22}
            color="#BBFD00"
            style={{ marginRight: 8 }}
          />
          <Text className="text-gray-400 text-sm flex-1">
            This information helps us tailor your workout experience for safety
            and effectiveness.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="bg-primary rounded-full py-4 items-center mt-6 w-full max-w-md"
        onPress={() => onNext(notes)}
        activeOpacity={0.8}
        style={{
          shadowColor: "#BBFD00",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#121212" />
        ) : (
          <Text className="text-dark-900 font-bold text-lg">
            Complete Profile
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Styles for the number picker
const styles = StyleSheet.create({
  pickerContainer: {
    height: 300,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  fadeTop: {
    position: "absolute",
    width: "100%",
    height: 120,
    top: 0,
    backgroundColor: "#121212",
    zIndex: 5,
    opacity: 0.9,
    pointerEvents: "none",
  },
  fadeBottom: {
    position: "absolute",
    width: "100%",
    height: 120,
    bottom: 0,
    backgroundColor: "#121212",
    zIndex: 5,
    opacity: 0.9,
    pointerEvents: "none",
  },
  pickerItem: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 22,
    color: "#777777",
    textAlign: "center",
    fontWeight: "400",
  },
  pickerItemTextSelected: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#BBFD00",
  },
  selectionLine: {
    position: "absolute",
    width: 80,
    height: 2,
    backgroundColor: "#BBFD00",
    zIndex: 10,
    shadowColor: "#BBFD00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    flex: 1,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    shadowColor: "#BBFD00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  progressText: {
    color: "#BBFD00",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 14,
  },
  thumb: {
    position: "absolute",
    top: 10,
    left: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: "#121212",
    shadowColor: "#BBFD00",
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  thumbOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    shadowColor: "#BBFD00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
});

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  // Define total steps for progress calculation
  const totalSteps = 11;

  // Add state to collect user data across screens
  const [userData, setUserData] = useState<UserData>({});

  // Update userData when a step is completed
  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  // Handle completing the onboarding process
  const handleComplete = async () => {
    try {
      setLoading(true);

      // Save all collected user data to the backend
      await userDataService.saveUserData(userData);

      // Navigate to main app
      router.replace("/(main)/dashboard");
    } catch (error) {
      console.error("Error saving user data:", error);
      Alert.alert(
        "Error",
        "There was a problem saving your profile data. You can update it later in your profile settings.",
        [{ text: "OK", onPress: () => router.replace("/(main)/dashboard") }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Skip onboarding (optional for users)
  const handleSkip = () => {
    Alert.alert(
      "Skip Profile Setup",
      "You can complete your profile later in the app settings. Some features might be limited without a complete profile.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Skip", onPress: () => router.replace("/(main)/dashboard") },
      ]
    );
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <View
      className="flex-1 bg-dark-900 px-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Progress indicator at the top */}
      <View className="flex-row items-center justify-between w-full mb-4">
        <ProgressIndicator currentStep={step} totalSteps={totalSteps} />

        {/* Skip button */}
        <TouchableOpacity
          onPress={handleSkip}
          className="px-4 py-2"
          disabled={loading}
        >
          <Text className="text-gray-400">Skip</Text>
        </TouchableOpacity>
      </View>

      {step === 0 && (
        <GenderSelectionScreen
          onNext={(gender: "male" | "female") => {
            updateUserData({ gender });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 1 && (
        <AgeSelectionScreen
          onNext={(age: number) => {
            updateUserData({ age });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 2 && (
        <WeightSelectionScreen
          onNext={(weight: number) => {
            updateUserData({ weight });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <HeightSelectionScreen
          onNext={(height: number) => {
            updateUserData({ height });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 4 && (
        <GoalSelectionScreen
          onNext={(goals: string) => {
            updateUserData({ fitnessGoals: goals });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 5 && (
        <BodyCompositionScreen
          onNext={(composition: {
            muscleMass: number;
            fatPercentage: number;
            waterPercentage: number;
          }) => {
            updateUserData(composition);
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 6 && (
        <ActivityLevelScreen
          onNext={(level: string) => {
            updateUserData({ activityLevel: level });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 7 && (
        <WorkoutLocationScreen
          onNext={(location: string) => {
            updateUserData({ workoutLocation: location });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 8 && (
        <EquipmentScreen
          onNext={(equipment: string[]) => {
            updateUserData({ availableEquipment: equipment });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 9 && (
        <NationalityScreen
          onNext={(nationality: string) => {
            updateUserData({ nationality });
            handleNext();
          }}
          onBack={handleBack}
        />
      )}
      {step === 10 && (
        <AdditionalNotesScreen
          onNext={(notes: string) => {
            updateUserData({ additionalNotes: notes });
            handleComplete();
          }}
          onBack={handleBack}
          loading={loading}
        />
      )}
    </View>
  );
}

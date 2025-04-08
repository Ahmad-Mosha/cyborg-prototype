import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { router } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronRight, ArrowRight } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: "1",
    title: "Welcome to GorillaFit",
    subtitle: "Unleash Your Inner Beast!",
    description: "Become the best version of yourself with our fitness app!",
  },
  {
    id: "2",
    title: "Smart Workouts",
    subtitle: "Tailored Just For You",
    description:
      "Personalized training plans adapted to your goals, fitness level, and progress.",
  },
  {
    id: "3",
    title: "Track Your Progress",
    subtitle: "See Your Growth",
    description:
      "Monitor your improvements in real-time and stay motivated with visual tracking.",
  },
];

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const goToNextSlide = () => {
    const nextSlideIndex = currentIndex + 1;
    if (nextSlideIndex < slides.length) {
      flatListRef.current?.scrollToIndex({
        index: nextSlideIndex,
        animated: true,
      });
      setCurrentIndex(nextSlideIndex);
    } else {
      router.push("/(auth)");
    }
  };

  const skip = () => {
    router.push("/(auth)");
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View style={{ width }} className="items-center justify-center">
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.imageContainer}
        >
          <Image
            source={require("../assets/images/ChatGPT Image Apr 8 2025 from Cyborg Fit Design.png")}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <Animated.View
        entering={FadeIn.delay(300)}
        className="absolute top-0 right-0 z-10 py-2 px-6"
        style={{ marginTop: insets.top + 10 }}
      >
        <TouchableOpacity
          onPress={skip}
          className="py-2 px-4"
          activeOpacity={0.7}
        >
          <Text className="text-white font-semibold text-base">Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        initialNumToRender={1}
        className="flex-1"
      />

      <View
        style={[
          styles.bottomOverlay,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 30 },
        ]}
        className="px-6 pt-8"
      >
        <Animated.View
          entering={FadeInDown.delay(300).duration(800)}
          className="items-center mb-6 w-full"
        >
          <Text className="text-white text-3xl font-bold text-center mb-1">
            {slides[currentIndex].title}
          </Text>
          <Text className="text-white text-2xl font-bold text-center mb-4 text-primary">
            {slides[currentIndex].subtitle}
          </Text>
          <Text className="text-gray-300 text-center text-base px-4">
            {slides[currentIndex].description}
          </Text>
        </Animated.View>

        <View className="flex-row items-center justify-between w-full mt-4">
          <View className="flex-row items-center">
            {slides.map((_, index) => (
              <TouchableOpacity
                key={`dot-${index}`}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index,
                    animated: true,
                  });
                  setCurrentIndex(index);
                }}
              >
                <View
                  className={`h-1.5 rounded-full mx-1 ${
                    currentIndex === index
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-gray-600"
                  }`}
                  style={[
                    styles.dot,
                    currentIndex === index ? styles.activeDot : {},
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={goToNextSlide}
            className="bg-primary py-3 px-6 rounded-full flex-row items-center"
            activeOpacity={0.7}
            style={styles.button}
          >
            <Text className="text-dark-900 font-bold text-base mr-2">
              {currentIndex === slides.length - 1 ? "Get Started" : "Continue"}
            </Text>
            {currentIndex === slides.length - 1 ? (
              <ArrowRight size={18} color="#121212" />
            ) : (
              <ChevronRight size={18} color="#121212" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: width,
    paddingHorizontal: 0,
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: width,
    height: height * 0.45,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  bottomOverlay: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  dot: {},
  activeDot: {
    shadowColor: "#BBFD00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 4,
  },
  button: {
    shadowColor: "#BBFD00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});

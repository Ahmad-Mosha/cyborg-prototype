import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolate, FadeIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface OnboardingSlideProps {
  item: {
    id: string;
    title: string;
    description: string;
    image: any;
  };
  index: number;
  scrollX: Animated.SharedValue<number>;
}

const OnboardingSlide = ({ item, index, scrollX }: OnboardingSlideProps) => {
  // Each slide takes up the full width of the screen
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  
  // Animate the image based on scroll position
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );
    
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });
  
  // Animate the text based on scroll position
  const textAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [20, 0, 20],
      Extrapolate.CLAMP
    );
    
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ translateY }],
      opacity,
    };
  });
  
  return (
    <View className="w-full h-full items-center justify-center bg-dark-900">
      {/* Image Container */}
      <Animated.View 
        style={[imageAnimatedStyle]} 
        className="w-full h-1/2 items-center justify-center">
        <Image 
          source={item.image} 
          style={{ width: width * 0.8, height: height * 0.35 }}
          resizeMode="contain"
        />
      </Animated.View>
      
      {/* Text Container */}
      <Animated.View 
        entering={FadeIn.delay(200)}
        style={[textAnimatedStyle]} 
        className="w-full px-8 items-center justify-start absolute bottom-[25%]">
        <Text className="text-3xl font-bold text-white mb-5 text-center">
          {item.title}
        </Text>
        <Text className="text-base text-gray-300 text-center leading-6">
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );
};

export default OnboardingSlide;

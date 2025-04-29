import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { 
  withTiming, 
  useSharedValue, 
  withSpring, 
  withDelay,
  withSequence,
  withRepeat,
  Easing as ReanimatedEasing,
} from 'react-native-reanimated';

// Fade In animation with Reanimated
export const useFadeInAnimation = (delay = 0, duration = 500) => {
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: ReanimatedEasing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
  }, []);
  
  return { opacity };
};

// Slide In animation with Reanimated
export const useSlideInAnimation = (direction = 'up', delay = 0, distance = 50) => {
  const translateY = useSharedValue(direction === 'up' ? distance : -distance);
  const translateX = useSharedValue(direction === 'right' ? -distance : direction === 'left' ? distance : 0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    const animations = () => {
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: 500,
          easing: ReanimatedEasing.bezier(0.25, 0.1, 0.25, 1),
        })
      );
      
      if (direction === 'up' || direction === 'down') {
        translateY.value = withDelay(
          delay,
          withSpring(0, {
            damping: 15,
            stiffness: 120,
          })
        );
      } else {
        translateX.value = withDelay(
          delay,
          withSpring(0, {
            damping: 15,
            stiffness: 120,
          })
        );
      }
    };
    
    animations();
  }, []);
  
  return { translateY, translateX, opacity };
};

// Pulse animation with Reanimated
export const usePulseAnimation = (min = 0.95, max = 1.05, duration = 1000) => {
  const scale = useSharedValue(1);
  
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(max, { duration: duration / 2, easing: ReanimatedEasing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(min, { duration: duration / 2, easing: ReanimatedEasing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1,
      true
    );
  }, []);
  
  return { scale };
};

// Classic Animated API for basic animations
export const useBasicFadeIn = (duration = 500, delay = 0) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, []);
  
  return fadeAnim;
};

export const useBasicSlideIn = (direction = 'up', distance = 50, duration = 500, delay = 0) => {
  const initialY = direction === 'up' ? distance : direction === 'down' ? -distance : 0;
  const initialX = direction === 'right' ? -distance : direction === 'left' ? distance : 0;
  
  const translateY = useRef(new Animated.Value(initialY)).current;
  const translateX = useRef(new Animated.Value(initialX)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return { translateY, translateX, opacity };
};

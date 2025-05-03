import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Tabs, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  interpolateColor,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { TabBarProvider, useTabBar } from "../../contexts/TabBarContext";
import SidebarMenu from "../../components/ui/SidebarMenu";

// Custom tab bar component with modern design
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { isVisible } = useTabBar();
  const [prevFocusedIndex, setPrevFocusedIndex] = useState(0);

  // Shared animation values
  const animatedTabIndex = useSharedValue(0);
  const tabBarScale = useSharedValue(1);

  // Define the routes that should explicitly appear in the tab bar
  const allowedRoutes = ["dashboard", "workout", "cyborg", "diet", "community"];

  // Filter the routes provided by the state to only include the allowed ones
  const visibleRoutes = state.routes.filter((route: any) => {
    const routeName = route.name.split("/")[0]; // Get the base route name (folder)
    return allowedRoutes.includes(routeName);
  });

  // Adjust the focused index based on the filtered routes
  const focusedIndex = visibleRoutes.findIndex(
    (route: any) => route.key === state.routes[state.index]?.key
  );

  // Update the animated value when focused tab changes
  useEffect(() => {
    if (focusedIndex !== prevFocusedIndex) {
      animatedTabIndex.value = withTiming(focusedIndex, {
        duration: 150, // Faster transition
      });

      // Add a subtle "press" animation to the tab bar
      tabBarScale.value = withSequence(
        withTiming(0.98, { duration: 80 }), // Faster, less dramatic scale
        withSpring(1, { damping: 15, stiffness: 180 }) // More responsive spring
      );

      setPrevFocusedIndex(focusedIndex);
    }
  }, [focusedIndex]);

  // Animated style for the tab bar container
  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: tabBarScale.value }],
    };
  });

  // Pre-define animated styles for a fixed number of tabs
  // This ensures hooks are always called in the same order
  const tabAnimatedStyles = [0, 1, 2, 3, 4].map((index) => {
    return useAnimatedStyle(() => {
      const isAnimatedFocused = animatedTabIndex.value === index;

      return {
        backgroundColor: isAnimatedFocused
          ? withTiming("rgba(187, 253, 0, 0.2)", { duration: 150 }) // Faster color transition
          : withTiming("transparent", { duration: 100 }),
        transform: [
          {
            scale: isAnimatedFocused
              ? withSpring(1.05, { damping: 12, stiffness: 180, mass: 0.8 }) // More responsive spring with slight overshoot
              : withTiming(0.95, { duration: 100 }), // Faster scaling
          },
        ],
      };
    });
  });

  // Return early after all hooks have been called
  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(300)}
      className="absolute bottom-0 left-0 right-0 px-6 pb-6"
      style={{ paddingBottom: Math.max(insets.bottom + 6, 14) }}
    >
      <Animated.View
        style={[styles.floatingTabBar, tabBarAnimatedStyle]}
        className="flex-row items-center justify-around py-3 px-4 bg-dark-800/90 rounded-full"
      >
        {/* Map over the filtered routes instead of state.routes */}
        {visibleRoutes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          // Extract clean tab name without 'index' for display
          const rawLabel = options.tabBarLabel || options.title || route.name;
          // Remove '/index' from any label if present
          const label =
            typeof rawLabel === "string"
              ? rawLabel.replace("/index", "")
              : rawLabel;
          // Check focus based on the adjusted focusedIndex
          const isFocused = focusedIndex === index;

          // Function to determine which icon to display based on screen name
          const getIcon = (focused: boolean) => {
            const color = focused ? "#BBFD00" : "#777777";
            const size = 24; // Increased icon size

            // Extract the base route name (folder name)
            const routePath = route.name || "";
            const routeName = routePath.split("/")[0];

            // Icon selection based on route folder name
            switch (routeName) {
              case "dashboard":
                return (
                  <Ionicons name="stats-chart" size={size} color={color} />
                );
              case "workout":
                return (
                  <Ionicons name="barbell-outline" size={size} color={color} />
                );
              case "diet":
                return (
                  <Ionicons
                    name="nutrition-outline"
                    size={size}
                    color={color}
                  />
                );
              case "community":
                return (
                  <Ionicons name="people-outline" size={size} color={color} />
                );
              case "cyborg":
                return (
                  <Ionicons
                    name="hardware-chip-outline"
                    size={size}
                    color={color}
                  />
                );
              default:
                return (
                  <Ionicons
                    name="help-circle-outline"
                    size={size}
                    color={color}
                  />
                );
            }
          };

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // Navigate using the original route name which might include sub-paths
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              className="items-center justify-center"
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              activeOpacity={0.7}
              style={{ width: 56, height: 56 }}
            >
              <Animated.View
                style={[tabAnimatedStyles[index] || {}]}
                className={`rounded-full items-center justify-center ${
                  isFocused ? "p-3.5" : "p-3"
                }`}
              >
                {getIcon(isFocused)}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
    zIndex: 100,
  },
  floatingTabBar: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 99, // Lower z-index to ensure sidebar appears above
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});

export default function MainLayout() {
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setIsVisible } = useTabBar();
  const pathname = usePathname();

  // Hide tab bar on certain screens using pathname instead of router.addListener
  useEffect(() => {
    // Add screens that shouldn't show the tab bar
    const noTabBarScreens = [
      "/diet/food-details",
      "/diet/meal-details",
      "/diet/food-search",
    ];

    // Check if current path contains any of the no-tab-bar screens
    const shouldHideTabBar = noTabBarScreens.some((screen) =>
      pathname.includes(screen)
    );

    setIsVisible(!shouldHideTabBar);
  }, [pathname, setIsVisible]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#111827", // dark-800
            borderTopWidth: 0,
            elevation: 0,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarActiveTintColor: "#10b981", // primary
          tabBarInactiveTintColor: "gray",
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="dashboard/index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <Ionicons name="grid" size={24} color={color} />
            ),
            headerRight: () => (
              <Pressable
                onPress={() => setSidebarOpen(true)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  padding: 10,
                })}
              >
                <Ionicons name="menu" size={24} color="white" />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="workout/index"
          options={{
            title: "Workouts",
            tabBarIcon: ({ color }) => (
              <Ionicons name="barbell" size={24} color={color} />
            ),
            headerRight: () => (
              <Pressable
                onPress={() => setSidebarOpen(true)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  padding: 10,
                })}
              >
                <Ionicons name="menu" size={24} color="white" />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="diet/_layout"
          options={{
            title: "Diet",
            tabBarIcon: ({ color }) => (
              <Ionicons name="nutrition" size={24} color={color} />
            ),
            headerRight: () => (
              <Pressable
                onPress={() => setSidebarOpen(true)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  padding: 10,
                })}
              >
                <Ionicons name="menu" size={24} color="white" />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="tracking/weight-tracking"
          options={{
            title: "Tracking",
            tabBarIcon: ({ color }) => (
              <Ionicons name="analytics" size={24} color={color} />
            ),
            headerRight: () => (
              <Pressable
                onPress={() => setSidebarOpen(true)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  padding: 10,
                })}
              >
                <Ionicons name="menu" size={24} color="white" />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="cyborg/index"
          options={{
            title: "Cyborg",
            tabBarIcon: ({ color }) => (
              <Ionicons name="flash" size={24} color={color} />
            ),
            headerRight: () => (
              <Pressable
                onPress={() => setSidebarOpen(true)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  padding: 10,
                })}
              >
                <Ionicons name="menu" size={24} color="white" />
              </Pressable>
            ),
          }}
        />
      </Tabs>

      {/* Render SidebarMenu after Tabs to ensure it appears on top */}
      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}

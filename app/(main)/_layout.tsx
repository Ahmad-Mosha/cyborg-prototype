import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTabBar } from "@/contexts/TabBarContext";

// Custom tab bar component with modern design
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { isVisible } = useTabBar();

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(300)}
      className="absolute bottom-0 left-0 right-0"
      style={[
        styles.tabBarContainer,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      <View className="flex-row items-center px-3 py-2 bg-dark-900 border-t border-dark-800 rounded-t-2xl">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          // Extract clean tab name without 'index' for display
          const rawLabel = options.tabBarLabel || options.title || route.name;
          // Remove '/index' from any label if present
          const label =
            typeof rawLabel === "string"
              ? rawLabel.replace("/index", "")
              : rawLabel;
          const isFocused = state.index === index;

          // Function to determine which icon to display based on screen name
          const getIcon = (focused: boolean) => {
            const color = focused ? "#BBFD00" : "#777777";
            const size = 22;

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
                // Use a different fallback icon to make debugging easier
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
              navigation.navigate(route.name);
            }
          };

          // Extract the base route name for checking if this is the center tab
          const routePath = route.name || "";
          const routeName = routePath.split("/")[0];

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              className={`flex-1 items-center ${
                isFocused ? "bg-dark-700 rounded-xl py-2 mx-1" : "py-1 mx-1"
              }`}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              activeOpacity={0.7}
            >
              <View className="items-center">
                {getIcon(isFocused)}
                <Text
                  className={`text-xs mt-1 ${
                    isFocused ? "text-primary font-bold" : "text-gray-500"
                  }`}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
});

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none", // Hide default tab bar since we're using a custom one
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
        }}
      />
      <Tabs.Screen
        name="cyborg"
        options={{
          title: "Cyborg",
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: "Diet",
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Social",
        }}
      />
    </Tabs>
  );
}

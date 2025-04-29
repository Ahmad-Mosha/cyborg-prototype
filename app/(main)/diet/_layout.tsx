import React from "react";
import { Stack } from "expo-router";

export default function DietLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="food-details"
        options={{
          headerShown: false,
          // This prevents the screen from showing in tab navigation
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="meal-details"
        options={{
          headerShown: false,
          // This prevents the screen from showing in tab navigation
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="food-search"
        options={{
          headerShown: false,
          // This prevents the screen from showing in tab navigation
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

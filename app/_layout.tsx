import { Stack } from "expo-router";
import "../global.css";
import { TabBarProvider } from "@/contexts/TabBarContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import React from "react";
import { View } from "react-native";
import { AlertHost } from "../utils/AlertUtil";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// Import our i18n configuration
import "@/utils/i18n/i18nConfig";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <ThemeProvider>
          <TabBarProvider>
            <Stack
              screenOptions={({ route }) => ({
                headerShown: false,
                contentStyle: { backgroundColor: "#121212" },
                animation: "slide_from_right",
                // Make sure this function always returns the same reference for identical routes
                // This helps prevent navigation context issues when theme changes
                key: route?.name || "unknown",
              })}
            />
            <AlertHost />
          </TabBarProvider>
        </ThemeProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

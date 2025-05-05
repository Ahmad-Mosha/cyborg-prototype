import { Stack } from "expo-router";
import "../global.css";
import { TabBarProvider } from "@/contexts/TabBarContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import React from "react";
import { AlertHost } from "../utils/AlertUtil";

export default function RootLayout() {
  return (
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
  );
}

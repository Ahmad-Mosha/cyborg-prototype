import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { TabBarProvider } from "@/contexts/TabBarContext";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <TabBarProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#121212" },
            animation: "slide_from_right",
          }}
        />
      </TabBarProvider>
    </>
  );
}

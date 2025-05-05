import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  toggleTheme: () => void;
}

const Header = ({ toggleTheme }: HeaderProps) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`px-6 pb-4 ${isDark ? "bg-dark-900" : "bg-white"}`}
      style={{ paddingTop: insets.top + 30 }}
    >
      <View className="flex-row justify-between items-center">
        <Text
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Community
        </Text>
        <View className="flex-row">
          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${
              isDark ? "bg-dark-800" : "bg-gray-100"
            }`}
          >
            <Ionicons
              name="search"
              size={22}
              color={isDark ? "white" : "#333"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${
              isDark ? "bg-dark-800" : "bg-gray-100"
            }`}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={isDark ? "white" : "#333"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleTheme}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDark ? "bg-dark-800" : "bg-gray-100"
            }`}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={22}
              color={isDark ? "white" : "#333"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;

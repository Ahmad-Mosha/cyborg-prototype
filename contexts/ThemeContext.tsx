import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  isDark: boolean;
};

const THEME_STORAGE_KEY = "cyborgfit_theme";

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: true,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Get device preference as initial value
  const deviceTheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>(
    deviceTheme === "light" ? "light" : "dark"
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setThemeState(savedTheme);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to load theme from storage:", error);
        setIsInitialized(true);
      }
    };

    loadTheme();
  }, []);

  // Safe method to set theme that persists to storage
  const setTheme = useCallback(async (newTheme: ThemeType) => {
    try {
      // Save to storage first to ensure consistency
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      // Then update state
      setThemeState(newTheme);
    } catch (error) {
      console.error("Failed to save theme to storage:", error);
      // Still update state even if storage fails
      setThemeState(newTheme);
    }
  }, []);

  // Toggle theme safely
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const isDark = theme === "dark";

  // Don't render children until we've initialized the theme
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

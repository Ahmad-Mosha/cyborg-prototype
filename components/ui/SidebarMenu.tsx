import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "@/utils/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { authService } from "@/api/authService";
import { useTabBar } from "@/contexts/TabBarContext";
import { destructiveAlert } from "@/utils/AlertUtil";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { setIsVisible } = useTabBar();
  const slideAnim = useSharedValue(-300);
  const backdropOpacity = useSharedValue(0);

  // Navigate to a screen and close sidebar
  const navigateTo = (path: any) => {
    onClose();
    setTimeout(() => router.push(path), 300);
  };
  // Handle logout with confirmation
  const handleLogout = () => {
    destructiveAlert(
      "Logout",
      "Are you sure you want to logout?",
      async () => {
        try {
          // Call the logout service to clear stored auth data
          await authService.logout();
          onClose();
          // Short delay to allow menu closing animation
          setTimeout(() => {
            router.replace("/(auth)");
          }, 300);
        } catch (error) {
          console.error("Logout error:", error);
          // Even if logout fails, still navigate to auth screen
          onClose();
          setTimeout(() => {
            router.replace("/(auth)");
          }, 300);
        }
      },
      undefined,
      "Logout",
      "Cancel",
      "log-out-outline"
    );
  };

  useEffect(() => {
    if (isOpen) {
      // Open the menu with animation
      slideAnim.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      backdropOpacity.value = withTiming(0.5, { duration: 300 });
      setIsVisible(false); // Hide the bottom tab bar when sidebar is open
    } else {
      // Close the menu with animation
      slideAnim.value = withTiming(-300, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });
      backdropOpacity.value = withTiming(0, { duration: 250 });
      setIsVisible(true); // Show the bottom tab bar when sidebar is closed
    }
  }, [isOpen, setIsVisible]);

  const backdropAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
      display: backdropOpacity.value === 0 ? "none" : "flex",
    };
  });

  return (
    <View style={styles.container} pointerEvents={isOpen ? "auto" : "none"}>
      <Animated.View style={[styles.backdrop, backdropAnimStyle]}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top + 20,
            backgroundColor: isDark ? COLORS.darkCard : "#FFFFFF",
            borderRightColor: isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
            borderRightWidth: 1,
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
            onPress={onClose}
          >
            <Ionicons
              name="close"
              size={24}
              color={isDark ? COLORS.textLight : COLORS.textDark}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.title,
              { color: isDark ? COLORS.textLight : COLORS.textDark },
            ]}
          >
            Menu
          </Text>
        </View>

        <View style={styles.menuItems}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              { borderBottomColor: isDark ? COLORS.darkBorder : "#F3F4F6" },
            ]}
            onPress={() => navigateTo("/(main)/profile")}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={22} color={COLORS.primary} />
            </View>
            <Text
              style={[
                styles.menuItemText,
                { color: isDark ? COLORS.textLight : COLORS.textDark },
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              { borderBottomColor: isDark ? COLORS.darkBorder : "#F3F4F6" },
            ]}
            onPress={() => navigateTo("/(main)/exercises")}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="barbell-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text
              style={[
                styles.menuItemText,
                { color: isDark ? COLORS.textLight : COLORS.textDark },
              ]}
            >
              Exercises
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              { borderBottomColor: isDark ? COLORS.darkBorder : "#F3F4F6" },
            ]}
            onPress={() => navigateTo("/(main)/settings")}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="settings-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text
              style={[
                styles.menuItemText,
                { color: isDark ? COLORS.textLight : COLORS.textDark },
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999, // Increased z-index to be higher than any other UI element
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    zIndex: 9999, // Increased z-index
  },
  backdropPressable: {
    width: "100%",
    height: "100%",
  },
  menu: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    zIndex: 10000, // Increased z-index to be higher than backdrop
    ...SHADOWS.large, // Using the app's shadow style
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  closeButton: {
    marginRight: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(187,253,0,0.1)", // Primary color with opacity
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 20,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
});

export default SidebarMenu;

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SHADOWS } from "../../utils/constants/theme";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const navigateTo = (route: string) => {
    onClose();
    setTimeout(() => router.push(route), 300);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => router.replace("/(auth)"), 300);
    // Add actual logout logic here
  };

  if (!isOpen) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View
        style={[styles.backdrop, { opacity }]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <Pressable style={styles.backdropPressable} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top + 20,
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
          <Text style={styles.title}>Menu</Text>
        </View>

        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("/(main)/profile")}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("/(main)/exercises")}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="barbell-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.menuItemText}>Exercises</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("/(main)/settings")}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="settings-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.menuItemText}>Settings</Text>
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
    backgroundColor: COLORS.darkCard, // Changed to app's dark card color
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
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: COLORS.textLight,
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
    borderBottomColor: COLORS.darkBorder,
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
    color: COLORS.textLight,
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

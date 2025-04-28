import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInUp,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authService } from "../../api";
import { LoginDTO, RegisterDTO } from "../../types/auth/auth";

const { width } = Dimensions.get("window");
const buttonSpacing = width < 350 ? 15 : 25; // Adjust spacing based on screen width

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  // Animation values
  const switchAnim = useSharedValue(isLogin ? 0 : 1);
  const formOpacity = useSharedValue(1);
  const formScale = useSharedValue(1);
  const socialOpacity = useSharedValue(0);
  const socialTranslateY = useSharedValue(20);

  useEffect(() => {
    // Animate social buttons entrance
    socialOpacity.value = withDelay(
      800,
      withTiming(1, { duration: 600, easing: Easing.bezier(0.16, 1, 0.3, 1) })
    );

    socialTranslateY.value = withDelay(
      800,
      withTiming(0, { duration: 800, easing: Easing.bezier(0.16, 1, 0.3, 1) })
    );
  }, []);

  const toggleAuthMode = (mode: boolean) => {
    setError(null); // Clear any existing errors
    switchAnim.value = withTiming(mode ? 0 : 1, { duration: 300 });
    setIsLogin(mode);

    // Reset form fields when switching modes
    if (!mode) {
      setFirstName("");
      setLastName("");
    }
  };

  const validateForm = (): boolean => {
    setError(null);

    // Common validation for both login and registration
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false;
    }

    // Additional validation for registration
    if (!isLogin) {
      if (!firstName.trim()) {
        setError("First name is required");
        return false;
      }

      if (!lastName.trim()) {
        setError("Last name is required");
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return false;
    }

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Handle login
        const loginData: LoginDTO = {
          email,
          password,
        };

        await authService.login(loginData);

        // Navigate to main app or onboarding based on first login
        router.push("/(main)/dashboard");
      } else {
        // Handle registration
        const registerData: RegisterDTO = {
          firstName,
          lastName,
          email,
          password,
        };

        const response = await authService.register(registerData);

        // If it's the user's first login, navigate to onboarding
        if (response.user.isFirstLogin) {
          router.push("/(onboarding)");
        } else {
          router.push("/(main)/dashboard");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Handle different types of errors
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(isLogin ? "Login failed" : "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social sign-in
  const handleSocialAuth = (provider: string) => {
    // For future implementation of social authentication
    Alert.alert(
      "Coming Soon",
      `${provider} authentication will be available soon.`
    );
  };

  const leftTabStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: switchAnim.value === 0 ? "#121212" : "transparent",
    };
  });

  const rightTabStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: switchAnim.value === 1 ? "#121212" : "transparent",
    };
  });

  const leftTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(switchAnim.value === 0 ? 1 : 0.6, {
        duration: 300,
      }),
    };
  });

  const rightTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(switchAnim.value === 1 ? 1 : 0.6, {
        duration: 300,
      }),
    };
  });

  const formAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ scale: formScale.value }],
    };
  });

  const socialContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: socialOpacity.value,
      transform: [{ translateY: socialTranslateY.value }],
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark-900"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 20,
          justifyContent: "center", // Center content vertically
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 justify-center items-center">
          {/* Auth Toggle Section */}
          <Animated.View
            entering={FadeIn.delay(150)
              .duration(800)
              .easing(Easing.bezierFn(0.16, 1, 0.3, 1))}
            className="mb-8 w-full max-w-xs"
          >
            <View className="flex-row bg-dark-800 rounded-full p-1 w-full">
              <Animated.View
                style={[{ flex: 1, borderRadius: 9999 }, leftTabStyle]}
              >
                <TouchableOpacity
                  className="py-3 px-4 rounded-full w-full"
                  onPress={() => toggleAuthMode(true)}
                >
                  <Animated.Text
                    style={leftTextStyle}
                    className="text-center font-medium text-white"
                  >
                    Log in
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[{ flex: 1, borderRadius: 9999 }, rightTabStyle]}
              >
                <TouchableOpacity
                  className="py-3 px-4 rounded-full w-full"
                  onPress={() => toggleAuthMode(false)}
                >
                  <Animated.Text
                    style={rightTextStyle}
                    className="text-center font-medium text-white"
                  >
                    Sign up
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            entering={FadeInDown.delay(300)
              .duration(800)
              .easing(Easing.bezierFn(0.16, 1, 0.3, 1))}
            style={formAnimStyle}
            className="w-full max-w-xs"
          >
            {/* Error message display */}
            {error && (
              <Animated.View
                entering={FadeIn.duration(300)}
                className="mb-4 bg-red-900/50 p-3 rounded-lg"
              >
                <Text className="text-red-200 text-center">{error}</Text>
              </Animated.View>
            )}

            {/* First & Last Name Inputs (only visible in Sign Up mode) */}
            {!isLogin && (
              <Animated.View
                entering={FadeIn.duration(400).easing(
                  Easing.bezierFn(0.16, 1, 0.3, 1)
                )}
              >
                {/* First Name Input */}
                <Animated.View
                  entering={FadeInDown.delay(100)
                    .duration(500)
                    .easing(Easing.bezierFn(0.16, 1, 0.3, 1))}
                  className="flex-row items-center px-4 py-3 mb-4 rounded-full border border-dark-800 bg-dark-800"
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#777"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    className="flex-1 text-white"
                    placeholder="First Name"
                    placeholderTextColor="#777"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </Animated.View>

                {/* Last Name Input */}
                <Animated.View
                  entering={FadeInDown.delay(200)
                    .duration(500)
                    .easing(Easing.bezierFn(0.16, 1, 0.3, 1))}
                  className="flex-row items-center px-4 py-3 mb-4 rounded-full border border-dark-800 bg-dark-800"
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#777"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    className="flex-1 text-white"
                    placeholder="Last Name"
                    placeholderTextColor="#777"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </Animated.View>
              </Animated.View>
            )}

            {/* Email Input */}
            <Animated.View
              entering={FadeInDown.delay(isLogin ? 100 : 300)
                .duration(500)
                .easing(Easing.bezierFn(0.16, 1, 0.3, 1))}
              className="flex-row items-center px-4 py-3 mb-4 rounded-full border border-dark-800 bg-dark-800"
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color="#777"
                style={{ marginRight: 8 }}
              />
              <TextInput
                className="flex-1 text-white"
                placeholder="E-mail"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Animated.View>

            {/* Password Input */}
            <Animated.View
              entering={FadeInDown.delay(isLogin ? 200 : 400)
                .duration(500)
                .easing(Easing.bezierFn(0.16, 1, 0.3, 1))}
              className="flex-row items-center px-4 py-3 mb-2 rounded-full border border-dark-800 bg-dark-800"
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#777"
                style={{ marginRight: 8 }}
              />
              <TextInput
                className="flex-1 text-white"
                placeholder="Password"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </Animated.View>

            {/* Forgot Password Link */}
            <Animated.View
              entering={FadeInDown.delay(isLogin ? 300 : 500)
                .duration(500)
                .easing(Easing.bezierFn(0.16, 1, 0.3, 1))}
            >
              <TouchableOpacity className="self-center my-4">
                <Text className="text-gray-400 text-sm">Forgot password</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Create Account/Sign In Button */}
            <Animated.View
              entering={FadeInDown.delay(isLogin ? 400 : 600)
                .duration(500)
                .easing(Easing.bezierFn(0.16, 1, 0.3, 1))}
            >
              <TouchableOpacity
                className="bg-primary rounded-full py-4 items-center mb-4"
                onPress={handleAuth}
                style={styles.primaryButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#121212" size="small" />
                ) : (
                  <Text className="text-dark-900 font-bold text-base">
                    {isLogin ? "Log in" : "Create account"}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* OAuth Buttons */}
          <Animated.View
            style={socialContainerStyle}
            className="mt-6 w-full max-w-xs"
          >
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-[1px] bg-gray-800" />
              <Text className="mx-4 text-gray-500 text-sm">
                {isLogin ? "Or log in with" : "Or sign up with"}
              </Text>
              <View className="flex-1 h-[1px] bg-gray-800" />
            </View>

            <View style={styles.socialButtonsContainer}>
              <Animated.View entering={FadeInUp.delay(900)}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialAuth("Google")}
                >
                  <Ionicons name="logo-google" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(1000)}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={() => handleSocialAuth("Facebook")}
                >
                  <Ionicons name="logo-facebook" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(1100)}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton]}
                  onPress={() => handleSocialAuth("Apple")}
                >
                  <Ionicons name="logo-apple" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    shadowColor: "#BBFD00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  socialButton: {
    width: 56,
    height: 56,
    backgroundColor: "#222",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: buttonSpacing,
  },
  googleButton: {
    backgroundColor: "#DB4437",
    shadowColor: "#DB4437",
    shadowOpacity: 0.4,
  },
  facebookButton: {
    backgroundColor: "#4267B2",
    shadowColor: "#4267B2",
    shadowOpacity: 0.4,
  },
  appleButton: {
    backgroundColor: "#000",
    shadowColor: "#FFF",
    shadowOpacity: 0.15,
  },
});

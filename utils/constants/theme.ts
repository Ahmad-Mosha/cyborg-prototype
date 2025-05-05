export const COLORS = {
  primary: "#BBFD00", // Neon Green
  primaryDark: "#95CA00",
  primaryLight: "#D7FF4D",

  // Background colors
  darkBg: "#121212",
  darkCard: "#1E1E1E",
  darkBorder: "#333333",

  // Light mode backgrounds
  lightBg: "#FFFFFF",
  lightCard: "#FFFFFF",
  lightBorder: "#E5E7EB",

  // Text colors
  textLight: "#FFFFFF",
  textDim: "#A0A0A0",
  textDark: "#121212",
  textGray: "#6B7280",

  // Functional colors
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",
};

export const FONTS = {
  regular: "Inter-Regular",
  medium: "Inter-Medium",
  semiBold: "Inter-SemiBold",
  bold: "Inter-Bold",
};

export const SIZES = {
  // Global sizes
  base: 8,
  small: 12,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 40,

  // Font sizes
  heading1: 32,
  heading2: 24,
  heading3: 20,
  body: 16,
  caption: 14,

  // Radius
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 16,

  // Spacing
  spacing: 8,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 8,
  },

  // Light mode specific shadows
  lightSmall: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
};

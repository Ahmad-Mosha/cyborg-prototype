// Environment Configuration File
// This is a local development configuration file
// Each developer should have their own version of this file (not tracked in git)

// Set this to your computer's IP address when developing
export const DEV_IP_ADDRESS = "192.168.1.3";

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
  },
  // Add other endpoints as needed
};

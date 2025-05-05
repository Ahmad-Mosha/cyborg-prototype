import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";

// Import language resources
import en from "./locales/en.json";
import es from "./locales/es.json";
import ar from "./locales/ar.json";

// Define RTL languages
const RTL_LANGUAGES = ["ar", "he", "ur"];

// Language resources
const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  ar: {
    translation: ar,
  },
};

const LANGUAGE_DETECTOR = {
  type: "languageDetector",
  async: true,
  detect: async (callback: (lng: string) => void) => {
    // Try to get stored language from AsyncStorage
    try {
      const language = await AsyncStorage.getItem("user-language");
      if (language) {
        return callback(language);
      }
    } catch (error) {
      console.error("Error reading language from storage:", error);
    }

    // If no language is stored, use device language or default to English
    const deviceLanguage = getLocales()[0]?.languageCode;
    callback(
      deviceLanguage && resources[deviceLanguage] ? deviceLanguage : "en"
    );
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem("user-language", language);
    } catch (error) {
      console.error("Error saving language to storage:", error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    compatibilityJSON: "v3",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Initialize the RTL direction based on the current language
const setRTLDirection = (language: string) => {
  const isRTL = RTL_LANGUAGES.includes(language);

  // Only update if the RTL state is different from current
  if (I18nManager.isRTL !== isRTL) {
    // Note: In a real app, you might need to use react-native-restart to reload
    // the app after changing RTL direction for all components to re-render properly
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    console.log(`RTL direction set to: ${isRTL}`);
  }
};

// Set initial RTL direction
setRTLDirection(i18n.language);

export default i18n;

// Helper function to change language
export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem("user-language", language);

  // Update RTL direction when language changes
  setRTLDirection(language);
};

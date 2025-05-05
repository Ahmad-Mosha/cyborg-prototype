import React, { createContext, useContext, useState, useEffect } from "react";
import { I18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "@/utils/i18n/i18nConfig";

// Define RTL languages
const RTL_LANGUAGES = ["ar", "he", "ur"];

interface LanguageContextType {
  language: string;
  isRTL: boolean;
  setAppLanguage: (language: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  isRTL: false,
  setAppLanguage: async () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");
  const [isRTL, setIsRTL] = useState(RTL_LANGUAGES.includes(language));

  useEffect(() => {
    // Load saved language on startup
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("user-language");
        if (savedLanguage) {
          setLanguage(savedLanguage);
          setIsRTL(RTL_LANGUAGES.includes(savedLanguage));
        }
      } catch (error) {
        console.error("Error loading language settings:", error);
      }
    };

    loadSavedLanguage();
  }, []);

  const setAppLanguage = async (newLanguage: string) => {
    try {
      // Update language in i18next
      await changeLanguage(newLanguage);

      // Update local state
      setLanguage(newLanguage);

      // Update RTL direction
      const newIsRTL = RTL_LANGUAGES.includes(newLanguage);
      setIsRTL(newIsRTL);

      // Only update RTL settings if they're different from current state
      if (I18nManager.isRTL !== newIsRTL) {
        I18nManager.allowRTL(newIsRTL);
        I18nManager.forceRTL(newIsRTL);

        // Note: For a full RTL switch in a real app, you might need:
        // import RNRestart from 'react-native-restart';
        // RNRestart.Restart();
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, setAppLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;

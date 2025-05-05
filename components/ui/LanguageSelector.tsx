import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

type Language = {
  code: string;
  name: string;
  nativeName: string;
  isRTL?: boolean;
};

const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", isRTL: false },
  { code: "es", name: "Spanish", nativeName: "Español", isRTL: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", isRTL: true },
  // Add more languages as needed
];

export const LanguageSelector = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { language: currentLanguage, setAppLanguage } = useLanguage();

  const handleLanguageChange = (langCode: string) => {
    setAppLanguage(langCode);
  };

  return (
    <View className="p-4">
      <Text
        className={
          isDark
            ? "text-white text-base font-semibold mb-3"
            : "text-dark-900 text-base font-semibold mb-3"
        }
      >
        {t("settings.selectLanguage", "Select Language")}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <Pressable
            key={lang.code}
            className={`py-2 px-4 rounded-xl ${
              currentLanguage === lang.code
                ? "bg-primary border border-primary"
                : isDark
                ? "bg-dark-700 border border-dark-600"
                : "bg-light-200 border border-light-300"
            }`}
            onPress={() => handleLanguageChange(lang.code)}
          >
            <Text
              className={`${
                currentLanguage === lang.code
                  ? "text-dark-900 font-bold"
                  : isDark
                  ? "text-white"
                  : "text-dark-900"
              }`}
            >
              {lang.nativeName}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default LanguageSelector;

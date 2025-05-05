import { useTranslation as useI18nTranslation } from "react-i18next";
import { changeLanguage } from "./i18nConfig";

export const useTranslationHelper = () => {
  const { t, i18n } = useI18nTranslation();

  /**
   * Change the current language
   * @param language The language code to change to (e.g. 'en', 'es')
   * @returns Promise that resolves when language change is complete
   */
  const setLanguage = async (language: string) => {
    await changeLanguage(language);
  };

  /**
   * Get the current language code
   * @returns The current language code (e.g. 'en', 'es')
   */
  const getCurrentLanguage = () => i18n.language;

  /**
   * Check if a specific language is currently active
   * @param language Language code to check
   * @returns True if the specified language is active
   */
  const isLanguage = (language: string) => i18n.language === language;

  return {
    t,
    i18n,
    setLanguage,
    getCurrentLanguage,
    isLanguage,
  };
};

export default useTranslationHelper;

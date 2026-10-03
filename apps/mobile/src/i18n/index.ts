import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import am from "./am/translation.json";
import en from "./en/translation.json";

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    am: { translation: am },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

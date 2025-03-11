import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import en from './en.json';
import ae from './ae.json';

export const resources = {
  en: {
    translation: en,
  },
  ae: {
    translation: ae,
  },
};

i18n.use(initReactI18next).init({
  // compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: resources,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

/**
 * i18next internationalization configuration for multi-language support.
 * Initializes with browser language detection and loads translation files for 9 languages.
 * Note: Language preference is persisted in localStorage, and some languages (vi, cn, ar) are commented out.
 */
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
// utils
import { localStorageGetItem } from 'src/utils/storage-available';
//
import { defaultLang } from './config-lang';
//
import translationEn from './langs/en.json';
import translationRu from './langs/ru.json';
import translationFr from './langs/fr.json';
import translationPt from './langs/pt.json';
import translationNb from './langs/nb.json';
import translationFi from './langs/fi.json';
import translationSv from './langs/sv.json';
import translationEs from './langs/es.json';
import translationDe from './langs/de.json';
// import translationVi from './langs/vi.json';
// import translationCn from './langs/cn.json';
// import translationAr from './langs/ar.json';

// ----------------------------------------------------------------------

const lng = localStorageGetItem('i18nextLng', defaultLang.value);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translations: translationEn },
      ru: { translations: translationRu },
      fr: { translations: translationFr },
      pt: { translations: translationPt },
      nb: { translations: translationNb },
      fi: { translations: translationFi },
      sv: { translations: translationSv },
      es: { translations: translationEs },
      de: { translations: translationDe },
      // vi: { translations: translationVi },
      // cn: { translations: translationCn },
      // ar: { translations: translationAr },
    },
    lng,
    fallbackLng: lng,
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import en from "./locales/en/translation.json";
import ru from "./locales/ru/translation.json";

export const availableLanguages = {
	en: {name: "English"},
	ru: {name: "Русский"}
};

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
	fallbackLng: "en",
	resources: {
		en: {
			translation: en
		},
		ru: {
			translation: ru
		}
	}
});

export { i18n };

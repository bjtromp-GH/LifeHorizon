import React, { createContext, useContext, useState, useEffect } from 'react';
import { nl } from '../locales/nl';
import { en } from '../locales/en';

type Language = 'nl' | 'en';
type Translations = typeof nl;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    const saved = localStorage.getItem('app_language') as Language;
    if (saved === 'en' || saved === 'nl') setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const t = (keyPath: string, replacements?: Record<string, string | number>): string => {
    const dictionary = language === 'nl' ? nl : en;
    let text = getNestedValue(dictionary, keyPath);
    
    if (typeof text !== 'string') {
      console.warn(`Translation key not found: ${keyPath}`);
      return keyPath;
    }

    if (replacements) {
      Object.entries(replacements).forEach(([key, value]) => {
        text = text.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

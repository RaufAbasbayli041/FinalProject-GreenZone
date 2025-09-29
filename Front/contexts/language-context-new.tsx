"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { Language } from "@/lib/types"
import translations from "@/lib/translations"

export type TranslationMap = Record<string, string>;

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  translations: TranslationMap
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.RU)
  const [translationsMap, setTranslationsMap] = useState<TranslationMap>(translations[Language.RU])

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang)
    setTranslationsMap(translations[lang])
    localStorage.setItem('preferred-language', lang)
    
    // Обновляем атрибут lang в HTML
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }

  const t = (key: string): string => {
    return translationsMap[key] || key
  }

  useEffect(() => {
    // Загружаем сохраненный язык или используем язык браузера
    const savedLanguage = localStorage.getItem('preferred-language') as Language
    const browserLanguage = navigator.language.split('-')[0] as Language
    
    const initialLanguage = savedLanguage || 
      (Object.values(Language).includes(browserLanguage) ? browserLanguage : Language.RU)
    
    setLanguage(initialLanguage)
  }, [])

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      t, 
      translations: translationsMap 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}


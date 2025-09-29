"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context-new"
import { Language } from "@/lib/types"

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage()

  const languages = [
    { code: Language.RU, name: t('language.russian'), flag: '🇷🇺' },
    { code: Language.EN, name: t('language.english'), flag: '🇺🇸' },
    { code: Language.AZ, name: t('language.azerbaijani'), flag: '🇦🇿' },
  ]

  const currentLang = languages.find(lang => lang.code === currentLanguage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <span>{currentLang?.flag}</span>
          <span>{currentLang?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-2"
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher-new"
import { useLanguage } from "@/contexts/language-context-new"

export function AuthNavbar() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-2xl font-black text-green-600"
              onClick={() => router.push("/")}
            >
              {t("common.brandName")}
            </Button>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Button variant="ghost" onClick={() => router.push("/")}>
              {t("nav.home")}
            </Button>
            <Button variant="ghost" onClick={() => router.push("/catalog")}>
              {t("nav.catalog")}
            </Button>
            <Button variant="ghost" onClick={() => {
              router.push('/');
              setTimeout(() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}>
              {t("nav.contact")}
            </Button>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="outline" onClick={() => router.push("/login")}>
              {t("nav.login")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}



"use client"

import { RegisterForm } from "@/components/auth/register-form"
import { useLanguage } from "@/contexts/language-context"

export default function RegisterPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary mb-2">Green Zone</h1>
          <p className="text-muted-foreground">{t("auth.createAccount")}</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

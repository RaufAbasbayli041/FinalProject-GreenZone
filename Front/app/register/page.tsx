"use client"

import { RegisterForm } from "@/components/auth/register-form"
import { useLanguage } from "@/contexts/language-context-new"

export default function RegisterPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}

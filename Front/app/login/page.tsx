"use client"

import { LoginForm } from "@/components/auth/login-form"
import { useLanguage } from "@/contexts/language-context-new"

export default function LoginPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-16">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

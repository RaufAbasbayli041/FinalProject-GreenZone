"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { EmailService } from "@/lib/email-service"
import { useLanguage } from "@/contexts/language-context-new"

export function RegisterForm() {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    identityCard: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      setLoading(false)
      return
    }

    const result = await register(
      formData.userName, 
      formData.email, 
      formData.password, 
      formData.phoneNumber,
      formData.firstName,
      formData.lastName,
      formData.identityCard
    )

    if (result.success) {
      EmailService.sendRegistrationConfirmation(formData.email, formData.userName)
      router.push("/profile")
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-gray-900">{t("auth.register")}</CardTitle>
        <CardDescription className="text-gray-600">{t("auth.createAccount")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userName" className="text-sm font-medium text-gray-700">{t("auth.userName")}</Label>
            <Input
              id="userName"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              required
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t("auth.email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">{t("auth.phoneNumber")}</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">{t("auth.firstName")}</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">{t("auth.lastName")}</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <Label htmlFor="identityCard" className="text-sm font-medium text-gray-700">{t("auth.identityCard")}</Label>
            <Input
              id="identityCard"
              type="text"
              value={formData.identityCard}
              onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
              required
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">{t("auth.password")}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">{t("auth.confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={6}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
            {loading ? `${t("auth.register")}...` : t("auth.register")}
          </Button>

          <div className="text-center text-sm text-gray-600">
            {t("auth.haveAccount")}{" "}
            <Button variant="link" className="p-0 h-auto text-green-600 hover:text-green-700" onClick={() => router.push("/login")}>
              {t("auth.login")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

export function LoginForm() {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(formData.email, formData.password)

    if (result.success) {
      const users = JSON.parse(localStorage.getItem("gazonpro_users") || "[]")
      const user = users.find((u: any) => u.email === formData.email)

      if (user?.isAdmin) {
        router.push("/admin")
      } else {
        router.push("/profile")
      }
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("auth.login")}</CardTitle>
        <CardDescription>{t("auth.loginSuccess")}</CardDescription>
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <p>
            <strong>{t("auth.testAdmin")}:</strong>
          </p>
          <p>Email: admin@gazonpro.ru</p>
          <p>
            {t("auth.password")}: {t("auth.anyPassword")}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? `${t("auth.login")}...` : t("auth.login")}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/register")}>
              {t("auth.register")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

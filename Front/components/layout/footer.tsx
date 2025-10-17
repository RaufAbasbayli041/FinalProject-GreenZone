"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context-new"
import { useAuth } from "@/contexts/auth-context"
import { getAllCategories } from "@/services/category-api"
import type { Category } from "@/lib/types"

export function Footer() {
  const router = useRouter()
  const { t } = useLanguage()
  const { isAuthenticated, isAdmin } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])

  // Если пользователь админ, не показываем обычный футер
  if (isAuthenticated && isAdmin) {
    return null
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif font-medium text-[#10B981] mb-4">GreenZone</h3>
            <p className="text-[#6B7280] mb-4 leading-relaxed">Professional sale and installation of artificial grass for homes, stadiums and commercial facilities.</p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#10B981]/20 rounded-full flex items-center justify-center hover:bg-[#10B981] hover:text-white transition-colors cursor-pointer">
                <span className="text-[#10B981] hover:text-white text-sm">📱</span>
              </div>
              <div className="w-8 h-8 bg-[#10B981]/20 rounded-full flex items-center justify-center hover:bg-[#10B981] hover:text-white transition-colors cursor-pointer">
                <span className="text-[#10B981] hover:text-white text-sm">💬</span>
              </div>
              <div className="w-8 h-8 bg-[#10B981]/20 rounded-full flex items-center justify-center hover:bg-[#10B981] hover:text-white transition-colors cursor-pointer">
                <span className="text-[#10B981] hover:text-white text-sm">🔗</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#1F2937] mb-4">Catalog</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Button 
                    variant="link" 
                    className="text-[#6B7280] hover:text-[#10B981] p-0 h-auto text-left justify-start"
                    onClick={() => router.push(`/catalog?category=${encodeURIComponent(category.name)}`)}
                  >
                    {category.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#1F2937] mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Button variant="link" className="text-[#6B7280] hover:text-[#10B981] p-0 h-auto text-left justify-start">Consultation</Button></li>
              <li><Button variant="link" className="text-[#6B7280] hover:text-[#10B981] p-0 h-auto text-left justify-start">Installation</Button></li>
              <li><Button variant="link" className="text-[#6B7280] hover:text-[#10B981] p-0 h-auto text-left justify-start">Delivery</Button></li>
              <li><Button variant="link" className="text-[#6B7280] hover:text-[#10B981] p-0 h-auto text-left justify-start">Гарантийное обслуживание</Button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#1F2937] mb-4">Contact</h4>
            <ul className="space-y-2 text-[#6B7280]">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+7 (495) 123-45-67</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span>info@gazonpro.ru</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Баку, ул. Примерная, 123</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🕒</span>
                <span>Пн-Пт: 9:00-18:00</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-[#6B7280] text-sm">© 2025 GreenZone. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
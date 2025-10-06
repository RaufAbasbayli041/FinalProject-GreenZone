'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  Clock
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context-new'

export const Footer: React.FC = () => {
  const { t } = useLanguage()
  return (
    <footer className="bg-[#1F2937] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* О компании */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold">GreenZone</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#10B981] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#10B981] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#10B981] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Навигация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('nav.home')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('nav.catalog')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('nav.cart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Категории */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.catalog')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog?category=landscape" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.catalog.landscape')}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=sports" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.catalog.sports')}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=decorative" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.catalog.decorative')}
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=accessories" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.catalog.accessories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#10B981]" />
                <div>
                  <p className="text-sm text-gray-400">{t('contact.phone')}</p>
                  <p className="text-sm">{t('footer.contact.phone')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#10B981]" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-sm">{t('footer.contact.email')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-[#10B981] mt-1" />
                <div>
                  <p className="text-sm text-gray-400">{t('contact.address')}</p>
                  <p className="text-sm">{t('footer.contact.address')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-[#10B981]" />
                <div>
                  <p className="text-sm text-gray-400">{t('contact.hours')}</p>
                  <p className="text-sm">{t('footer.contact.hours')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 GreenZone. {t('common.brandName')}.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/delivery" className="text-gray-400 hover:text-white transition-colors text-sm">
                Delivery & Payment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}







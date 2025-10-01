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

export const Footer: React.FC = () => {
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
              Профессиональная продажа и установка искусственного газона для дома, 
              стадионов и коммерческих объектов. Качественные материалы и быстрая доставка.
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
            <h3 className="text-lg font-semibold">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Корзина
                </Link>
              </li>
            </ul>
          </div>

          {/* Категории */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Категории</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog?category=home" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Для дома
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=sports" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Спортивные площадки
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=commercial" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Коммерческие объекты
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=stadium" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Стадионы
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=decorative" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Декоративные
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#10B981]" />
                <div>
                  <p className="text-sm text-gray-400">Телефон</p>
                  <p className="text-sm">+7 (999) 123-45-67</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#10B981]" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-sm">info@greenzone.ru</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-[#10B981] mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Адрес</p>
                  <p className="text-sm">г. Москва, ул. Примерная, д. 123</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-[#10B981]" />
                <div>
                  <p className="text-sm text-gray-400">Время работы</p>
                  <p className="text-sm">Пн-Пт: 9:00-18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 GreenZone. Все права защищены.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Условия использования
              </Link>
              <Link href="/delivery" className="text-gray-400 hover:text-white transition-colors text-sm">
                Доставка и оплата
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


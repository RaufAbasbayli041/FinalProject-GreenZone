'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context-new'
import { ArrowRight, Phone } from 'lucide-react'

export const HeroSection: React.FC = () => {
  const { t } = useLanguage()
  
  return (
    <section className="relative min-h-[700px] bg-[#FAF8F5] flex items-center overflow-hidden w-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#10B981] to-transparent"></div>
      </div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-[700px]">
          {/* Content */}
          <div className="space-y-8 w-full lg:w-[600px] xl:w-[700px] h-full flex flex-col justify-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight h-[160px] sm:h-[180px] lg:h-[200px] flex flex-col justify-center">
                {t('hero.title')}
                <span className="text-[#10B981] block">{t('hero.subtitle')}</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-lg h-[80px] sm:h-[90px] flex items-center">
                {t('hero.description')}
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 h-[80px] flex items-center">
              <Link href="/catalog">
                <Button 
                  size="lg" 
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg group w-[180px] h-[60px]"
                >
                  {t('nav.catalog')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:transform hover:-translate-y-1 w-[180px] h-[60px]"
              >
                <Phone className="mr-2 h-5 w-5" />
                {t('hero.cta')}
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-[#E5E7EB] h-[100px] flex items-center">
              <div className="text-center w-[100px]">
                <div className="text-3xl font-bold text-[#10B981]">15+</div>
                <div className="text-sm text-[#6B7280] h-[40px] flex items-center justify-center">{t('benefits.warranty')}</div>
              </div>
              <div className="text-center w-[100px]">
                <div className="text-3xl font-bold text-[#10B981]">1000+</div>
                <div className="text-sm text-[#6B7280] h-[40px] flex items-center justify-center">{t('admin.customers')}</div>
              </div>
              <div className="text-center w-[100px]">
                <div className="text-3xl font-bold text-[#10B981]">24/7</div>
                <div className="text-sm text-[#6B7280] h-[40px] flex items-center justify-center">{t('footer.services')}</div>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative w-full lg:w-[600px] xl:w-[700px] h-[600px] lg:h-[700px] flex items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-full">
              <img 
                src="/luxury-artificial-grass.png" 
                alt={t('images.hero')}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Quality badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <span className="text-sm font-medium text-[#10B981]">✓ {t('home.features.quality')}</span>
              </div>
            </div>
            
            {/* Floating elements - ограничиваем их позиционирование */}
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#10B981] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-[#059669] rounded-full opacity-10 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

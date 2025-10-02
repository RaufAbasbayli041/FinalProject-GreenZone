'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context-new'
import { ArrowRight, Phone } from 'lucide-react'

export const HeroSection: React.FC = () => {
  const { t } = useLanguage()
  
  return (
    <section className="relative min-h-[700px] bg-[#FAF8F5] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#10B981] to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight">
                {t('hero.title')}
                <span className="text-[#10B981] block">{t('hero.subtitle')}</span>
              </h1>
              
              <p className="text-xl text-[#6B7280] leading-relaxed max-w-lg">
                {t('hero.description')}
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog">
                <Button 
                  size="lg" 
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg group"
                >
                  {t('nav.catalog')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <Phone className="mr-2 h-5 w-5" />
                {t('hero.cta')}
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-[#E5E7EB]">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#10B981]">15+</div>
                <div className="text-sm text-[#6B7280]">{t('benefits.warranty')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#10B981]">1000+</div>
                <div className="text-sm text-[#6B7280]">{t('admin.customers')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#10B981]">24/7</div>
                <div className="text-sm text-[#6B7280]">{t('footer.services')}</div>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/luxury-artificial-grass.png" 
                alt="Премиальный искусственный газон в современном дворе"
                className="w-full h-[600px] object-cover transition-transform duration-700 hover:scale-105"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Quality badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <span className="text-sm font-medium text-[#10B981]">✓ Премиум качество</span>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#10B981] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#059669] rounded-full opacity-10 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

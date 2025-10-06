'use client'

import React from 'react'
import { Search, ShoppingCart, Truck, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context-new'

export const ProcessSection: React.FC = () => {
  const { t } = useLanguage()

  const steps = [
    {
      number: 1,
      icon: Search,
      title: t('process.step1.title'),
      description: t('process.step1.desc')
    },
    {
      number: 2,
      icon: ShoppingCart,
      title: t('process.step2.title'),
      description: t('process.step2.desc')
    },
    {
      number: 3,
      icon: Truck,
      title: t('process.step3.title'),
      description: t('process.step3.desc')
    },
    {
      number: 4,
      icon: CheckCircle,
      title: t('process.step4.title'),
      description: t('process.step4.desc')
    }
  ]
  return (
    <section className="py-20 bg-[#F3F4F6] w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
            {t('process.title')}
          </h2>
          <p className="text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            {t('process.subtitle')}
          </p>
        </div>
        
        {/* Steps */}
        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-4 gap-8 relative">
              {/* Connection Lines */}
              <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-[#10B981] via-[#10B981] to-[#10B981] opacity-20"></div>
              <div className="absolute top-16 left-1/4 right-3/4 h-0.5 bg-[#10B981]"></div>
              <div className="absolute top-16 left-2/4 right-2/4 h-0.5 bg-[#10B981]"></div>
              <div className="absolute top-16 left-3/4 right-1/4 h-0.5 bg-[#10B981]"></div>
              
              {steps.map((step, index) => (
                <div key={index} className="relative text-center flex flex-col items-center">
                  {/* Step Number Circle - сверху */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg relative z-10">
                      {step.number}
                    </div>
                    <div className="absolute inset-0 bg-[#10B981] rounded-full animate-ping opacity-20"></div>
                  </div>
                  
                  {/* Icon and Content - внизу, горизонтально */}
                  <div className="flex items-center gap-3 w-full justify-center">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <step.icon className="h-6 w-6 text-[#10B981]" />
                    </div>
                    
                    {/* Content */}
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[#1F2937] mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[#6B7280] leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Step Number Circle - сверху */}
                <div className="relative mb-4">
                  <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {step.number}
                  </div>
                  <div className="absolute inset-0 bg-[#10B981] rounded-full animate-ping opacity-20"></div>
                </div>
                
                {/* Icon and Content - внизу, горизонтально */}
                <div className="flex items-center gap-3 w-full justify-center">
                  {/* Icon */}
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                    <step.icon className="h-5 w-5 text-[#10B981]" />
                  </div>
                  
                  {/* Content */}
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#1F2937] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[#6B7280] leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-8 bg-[#10B981] opacity-30 mt-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-[#10B981] mb-2">2-3 дня</div>
            <div className="text-[#6B7280]">{t('process.deliveryTime')}</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-[#10B981] mb-2">100%</div>
            <div className="text-[#6B7280]">{t('process.qualityGuarantee')}</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-[#10B981] mb-2">24/7</div>
            <div className="text-[#6B7280]">{t('process.customerSupport')}</div>
          </div>
        </div>
      </div>
    </section>
  )
}




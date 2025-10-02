'use client'

import React from 'react'
import { Clock, Shield, Droplets, Leaf } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context-new'

export const FeaturesSection: React.FC = () => {
  const { t } = useLanguage()
  
  const features = [
    {
      icon: Clock,
      title: t('home.features.quality'),
      description: t('home.features.quality.desc')
    },
    {
      icon: Shield,
      title: t('home.features.warranty'),
      description: t('home.features.warranty.desc')
    },
    {
      icon: Leaf,
      title: t('home.features.installation'),
      description: t('home.features.installation.desc')
    },
    {
      icon: Droplets,
      title: t('home.features.delivery'),
      description: t('home.features.delivery.desc')
    }
  ]
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            {t('benefits.subtitle')}
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 border border-[#E5E7EB] hover:border-[#10B981] transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#10B981] transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-[#10B981] group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#1F2937] group-hover:text-[#10B981] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Decorative element */}
              <div className="mt-6 h-1 w-12 bg-[#10B981]/20 rounded-full group-hover:bg-[#10B981] group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

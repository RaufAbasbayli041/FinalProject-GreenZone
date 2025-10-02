'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context-new'
import { Phone, CheckCircle } from 'lucide-react'

export const CtaSection: React.FC = () => {
  const { t } = useLanguage()
  const [phone, setPhone] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length === 0) return ''
    if (numbers.length <= 1) return `+7 (${numbers.slice(1)}`
    if (numbers.length <= 4) return `+7 (${numbers.slice(1, 4)}`
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}`
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`
  }
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setPhone(formatted)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 18) return
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setPhone('')
    }, 3000)
  }
  
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] overflow-hidden">
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500"></div>
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t('cta.description')}
            </p>
          </div>
          
          {/* Form */}
          <div className="max-w-2xl mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone Input */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="tel"
                      placeholder="+7 (999) 999-99-99"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="h-14 text-lg bg-white/95 backdrop-blur-sm border-0 focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!phone || phone.length < 18 || isLoading}
                    className="h-14 px-8 bg-white text-[#10B981] hover:bg-gray-50 font-semibold text-lg transition-all duration-300 hover:transform hover:-translate-y-1 disabled:transform-none disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                        {t('common.loading')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        {t('hero.cta')}
                      </div>
                    )}
                  </Button>
                </div>
                
                {/* Privacy Notice */}
                <p className="text-sm text-white/70 leading-relaxed">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <a href="#" className="underline hover:text-white transition-colors">
                    политикой конфиденциальности
                  </a>
                  {' '}и даете согласие на обработку персональных данных
                </p>
              </form>
            ) : (
              /* Success State */
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-[#10B981]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    {t('common.success')}
                  </h3>
                </div>
                <p className="text-white/90 text-lg leading-relaxed">
                  {t('cart.contactSoon')}
                </p>
              </div>
            )}
          </div>
          
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Быстрый ответ
              </h3>
              <p className="text-white/80 text-sm">
                Перезвоним в течение 15 минут
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Бесплатно
              </h3>
              <p className="text-white/80 text-sm">
                Консультация и расчет без оплаты
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 text-white font-bold text-lg">%</div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Скидка 10%
              </h3>
              <p className="text-white/80 text-sm">
                При заказе в день консультации
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

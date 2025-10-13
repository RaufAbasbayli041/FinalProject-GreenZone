"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Product } from "@/lib/types"
import { fetchProducts } from "@/services/api"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context-new"
import { CartIcon } from "@/components/cart/cart-icon"
import { LanguageSwitcher } from "@/components/language-switcher-new"
import { EmailService } from "@/lib/email-service"
import { 
  ArrowRight, 
  Phone, 
  Star, 
  CheckCircle, 
  Clock, 
  Leaf, 
  Shield, 
  Truck, 
  Users, 
  Quote,
  MapPin,
  Mail,
  Calendar,
  Menu,
  X,
  ChevronDown,
  Bell
} from "lucide-react"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [orderForm, setOrderForm] = useState({
    area: "",
    installation: false,
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })
  const [consultationPhone, setConsultationPhone] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { user, isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (error: any) {
        console.error(t('error.loading'), error)
        
        // Более детальная обработка ошибок
        if (error.message.includes('401')) {
          setError(t('error.loginRequired'))
        } else if (error.message.includes('404')) {
          setError(t('error.apiNotFound'))
        } else if (error.message.includes('500')) {
          setError(t('error.serverError'))
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          setError(t('error.serverError'))
        } else {
          setError(`${t('error.loadingError')}: ${error.message}`)
        }
        
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [t])

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    EmailService.sendOrderEmail({
      ...orderForm,
      product: selectedProduct?.title || 'Не указан',
      total: selectedProduct ? 
        (parseFloat(orderForm.area) * selectedProduct.pricePerSquareMeter + 
         (orderForm.installation ? parseFloat(orderForm.area) * 500 : 0)) : 0
    })
      .then(() => {
        alert(t('order.success'))
        setOrderForm({
          area: "",
          installation: false,
          name: "",
          email: "",
          phone: "",
          address: "",
          notes: "",
        })
        setSelectedProduct(null)
      })
      .catch((error) => {
      console.error(t('error.orderFailed'), error)
        alert(t('order.error'))
      })
  }

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    addToCart(product, 1)
  }

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!consultationPhone.trim()) {
      alert(t('form.required'))
      return
    }
    
    // Здесь можно добавить логику отправки заявки на консультацию
    alert(t('order.success'))
    setConsultationPhone("")
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero Section */}
      <section className="py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 w-fit whitespace-nowrap shrink-0 gap-1 border-transparent bg-secondary text-secondary-foreground mb-6 text-sm font-medium">
                {t('home.freeDelivery')}
              </span>
              <h1 className="text-5xl lg:text-7xl font-serif font-medium text-[#1F2937] mb-8 leading-tight text-balance">
                {t('home.premiumTitle')}<br/>
                <span className="text-[#10B981]">{t('home.artificialGrass')}</span><br/>
                {t('home.grass')}
              </h1>
              <p className="text-xl text-[#6B7280] mb-10 leading-relaxed max-w-lg text-pretty">
                {t('home.qualityDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-[#10B981] text-white hover:bg-[#059669] h-12 rounded-md px-8 py-6 text-base"
                  onClick={() => scrollToSection('products')}
                >
                  {t('home.viewCatalog')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white h-12 rounded-md px-8 py-6 text-base bg-transparent"
                  onClick={() => scrollToSection('contact')}
                >
                  {t('home.freeConsultation')}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img 
                  alt="Красивый искусственный газон в современном дворе" 
                  className="w-full h-full object-cover" 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-artificial-grass-lawn-in-modern-backyard-jaBUqxXuItZNcFWabr7ueN0Ycool9S.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="pt-0 pb-24 bg-[#F3F4F6]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-serif font-medium text-[#1F2937] mb-4">
              {t('home.whyChooseUs')}
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              {t('home.benefitsSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-[#10B981]" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1F2937]">{t('home.durability')}</h3>
                <p className="text-[#6B7280] leading-relaxed">{t('home.durabilityDesc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-[#10B981]" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1F2937]">{t('home.installation')}</h3>
                <p className="text-[#6B7280] leading-relaxed">{t('home.installationDesc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-8 w-8 text-[#10B981]" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1F2937]">{t('home.delivery')}</h3>
                <p className="text-[#6B7280] leading-relaxed">{t('home.deliveryDesc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section id="products" className="pt-0 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-serif font-medium text-[#1F2937] mb-4">
              {t('home.popularProducts')}
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              {t('home.popularProductsSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#10B981] mx-auto mb-4"></div>
                <p className="text-xl text-[#6B7280]">{t('home.loadingProducts')}</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold mb-4 text-[#1F2937]">{t('home.loadingError')}</h3>
                <p className="text-[#6B7280] mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => window.location.reload()} className="bg-[#10B981] hover:bg-[#059669] text-white">
                    {t('home.tryAgain')}
                  </Button>
                  {error.includes('авторизация') && (
                    <Button variant="outline" onClick={() => router.push("/login")} className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white">
                      {t('home.loginToSystem')}
                    </Button>
                  )}
                </div>
              </div>
            ) : products && products.length > 0 ? (
              products.slice(0, 6).map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
                  <div className="relative">
                    <img 
                      src={product.imageUrl || '/placeholder.jpg'} 
                      alt={product.title || 'Product'}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                      onClick={() => router.push(`/catalog/${product.id}`)}
                    />
                    <Badge className="absolute top-4 left-4 bg-[#10B981] text-white">
                      {t('home.hitSales')}
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-[#1F2937]">{product.title || 'Unnamed Product'}</h3>
                    </div>
                    <p className="text-[#6B7280] mb-6 line-clamp-2">{product.description || 'No description available'}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                        <span>{t('home.thickness')}: {product.minThickness || 30}-{product.maxThickness || 40} мм</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                        <span>{t('home.category')}: {product.category?.name || t('home.notSpecified')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                        <span>{t('home.warranty')}: 15 {t('home.years')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <span className="text-2xl font-bold text-[#10B981]">{t('home.fromPrice')} {product.pricePerSquareMeter || 0}{t('home.perSquareMeter')}</span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white"
                        onClick={() => router.push(`/catalog/${product.id}`)}
                      >
                        {t('home.moreDetails')}
                      </Button>
                      <Button 
                        className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white"
                        onClick={() => handleAddToCart(product)}
                      >
                        {t('home.addToCart')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold mb-4 text-[#1F2937]">{t('home.productsNotFound')}</h3>
                <p className="text-[#6B7280] text-lg">{t('home.productsUnavailable')}</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => router.push("/catalog")} 
              className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white px-8 py-3"
            >
              {t('home.viewAllProducts')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="pt-0 pb-24 bg-[#F3F4F6]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-serif font-medium text-[#1F2937] mb-4">
              {t('nav.services')}
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              Полный спектр услуг от консультации до установки и обслуживания
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('services.consultation')}</h3>
                <p className="text-sm text-[#6B7280]">{t('services.consultation.desc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('services.installation')}</h3>
                <p className="text-sm text-[#6B7280]">{t('services.installation.desc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('services.delivery')}</h3>
                <p className="text-sm text-[#6B7280]">{t('services.delivery.desc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('services.warranty')}</h3>
                <p className="text-sm text-[#6B7280]">{t('services.warranty.desc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Contacts Section */}
      <section id="contact" className="pt-0 pb-24 bg-[#F3F4F6]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-serif font-medium text-[#1F2937] mb-4">
              {t('nav.contact')}
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              Свяжитесь с нами любым удобным способом
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('profile.phone')}</h3>
                <p className="text-sm text-[#6B7280]">+7 (495) 123-45-67</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-sm text-[#6B7280]">info@gazonpro.ru</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('profile.address')}</h3>
                <p className="text-sm text-[#6B7280]">Баку, ул. Примерная, 123</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Режим работы</h3>
                <p className="text-sm text-[#6B7280]">Пн-Пт: 9:00-18:00</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}
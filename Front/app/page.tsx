"use client"

import type React from "react"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { PopularProducts } from "@/components/home/popular-products"
import { ProcessSection } from "@/components/home/process-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Popular Products */}
      <PopularProducts />
      
      {/* Process Section */}
      <ProcessSection />

      <NotificationCenter />
    </div>
  )
}
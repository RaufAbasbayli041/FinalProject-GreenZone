import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ReactNode } from "react"
import Providers from './providers'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ConditionalFooter } from '@/components/layout/conditional-footer'
import { ConditionalNavbar } from '@/components/layout/conditional-navbar'

export const metadata: Metadata = {
  title: "Green Zone - Продажа и установка искусственного газона",
  description:
    "Профессиональная продажа и установка искусственного газона для дома, стадионов и коммерческих объектов. Бесплатная доставка по всей стране.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning={true} data-scroll-behavior="smooth">
      <body suppressHydrationWarning={true}>
        <Providers>
          <div className="flex flex-col">
            <ConditionalNavbar />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <ConditionalFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}

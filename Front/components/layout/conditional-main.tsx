"use client"

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface ConditionalMainProps {
  children: ReactNode
}

export function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname()
  
  // Определяем, нужно ли добавлять отступ сверху
  const isAdminPage = pathname.startsWith('/admin')
  
  // Всегда возвращаем JSX, но условно применяем стили
  return (
    <main className={isAdminPage ? "flex-1" : "flex-1 pt-16"}>
      {children}
    </main>
  )
}

"use client"

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface ConditionalMainProps {
  children: ReactNode
}

export function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname()
  
  // Для админ страниц не добавляем отступ сверху
  if (pathname.startsWith('/admin')) {
    return (
      <main className="flex-1">
        {children}
      </main>
    )
  }
  
  // Для обычных страниц добавляем отступ сверху для navbar
  return (
    <main className="flex-1 pt-16">
      {children}
    </main>
  )
}

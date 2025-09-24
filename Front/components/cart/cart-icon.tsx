"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

export function CartIcon() {
  const { getTotalItems } = useCart()
  const router = useRouter()
  const totalItems = getTotalItems()

  return (
    <Button variant="outline" className="relative bg-transparent" onClick={() => router.push("/cart")}>
      <span className="text-lg">🛒</span>
      {totalItems > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
          {totalItems}
        </Badge>
      )}
    </Button>
  )
}

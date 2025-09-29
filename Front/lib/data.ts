import type { Product } from "./types"

export const initialProducts: Product[] = [
  {
    id: "da83d42d-1208-4f6c-b8b9-6863eaf467cd",
    title: "Ландшафтный газон",
    description: "Идеально подходит для частных домов, дач и коммерческих объектов",
    pricePerSquareMeter: 890,
    minThickness: 20,
    maxThickness: 35,
    imageUrl: "/luxury-artificial-grass.png",
    categoryId: "1",
    documentIds: []
  },
  {
    id: "f17fe991-aa7c-445a-a9cc-beae4a564a7d",
    title: "Спортивный газон",
    description: "Профессиональное покрытие для стадионов и спортивных площадок",
    pricePerSquareMeter: 1290,
    minThickness: 40,
    maxThickness: 60,
    imageUrl: "/stadium-artificial-turf.png",
    categoryId: "2",
    documentIds: []
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Декоративный газон",
    description: "Для балконов, террас и небольших декоративных зон",
    pricePerSquareMeter: 590,
    minThickness: 15,
    maxThickness: 25,
    imageUrl: "/placeholder-1ynxv.png",
    categoryId: "3",
    documentIds: []
  },
]

// Функция для инициализации данных
export const initializeData = (): void => {
  if (typeof window === "undefined") return

  // Очищаем старые данные и инициализируем новыми
  localStorage.removeItem("gazonpro_products")
  localStorage.removeItem("gazonpro_users")
  localStorage.removeItem("gazonpro_orders")
  localStorage.removeItem("gazonpro_cart")
  localStorage.removeItem("gazonpro_auth")

  // Инициализируем новыми данными
  localStorage.setItem("gazonpro_products", JSON.stringify(initialProducts))
  localStorage.setItem("gazonpro_users", JSON.stringify([]))
  localStorage.setItem("gazonpro_orders", JSON.stringify([]))
  localStorage.setItem("gazonpro_cart", JSON.stringify([]))
  localStorage.setItem("gazonpro_auth", JSON.stringify({ user: null, isAuthenticated: false }))

  console.log("[v0] Initialized data in localStorage with new structure")

  const existingUsers = JSON.parse(localStorage.getItem("gazonpro_users") || "[]")
  const adminExists = existingUsers.some((user: any) => user.isAdmin)

  if (!adminExists) {
    const adminUser = {
      id: "admin-user",
      name: "Администратор",
      email: "admin@gazonpro.ru",
      phone: "+7 (800) 123-45-67",
      createdAt: new Date(),
      isAdmin: true,
    }

    const updatedUsers = [...existingUsers, adminUser]
    localStorage.setItem("gazonpro_users", JSON.stringify(updatedUsers))

    console.log("[v0] Created admin user: admin@gazonpro.ru")
  }
}

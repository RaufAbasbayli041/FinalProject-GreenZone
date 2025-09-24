import type { Product } from "./types"

export const initialProducts: Product[] = [
  {
    id: "landscape-premium",
    name: "Ландшафтный газон",
    description: "Идеально подходит для частных домов, дач и коммерческих объектов",
    price: 890,
    image: "/luxury-artificial-grass.png",
    category: "landscape",
    specifications: {
      height: "20-35мм",
      density: "16800 стежков/м²",
      warranty: "10 лет",
    },
    popular: true,
  },
  {
    id: "sports-professional",
    name: "Спортивный газон",
    description: "Профессиональное покрытие для стадионов и спортивных площадок",
    price: 1290,
    image: "/stadium-artificial-turf.png",
    category: "sports",
    specifications: {
      height: "40-60мм",
      density: "9450 стежков/м²",
      warranty: "15 лет",
    },
    premium: true,
  },
  {
    id: "decorative-economy",
    name: "Декоративный газон",
    description: "Для балконов, террас и небольших декоративных зон",
    price: 590,
    image: "/placeholder-1ynxv.png",
    category: "decorative",
    specifications: {
      height: "15-25мм",
      density: "21000 стежков/м²",
      warranty: "7 лет",
    },
  },
]

// Функция для инициализации данных
export const initializeData = (): void => {
  if (typeof window === "undefined") return

  // Проверяем, есть ли уже данные в localStorage
  const existingProducts = localStorage.getItem("gazonpro_products")

  if (!existingProducts) {
    // Если данных нет, инициализируем начальными данными
    localStorage.setItem("gazonpro_products", JSON.stringify(initialProducts))
    localStorage.setItem("gazonpro_users", JSON.stringify([]))
    localStorage.setItem("gazonpro_orders", JSON.stringify([]))
    localStorage.setItem("gazonpro_cart", JSON.stringify([]))
    localStorage.setItem("gazonpro_auth", JSON.stringify({ user: null, isAuthenticated: false }))

    console.log("[v0] Initialized data in localStorage")
  }

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

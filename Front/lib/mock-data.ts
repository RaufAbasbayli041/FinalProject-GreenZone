// Mock данные для тестирования корзины
export interface MockProduct {
  id: string
  title: string
  description: string
  pricePerSquareMeter: number
  imageUrl: string
  categoryId: string
  minThickness: number
  maxThickness: number
}

export interface MockBasketItem {
  id: string
  productId: string
  quantity: number // количество м²
  totalPrice: number
  product: MockProduct
}

export interface MockBasket {
  id: string
  customerId: string
  basketItems: MockBasketItem[]
  totalAmount: number
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export const mockProducts: MockProduct[] = [
  {
    id: "1",
    title: "Премиум искусственная трава",
    description: "Высококачественная искусственная трава для дома и сада",
    pricePerSquareMeter: 2500,
    imageUrl: "/premium-artificial-grass-for-home.jpg",
    categoryId: "cat1",
    minThickness: 20,
    maxThickness: 40
  },
  {
    id: "2", 
    title: "Спортивная искусственная трава",
    description: "Профессиональная трава для спортивных площадок",
    pricePerSquareMeter: 3200,
    imageUrl: "/professional-sports-artificial-turf.jpg",
    categoryId: "cat2",
    minThickness: 30,
    maxThickness: 50
  },
  {
    id: "3",
    title: "Коммерческая искусственная трава",
    description: "Долговечная трава для коммерческих объектов",
    pricePerSquareMeter: 2800,
    imageUrl: "/luxury-commercial-artificial-grass.jpg",
    categoryId: "cat1",
    minThickness: 25,
    maxThickness: 45
  },
  {
    id: "4",
    title: "Стадионная искусственная трава",
    description: "Специальная трава для стадионов и больших площадок",
    pricePerSquareMeter: 4500,
    imageUrl: "/stadium-artificial-turf.png",
    categoryId: "cat2",
    minThickness: 40,
    maxThickness: 60
  },
  {
    id: "5",
    title: "Люкс искусственная трава",
    description: "Элитная трава премиум класса",
    pricePerSquareMeter: 3800,
    imageUrl: "/luxury-artificial-grass.png",
    categoryId: "cat1",
    minThickness: 35,
    maxThickness: 55
  },
  {
    id: "da83d42d-1208-4f6c-b8b9-6863eaf467cd",
    title: "Тестовая искусственная трава",
    description: "Тестовый товар для проверки корзины",
    pricePerSquareMeter: 10,
    imageUrl: "/placeholder.jpg",
    categoryId: "cat1",
    minThickness: 20,
    maxThickness: 40
  }
]

export const mockBasketItems: MockBasketItem[] = [
  {
    id: "item1",
    productId: "1",
    quantity: 2, // 2 м²
    totalPrice: 5000, // 2 * 2500
    product: mockProducts[0]
  },
  {
    id: "item2", 
    productId: "2",
    quantity: 1.5, // 1.5 м²
    totalPrice: 4800, // 1.5 * 3200
    product: mockProducts[1]
  },
  {
    id: "item3",
    productId: "3",
    quantity: 3, // 3 м²
    totalPrice: 8400, // 3 * 2800
    product: mockProducts[2]
  }
]

export const mockBasket: MockBasket = {
  id: "basket1",
  customerId: "customer1",
  basketItems: mockBasketItems,
  totalAmount: 18200, // 5000 + 4800 + 8400
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDeleted: false
}

// Функции для работы с mock данными
export const getMockBasket = (customerId: string): MockBasket => {
  return {
    ...mockBasket,
    customerId
  }
}

export const addMockItemToBasket = (customerId: string, productId: string, quantity: number): MockBasket => {
  const product = mockProducts.find(p => p.id === productId)
  if (!product) return getMockBasket(customerId)

  const basket = getMockBasket(customerId)
  const existingItem = basket.basketItems.find(item => item.productId === productId)
  
  if (existingItem) {
    existingItem.quantity += quantity
    existingItem.totalPrice = existingItem.quantity * product.pricePerSquareMeter
  } else {
    const newItem: MockBasketItem = {
      id: `item${Date.now()}`,
      productId,
      quantity,
      totalPrice: quantity * product.pricePerSquareMeter,
      product
    }
    basket.basketItems.push(newItem)
  }

  basket.totalAmount = basket.basketItems.reduce((sum, item) => sum + item.totalPrice, 0)
  basket.updatedAt = new Date().toISOString()
  
  return basket
}

export const removeMockItemFromBasket = (customerId: string, productId: string, quantity: number): MockBasket => {
  const basket = getMockBasket(customerId)
  const itemIndex = basket.basketItems.findIndex(item => item.productId === productId)
  
  if (itemIndex !== -1) {
    const item = basket.basketItems[itemIndex]
    item.quantity -= quantity
    
    if (item.quantity <= 0) {
      basket.basketItems.splice(itemIndex, 1)
    } else {
      item.totalPrice = item.quantity * item.product.pricePerSquareMeter
    }
    
    basket.totalAmount = basket.basketItems.reduce((sum, item) => sum + item.totalPrice, 0)
    basket.updatedAt = new Date().toISOString()
  }
  
  return basket
}

export const updateMockItemQuantity = (customerId: string, productId: string, quantity: number): MockBasket => {
  const basket = getMockBasket(customerId)
  const item = basket.basketItems.find(item => item.productId === productId)
  
  if (item) {
    item.quantity = quantity
    item.totalPrice = quantity * item.product.pricePerSquareMeter
    basket.totalAmount = basket.basketItems.reduce((sum, item) => sum + item.totalPrice, 0)
    basket.updatedAt = new Date().toISOString()
  }
  
  return basket
}

export const clearMockBasket = (customerId: string): MockBasket => {
  return {
    id: `basket_${Date.now()}`,
    customerId,
    basketItems: [],
    totalAmount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false
  }
}

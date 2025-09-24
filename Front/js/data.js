// Product data
const products = [
  {
    id: 1,
    name: "Премиум Газон для Дома",
    category: "residential",
    price: 1200,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    description: "Высококачественный искусственный газон для домашнего использования",
    features: ["Мягкий на ощупь", "UV защита", "Дренажная система", "5 лет гарантии"],
    specifications: {
      height: "35мм",
      density: "16800 стежков/м²",
      material: "PE + PP",
      backing: "SBR латекс",
    },
  },
  {
    id: 2,
    name: "Коммерческий Газон Люкс",
    category: "commercial",
    price: 1800,
    image: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400&h=300&fit=crop",
    description: "Прочный газон для коммерческих объектов",
    features: ["Высокая износостойкость", "Антибактериальное покрытие", "Огнестойкий", "10 лет гарантии"],
    specifications: {
      height: "40мм",
      density: "18900 стежков/м²",
      material: "PE + PP + PA",
      backing: "PU + SBR",
    },
  },
  {
    id: 3,
    name: "Спортивный Газон Про",
    category: "sports",
    price: 2500,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    description: "Профессиональный газон для спортивных площадок",
    features: ["FIFA сертификат", "Амортизация", "Быстрый дренаж", "15 лет гарантии"],
    specifications: {
      height: "50мм",
      density: "21000 стежков/м²",
      material: "PE + PP + PA",
      backing: "PU + резиновые гранулы",
    },
  },
  {
    id: 4,
    name: "Эконом Газон",
    category: "residential",
    price: 800,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    description: "Доступный вариант для небольших участков",
    features: ["Легкий монтаж", "Базовая UV защита", "Хорошее качество", "3 года гарантии"],
    specifications: {
      height: "25мм",
      density: "14000 стежков/м²",
      material: "PE + PP",
      backing: "SBR латекс",
    },
  },
  {
    id: 5,
    name: "Детский Безопасный Газон",
    category: "residential",
    price: 1500,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    description: "Специально разработан для детских площадок",
    features: ["Гипоаллергенный", "Мягкая амортизация", "Антибактериальный", "7 лет гарантии"],
    specifications: {
      height: "30мм",
      density: "15500 стежков/м²",
      material: "PE + PP",
      backing: "Мягкая пена + SBR",
    },
  },
  {
    id: 6,
    name: "Ландшафтный Газон Премиум",
    category: "commercial",
    price: 2200,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
    description: "Идеален для ландшафтного дизайна",
    features: ["Естественный вид", "4 оттенка зеленого", "Устойчив к выцветанию", "12 лет гарантии"],
    specifications: {
      height: "45мм",
      density: "19500 стежков/м²",
      material: "PE + PP + PA",
      backing: "PU + SBR",
    },
  },
]

// Initialize data from localStorage
const users = JSON.parse(localStorage.getItem("users")) || []
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null
const cart = JSON.parse(localStorage.getItem("cart")) || []
const orders = JSON.parse(localStorage.getItem("orders")) || []

// Utility functions
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || []
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function formatPrice(price) {
  return price.toLocaleString("ru-RU") + "₽"
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
    type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
  }`
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 3000)
}

function getCategoryName(category) {
  const categories = {
    residential: "Для дома",
    commercial: "Коммерческий",
    sports: "Спортивный",
  }
  return categories[category] || category
}

// Declare variables before using them
let cart = []
const products = []
const orders = []

// Helper functions
function formatPrice(price) {
  return price.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })
}

function getCategoryName(categoryId) {
  // Assuming categories is a predefined array or object
  const categories = {
    1: "Категория 1",
    2: "Категория 2",
    3: "Категория 3",
  }
  return categories[categoryId] || "Неизвестная категория"
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function showNotification(message, type = "success") {
  alert(`${type === "success" ? "Успех" : "Ошибка"}: ${message}`)
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

// Main application logic
document.addEventListener("DOMContentLoaded", () => {
  // Load data from localStorage
  cart = JSON.parse(localStorage.getItem("cart")) || []

  updateCartCount()
  loadProducts()
  initializeEventListeners()
})

function initializeEventListeners() {
  // Cart button
  const cartBtn = document.getElementById("cart-btn")
  if (cartBtn) {
    cartBtn.addEventListener("click", openCartModal)
  }

  // Consultation button
  const consultationBtn = document.getElementById("consultation-btn")
  if (consultationBtn) {
    consultationBtn.addEventListener("click", () => openOrderModal())
  }

  // Modal close buttons
  const closeModal = document.getElementById("close-modal")
  if (closeModal) {
    closeModal.addEventListener("click", closeOrderModal)
  }

  const closeCartModal = document.getElementById("close-cart-modal")
  if (closeCartModal) {
    closeCartModal.addEventListener("click", () => {
      document.getElementById("cart-modal").classList.add("hidden")
    })
  }

  const cancelOrder = document.getElementById("cancel-order")
  if (cancelOrder) {
    cancelOrder.addEventListener("click", closeOrderModal)
  }

  // Order form
  const orderForm = document.getElementById("order-form")
  if (orderForm) {
    orderForm.addEventListener("submit", handleOrderSubmit)
  }

  // Checkout button
  const checkoutBtn = document.getElementById("checkout-btn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout)
  }
}

function loadProducts() {
  const productsGrid = document.getElementById("products-grid")
  if (!productsGrid) return

  productsGrid.innerHTML = ""

  // Show first 3 products on main page
  const displayProducts = products.slice(0, 3)

  displayProducts.forEach((product) => {
    const productCard = createProductCard(product)
    productsGrid.appendChild(productCard)
  })
}

function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"

  card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
        <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
            <p class="text-gray-600 mb-4">${product.description}</p>
            <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-green-600">${formatPrice(product.price)}/м²</span>
                <span class="text-sm text-gray-500">${getCategoryName(product.category)}</span>
            </div>
            <div class="space-y-2 mb-4">
                ${product.features
                  .slice(0, 2)
                  .map(
                    (feature) =>
                      `<div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        ${feature}
                    </div>`,
                  )
                  .join("")}
            </div>
            <div class="flex space-x-2">
                <button onclick="addToCart(${product.id})" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                    В корзину
                </button>
                <button onclick="openOrderModal(${product.id})" class="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-md hover:bg-green-50 transition-colors">
                    Заказать
                </button>
            </div>
        </div>
    `

  return card
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)
  if (existingItem) {
    existingItem.quantity += 1
    existingItem.area += 1
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      area: 1,
    })
  }

  saveToStorage("cart", cart)
  updateCartCount()
  showNotification("Товар добавлен в корзину!")
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
}

function openCartModal() {
  const cartModal = document.getElementById("cart-modal")
  const cartItems = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total")

  if (!cartModal || !cartItems || !cartTotal) return

  // Load cart items
  cartItems.innerHTML = ""
  let total = 0

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Корзина пуста</p>'
  } else {
    cart.forEach((item) => {
      const itemTotal = item.price * item.area
      total += itemTotal

      const cartItem = document.createElement("div")
      cartItem.className = "flex items-center space-x-4 py-4 border-b"
      cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-gray-600">${formatPrice(item.price)}/м²</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="updateCartItem(${item.id}, -1)" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">-</button>
                    <span class="w-8 text-center">${item.area}</span>
                    <button onclick="updateCartItem(${item.id}, 1)" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">+</button>
                </div>
                <div class="text-right">
                    <p class="font-semibold">${formatPrice(itemTotal)}</p>
                    <button onclick="removeFromCart(${item.id})" class="text-red-500 text-sm hover:text-red-700">Удалить</button>
                </div>
            `
      cartItems.appendChild(cartItem)
    })
  }

  cartTotal.textContent = formatPrice(total)
  cartModal.classList.remove("hidden")
}

function updateCartItem(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.area += change
  item.quantity = item.area

  if (item.area <= 0) {
    removeFromCart(productId)
    return
  }

  saveToStorage("cart", cart)
  updateCartCount()
  openCartModal() // Refresh cart modal
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveToStorage("cart", cart)
  updateCartCount()
  openCartModal() // Refresh cart modal
  showNotification("Товар удален из корзины")
}

function openOrderModal(productId = null) {
  const orderModal = document.getElementById("order-modal")
  if (orderModal) {
    orderModal.classList.remove("hidden")

    // If specific product, set area to 1
    if (productId) {
      const areaInput = document.getElementById("area")
      if (areaInput) {
        areaInput.value = 1
      }
    }
  }
}

function closeOrderModal() {
  const orderModal = document.getElementById("order-modal")
  if (orderModal) {
    orderModal.classList.add("hidden")
    const orderForm = document.getElementById("order-form")
    if (orderForm) {
      orderForm.reset()
    }
  }
}

function handleOrderSubmit(e) {
  e.preventDefault()

  const orderData = {
    id: generateId(),
    customerName: document.getElementById("customer-name").value,
    customerPhone: document.getElementById("customer-phone").value,
    customerEmail: document.getElementById("customer-email").value,
    area: Number.parseInt(document.getElementById("area").value),
    address: document.getElementById("address").value,
    installation: document.getElementById("installation").checked,
    date: new Date().toISOString(),
    status: "pending",
    items: cart.length > 0 ? cart : [{ name: "Консультация", quantity: 1 }],
  }

  orders.push(orderData)
  saveToStorage("orders", orders)

  // Clear cart if order from cart
  if (cart.length > 0) {
    cart = []
    saveToStorage("cart", cart)
    updateCartCount()
  }

  closeOrderModal()
  showNotification("Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.")
}

function handleCheckout() {
  if (cart.length === 0) {
    showNotification("Корзина пуста", "error")
    return
  }

  // Close cart modal and open order modal
  document.getElementById("cart-modal").classList.add("hidden")
  openOrderModal()
}

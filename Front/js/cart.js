// Cart page specific logic
let cart = []
const products = []

document.addEventListener("DOMContentLoaded", () => {
  // Load data from localStorage and data.js
  cart = JSON.parse(localStorage.getItem("cart")) || []

  updateCartCount()
  loadCartItems()
  initializeEventListeners()
})

function initializeEventListeners() {
  // Checkout button
  const checkoutBtn = document.getElementById("checkout-btn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", openOrderModal)
  }

  // Modal close buttons
  const closeModal = document.getElementById("close-modal")
  if (closeModal) {
    closeModal.addEventListener("click", closeOrderModal)
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
}

function loadCartItems() {
  const cartItemsContainer = document.getElementById("cart-items-container")
  const cartTotal = document.getElementById("cart-total")

  if (!cartItemsContainer || !cartTotal) return

  cartItemsContainer.innerHTML = ""
  let total = 0

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Корзина пуста</h3>
        <p class="text-gray-500 mb-4">Добавьте товары из каталога</p>
        <a href="catalog.html" class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
          Перейти в каталог
        </a>
      </div>
    `
    cartTotal.textContent = "0₽"
    return
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.area
    total += itemTotal

    const cartItem = document.createElement("div")
    cartItem.className = "flex items-center space-x-4 py-6" + (index > 0 ? " border-t" : "")
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900">${item.name}</h3>
        <p class="text-gray-600">${formatPrice(item.price)}/м²</p>
      </div>
      <div class="flex items-center space-x-3">
        <button onclick="updateCartItem(${item.id}, -1)" class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
          </svg>
        </button>
        <span class="w-12 text-center font-semibold">${item.area}м²</span>
        <button onclick="updateCartItem(${item.id}, 1)" class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
      </div>
      <div class="text-right">
        <p class="text-lg font-semibold text-gray-900">${formatPrice(itemTotal)}</p>
        <button onclick="removeFromCart(${item.id})" class="text-red-500 text-sm hover:text-red-700 transition-colors">
          Удалить
        </button>
      </div>
    `
    cartItemsContainer.appendChild(cartItem)
  })

  cartTotal.textContent = formatPrice(total)
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
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
  loadCartItems()
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveToStorage("cart", cart)
  updateCartCount()
  loadCartItems()
  showNotification("Товар удален из корзины")
}

function openOrderModal() {
  if (cart.length === 0) {
    showNotification("Корзина пуста", "error")
    return
  }

  const orderModal = document.getElementById("order-modal")
  if (orderModal) {
    orderModal.classList.remove("hidden")
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
    address: document.getElementById("address").value,
    installation: document.getElementById("installation").checked,
    date: new Date().toISOString(),
    status: "pending",
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.price * item.area, 0),
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || []
  orders.push(orderData)
  saveToStorage("orders", orders)

  // Clear cart
  cart = []
  saveToStorage("cart", cart)
  updateCartCount()
  loadCartItems()

  closeOrderModal()
  showNotification("Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.")

  // Redirect to main page after 2 seconds
  setTimeout(() => {
    window.location.href = "index.html"
  }, 2000)
}

// Helper functions
function formatPrice(price) {
  return price.toLocaleString("ru-RU") + "₽"
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 notification ${
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

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

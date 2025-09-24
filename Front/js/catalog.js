// Declare variables before using them
const products = window.productsData || [] // This should be initialized with actual product data from data.js
let cart = []
let filteredProducts = [] // Declare filteredProducts variable

// Catalog page specific logic
document.addEventListener("DOMContentLoaded", () => {
  // Load data from localStorage
  cart = JSON.parse(localStorage.getItem("cart")) || []

  // Initialize filtered products with all products from data.js
  filteredProducts = [...products]

  updateCartCount()
  loadCatalogProducts()
  initializeCatalogFilters()
  initializeEventListeners()
})

function initializeCatalogFilters() {
  const categoryFilter = document.getElementById("category-filter")
  const priceFilter = document.getElementById("price-filter")
  const sortFilter = document.getElementById("sort-filter")
  const searchInput = document.getElementById("search-input")

  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters)
  if (priceFilter) priceFilter.addEventListener("change", applyFilters)
  if (sortFilter) sortFilter.addEventListener("change", applyFilters)
  if (searchInput) searchInput.addEventListener("input", applyFilters)
}

function applyFilters() {
  const categoryFilter = document.getElementById("category-filter").value
  const priceFilter = document.getElementById("price-filter").value
  const sortFilter = document.getElementById("sort-filter").value
  const searchQuery = document.getElementById("search-input").value.toLowerCase()

  // Start with all products
  filteredProducts = [...products]

  // Apply category filter
  if (categoryFilter) {
    filteredProducts = filteredProducts.filter((product) => product.category === categoryFilter)
  }

  // Apply price filter
  if (priceFilter) {
    const [min, max] = priceFilter.split("-").map((p) => p.replace("+", ""))
    filteredProducts = filteredProducts.filter((product) => {
      if (max) {
        return product.price >= Number.parseInt(min) && product.price <= Number.parseInt(max)
      } else {
        return product.price >= Number.parseInt(min)
      }
    })
  }

  // Apply search filter
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.features.some((feature) => feature.toLowerCase().includes(searchQuery)),
    )
  }

  // Apply sorting
  switch (sortFilter) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case "popular":
      // For demo, just reverse order
      filteredProducts.reverse()
      break
    case "name":
    default:
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  loadCatalogProducts()
}

function loadCatalogProducts() {
  const catalogProducts = document.getElementById("catalog-products")
  if (!catalogProducts) return

  catalogProducts.innerHTML = ""

  if (filteredProducts.length === 0) {
    catalogProducts.innerHTML =
      '<div class="col-span-full text-center py-12"><p class="text-gray-500 text-lg">Товары не найдены</p></div>'
    return
  }

  filteredProducts.forEach((product) => {
    const productCard = createDetailedProductCard(product)
    catalogProducts.appendChild(productCard)
  })
}

function createDetailedProductCard(product) {
  const card = document.createElement("div")
  card.className = "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"

  card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
        <div class="p-6">
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-semibold">${product.name}</h3>
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">${getCategoryName(product.category)}</span>
            </div>
            <p class="text-gray-600 mb-4">${product.description}</p>
            
            <div class="mb-4">
                <h4 class="font-semibold text-sm text-gray-700 mb-2">Характеристики:</h4>
                <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>Высота: ${product.specifications.height}</div>
                    <div>Плотность: ${product.specifications.density}</div>
                    <div>Материал: ${product.specifications.material}</div>
                    <div>Основа: ${product.specifications.backing}</div>
                </div>
            </div>
            
            <div class="space-y-2 mb-4">
                <h4 class="font-semibold text-sm text-gray-700">Преимущества:</h4>
                ${product.features
                  .map(
                    (feature) =>
                      `<div class="flex items-center text-sm text-gray-600">
                        <svg class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        ${feature}
                    </div>`,
                  )
                  .join("")}
            </div>
            
            <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-green-600">${formatPrice(product.price)}/м²</span>
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

function initializeEventListeners() {
  // Cart button
  const cartBtn = document.getElementById("cart-btn")
  if (cartBtn) {
    cartBtn.addEventListener("click", openCartModal)
  }

  // Cart modal close
  const closeCartModal = document.getElementById("close-cart-modal")
  if (closeCartModal) {
    closeCartModal.addEventListener("click", () => {
      document.getElementById("cart-modal").classList.add("hidden")
    })
  }

  // Checkout button
  const checkoutBtn = document.getElementById("checkout-btn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout)
  }
}

function handleCheckout() {
  if (cart.length === 0) {
    showNotification("Корзина пуста", "error")
    return
  }

  // Close cart modal and open order modal (redirect to main page with modal)
  window.location.href = "index.html#order"
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
}

// These functions are shared with app.js, so they need to be available globally
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

function openOrderModal(productId = null) {
  // For catalog page, redirect to main page with order modal
  if (productId) {
    window.location.href = `index.html#order-${productId}`
  } else {
    window.location.href = "index.html#order"
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

// Declare functions that are used globally
function getCategoryName(category) {
  // Implement logic to get category name
  return category
}

function formatPrice(price) {
  // Implement logic to format price
  return price.toString()
}

function showNotification(message, type = "success") {
  // Implement logic to show notification
  console.log(`Notification (${type}): ${message}`)
}

function saveToStorage(key, value) {
  // Implement logic to save to storage
  localStorage.setItem(key, JSON.stringify(value))
}

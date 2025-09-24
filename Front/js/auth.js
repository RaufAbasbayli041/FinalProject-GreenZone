// Authentication logic

const users = JSON.parse(localStorage.getItem("users")) || []
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null

document.addEventListener("DOMContentLoaded", () => {
  initializeAuthForms()
})

function initializeAuthForms() {
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister)
  }
}

function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  // Find user
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    currentUser = user
    saveToStorage("currentUser", currentUser)
    showNotification("Успешный вход в систему!")

    // Redirect to main page
    setTimeout(() => {
      window.location.href = "index.html"
    }, 1000)
  } else {
    showNotification("Неверный email или пароль", "error")
  }
}

function handleRegister(e) {
  e.preventDefault()

  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirm-password").value

  // Validation
  if (password !== confirmPassword) {
    showNotification("Пароли не совпадают", "error")
    return
  }

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    showNotification("Пользователь с таким email уже существует", "error")
    return
  }

  // Create new user
  const newUser = {
    id: generateId(),
    name,
    email,
    phone,
    password,
    createdAt: new Date().toISOString(),
    isAdmin: false,
  }

  users.push(newUser)
  saveToStorage("users", users)

  // Auto login
  currentUser = newUser
  saveToStorage("currentUser", currentUser)

  showNotification("Регистрация успешна! Добро пожаловать!")

  // Redirect to main page
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1000)
}

function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")
  showNotification("Вы вышли из системы")
  window.location.href = "index.html"
}

// Helper functions
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
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

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

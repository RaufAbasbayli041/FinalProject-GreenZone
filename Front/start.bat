#!/bin/bash

# Скрипт для надежного запуска проекта GreenZone Frontend

echo "🚀 Запуск GreenZone Frontend..."

# Остановка всех процессов Node.js
echo "⏹️ Остановка существующих процессов..."
taskkill /F /IM node.exe 2>nul || echo "Процессы Node.js не найдены"

# Очистка кэша Next.js
echo "🧹 Очистка кэша..."
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

# Установка зависимостей (если нужно)
echo "📦 Проверка зависимостей..."
npm install

# Запуск в безопасном режиме
echo "🔒 Запуск в безопасном режиме (с игнорированием SSL ошибок)..."
npm run dev:insecure

echo "✅ Сервер запущен на http://localhost:3000"


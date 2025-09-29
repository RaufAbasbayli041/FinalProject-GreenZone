# PowerShell скрипт для надежного запуска GreenZone Frontend

Write-Host "🚀 Запуск GreenZone Frontend..." -ForegroundColor Green

# Остановка всех процессов Node.js
Write-Host "⏹️ Остановка существующих процессов..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction Stop | Stop-Process -Force
    Write-Host "✅ Процессы Node.js остановлены" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Процессы Node.js не найдены" -ForegroundColor Blue
}

# Очистка кэша
Write-Host "🧹 Очистка кэша..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Кэш .next очищен" -ForegroundColor Green
}

if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✅ Кэш node_modules очищен" -ForegroundColor Green
}

# Проверка зависимостей
Write-Host "📦 Проверка зависимостей..." -ForegroundColor Yellow
npm install

# Запуск в безопасном режиме
Write-Host "🔒 Запуск в безопасном режиме..." -ForegroundColor Yellow
Write-Host "🌐 Сервер будет доступен на: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 Сеть: http://172.16.1.144:3000" -ForegroundColor Cyan

npm run dev:insecure


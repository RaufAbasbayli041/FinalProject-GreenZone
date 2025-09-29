// Скрипт для очистки localStorage и обновления данных
if (typeof window !== 'undefined') {
  // Очищаем все данные
  localStorage.clear()
  
  // Очищаем sessionStorage
  sessionStorage.clear()
  
  console.log('✅ Все данные очищены! Перезагрузите страницу.')
  
  // Перезагружаем страницу
  window.location.reload()
}


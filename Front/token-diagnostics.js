// Тест для проверки токена в localStorage
console.log('🔍 Диагностика токена в localStorage');

function checkToken() {
  console.log('\n📋 Проверка localStorage:');
  console.log('localStorage keys:', Object.keys(localStorage));
  console.log('localStorage size:', localStorage.length);
  
  const token = localStorage.getItem('auth_token');
  console.log('\n🔑 Проверка токена:');
  console.log('hasToken:', !!token);
  console.log('tokenLength:', token ? token.length : 0);
  
  if (token) {
    console.log('tokenPreview:', token.substring(0, 50) + '...');
    
    try {
      const parts = token.split('.');
      console.log('tokenParts:', parts.length);
      
      if (parts.length === 3) {
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        
        console.log('\n📄 Анализ токена:');
        console.log('header:', header);
        console.log('payload:', payload);
        console.log('userId (sub):', payload.sub);
        console.log('email:', payload.email);
        console.log('role:', payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']);
        console.log('exp:', payload.exp);
        console.log('isExpired:', payload.exp ? payload.exp < Math.floor(Date.now() / 1000) : 'unknown');
      } else {
        console.log('❌ Неверный формат JWT токена');
      }
    } catch (error) {
      console.error('❌ Ошибка парсинга токена:', error);
    }
  } else {
    console.log('❌ Токен не найден в localStorage');
  }
}

function testBasketAPI() {
  console.log('\n🛒 Тест basket API:');
  
  // Импортируем функцию из basket-api
  import('./services/basket-api.js').then(module => {
    console.log('✅ basket-api модуль загружен');
    
    // Тестируем получение корзины
    const testCustomerId = 'test-customer-id';
    console.log('Тестируем getBasketByCustomerId с customerId:', testCustomerId);
    
    module.getBasketByCustomerId(testCustomerId)
      .then(basket => {
        console.log('✅ Корзина получена:', basket);
      })
      .catch(error => {
        console.error('❌ Ошибка получения корзины:', error);
      });
  }).catch(error => {
    console.error('❌ Ошибка загрузки модуля:', error);
  });
}

function clearAndRelogin() {
  console.log('\n🔄 Очистка и повторный логин:');
  
  // Очищаем localStorage
  localStorage.removeItem('auth_token');
  console.log('✅ localStorage очищен');
  
  // Показываем инструкции
  console.log('📝 Инструкции:');
  console.log('1. Перейдите на страницу логина');
  console.log('2. Войдите в систему');
  console.log('3. Проверьте токен снова');
}

// Экспортируем функции для ручного тестирования
window.tokenDiagnostics = {
  checkToken,
  testBasketAPI,
  clearAndRelogin
};

console.log('\n📝 Доступные функции:');
console.log('- tokenDiagnostics.checkToken() - Проверить токен');
console.log('- tokenDiagnostics.testBasketAPI() - Тест basket API');
console.log('- tokenDiagnostics.clearAndRelogin() - Очистить и перелогиниться');

// Автоматически запускаем проверку
checkToken();

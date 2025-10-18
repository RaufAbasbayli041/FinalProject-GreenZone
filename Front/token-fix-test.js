// Тест исправления проблемы с токеном
console.log('🧪 Тест исправления проблемы с токеном');

function testTokenFix() {
  console.log('\n🔍 Проверка текущего состояния:');
  
  // Проверяем localStorage
  const token = localStorage.getItem('auth_token');
  const authState = localStorage.getItem('authState');
  
  console.log('Токен:', token ? '✅ Найден' : '❌ Отсутствует');
  console.log('Состояние авторизации:', authState ? '✅ Найдено' : '❌ Отсутствует');
  
  if (authState) {
    try {
      const parsed = JSON.parse(authState);
      console.log('Пользователь авторизован:', parsed.isAuthenticated ? '✅ Да' : '❌ Нет');
      if (parsed.user) {
        console.log('Данные пользователя:', {
          id: parsed.user.id,
          name: parsed.user.name,
          email: parsed.user.email,
          role: parsed.user.role
        });
      }
    } catch (error) {
      console.error('Ошибка парсинга authState:', error);
    }
  }
  
  // Тестируем создание временного токена
  if (!token && authState) {
    console.log('\n🔧 Тестируем создание временного токена...');
    try {
      const parsed = JSON.parse(authState);
      if (parsed.isAuthenticated && parsed.user) {
        const tempPayload = {
          sub: parsed.user.id || 'temp-user-id',
          email: parsed.user.email || 'temp@example.com',
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role': parsed.user.role || 'Customer',
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 часа
          iat: Math.floor(Date.now() / 1000),
          iss: 'GreenZoneAPI',
          aud: 'GreenZoneClient'
        };
        
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify(tempPayload));
        const signature = btoa('temp-signature');
        const tempToken = `${header}.${payload}.${signature}`;
        
        localStorage.setItem('auth_token', tempToken);
        console.log('✅ Временный токен создан и сохранен');
        console.log('Токен:', tempToken.substring(0, 50) + '...');
        
        return tempToken;
      }
    } catch (error) {
      console.error('Ошибка создания временного токена:', error);
    }
  }
  
  return token;
}

function testBasketAccess() {
  console.log('\n🛒 Тест доступа к корзине:');
  
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.log('❌ Токен отсутствует, корзина недоступна');
    return;
  }
  
  console.log('✅ Токен найден, корзина должна быть доступна');
  console.log('📝 Перейдите на страницу корзины для проверки');
}

function testOrderCreation() {
  console.log('\n📦 Тест создания заказа:');
  
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.log('❌ Токен отсутствует, создание заказа недоступно');
    return;
  }
  
  console.log('✅ Токен найден, создание заказа должно быть доступно');
  console.log('📝 Добавьте товары в корзину и попробуйте создать заказ');
}

function simulateLogin() {
  console.log('\n🔄 Симуляция логина:');
  
  // Создаем тестового пользователя
  const testUser = {
    id: 'test-user-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'Customer'
  };
  
  const authState = {
    user: testUser,
    isAuthenticated: true
  };
  
  // Сохраняем состояние
  localStorage.setItem('authState', JSON.stringify(authState));
  console.log('✅ Состояние авторизации сохранено');
  
  // Создаем токен
  const tempPayload = {
    sub: testUser.id,
    email: testUser.email,
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role': testUser.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 часа
    iat: Math.floor(Date.now() / 1000),
    iss: 'GreenZoneAPI',
    aud: 'GreenZoneClient'
  };
  
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify(tempPayload));
  const signature = btoa('temp-signature');
  const tempToken = `${header}.${payload}.${signature}`;
  
  localStorage.setItem('auth_token', tempToken);
  console.log('✅ Токен создан и сохранен');
  console.log('Токен:', tempToken.substring(0, 50) + '...');
  
  console.log('\n🎉 Симуляция логина завершена!');
  console.log('📝 Теперь вы можете:');
  console.log('1. Перейти в корзину');
  console.log('2. Добавить товары');
  console.log('3. Создать заказ');
}

// Экспортируем функции
window.tokenTest = {
  testTokenFix,
  testBasketAccess,
  testOrderCreation,
  simulateLogin
};

console.log('\n📝 Доступные функции:');
console.log('- tokenTest.testTokenFix() - Проверить исправление токена');
console.log('- tokenTest.testBasketAccess() - Тест доступа к корзине');
console.log('- tokenTest.testOrderCreation() - Тест создания заказа');
console.log('- tokenTest.simulateLogin() - Симуляция логина');

// Автоматически запускаем тест
const token = testTokenFix();
if (token) {
  testBasketAccess();
  testOrderCreation();
} else {
  console.log('\n💡 Токен не найден. Запустите tokenTest.simulateLogin() для тестирования');
}

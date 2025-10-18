// Тест для проверки API и токена
console.log('🌐 Тест API и токена');

async function testAPIWithToken() {
  console.log('\n🔍 Тестирование API с токеном:');
  
  const token = localStorage.getItem('auth_token');
  const API_BASE = 'https://localhost:7100';
  
  console.log('API Base:', API_BASE);
  console.log('Has Token:', !!token);
  
  if (!token) {
    console.log('❌ Токен не найден, пропускаем тест');
    return;
  }
  
  // Тест 1: Простой GET запрос
  try {
    console.log('\n📡 Тест 1: GET /api/Product');
    const response = await fetch(`${API_BASE}/api/Product`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Успешный ответ:', data.length, 'продуктов');
    } else {
      const text = await response.text();
      console.log('❌ Ошибка ответа:', text);
    }
  } catch (error) {
    console.error('❌ Ошибка запроса:', error);
  }
  
  // Тест 2: GET корзины
  try {
    console.log('\n📡 Тест 2: GET /api/Basket/test-customer-id');
    const response = await fetch(`${API_BASE}/api/Basket/test-customer-id`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Корзина получена:', data);
    } else {
      const text = await response.text();
      console.log('❌ Ошибка корзины:', text);
    }
  } catch (error) {
    console.error('❌ Ошибка запроса корзины:', error);
  }
}

async function testTokenValidation() {
  console.log('\n🔐 Тест валидации токена:');
  
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    console.log('❌ Токен не найден');
    return;
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ Неверный формат JWT');
      return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    console.log('Token payload:', payload);
    console.log('Current time:', currentTime);
    console.log('Token exp:', payload.exp);
    console.log('Is expired:', payload.exp ? payload.exp < currentTime : 'unknown');
    
    if (payload.exp && payload.exp < currentTime) {
      console.log('❌ Токен истек');
    } else {
      console.log('✅ Токен действителен');
    }
    
  } catch (error) {
    console.error('❌ Ошибка парсинга токена:', error);
  }
}

function checkNetworkConnectivity() {
  console.log('\n🌐 Проверка сетевого подключения:');
  
  const API_BASE = 'https://localhost:7100';
  
  fetch(`${API_BASE}/api/Product`)
    .then(response => {
      console.log('✅ Сервер доступен, статус:', response.status);
    })
    .catch(error => {
      console.error('❌ Сервер недоступен:', error.message);
      console.log('Возможные причины:');
      console.log('- Сервер не запущен');
      console.log('- Неверный URL');
      console.log('- Проблемы с CORS');
      console.log('- Проблемы с сетью');
    });
}

// Экспортируем функции
window.apiTest = {
  testAPIWithToken,
  testTokenValidation,
  checkNetworkConnectivity
};

console.log('\n📝 Доступные функции:');
console.log('- apiTest.testAPIWithToken() - Тест API с токеном');
console.log('- apiTest.testTokenValidation() - Тест валидации токена');
console.log('- apiTest.checkNetworkConnectivity() - Проверка подключения');

// Автоматически запускаем тесты
testTokenValidation();
checkNetworkConnectivity();

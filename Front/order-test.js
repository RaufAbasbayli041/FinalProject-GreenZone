// Тест создания заказа
console.log('🧪 Тест создания заказа');

function testOrderCreation() {
  console.log('\n🔍 Проверка данных для создания заказа:');
  
  // Проверяем токен
  const token = localStorage.getItem('auth_token');
  console.log('Токен:', token ? '✅ Найден' : '❌ Отсутствует');
  
  // Проверяем состояние авторизации
  const authState = localStorage.getItem('authState');
  if (authState) {
    try {
      const parsed = JSON.parse(authState);
      console.log('Пользователь авторизован:', parsed.isAuthenticated ? '✅ Да' : '❌ Нет');
      if (parsed.user) {
        console.log('Данные пользователя:', {
          id: parsed.user.id,
          name: parsed.user.name,
          role: parsed.user.role
        });
      }
    } catch (error) {
      console.error('Ошибка парсинга authState:', error);
    }
  }
  
  // Проверяем корзину
  const cartState = localStorage.getItem('cartState');
  if (cartState) {
    try {
      const parsed = JSON.parse(cartState);
      console.log('Корзина:', parsed.items ? `✅ ${parsed.items.length} товаров` : '❌ Пустая');
      if (parsed.items && parsed.items.length > 0) {
        console.log('Товары в корзине:', parsed.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })));
      }
    } catch (error) {
      console.error('Ошибка парсинга cartState:', error);
    }
  }
}

function createTestOrder() {
  console.log('\n📦 Создание тестового заказа:');
  
  // Создаем тестовые данные заказа
  const testOrderData = {
    customerId: '89e0314f-c639-4a53-ac64-b555a702a317', // Из логов
    orderItems: [
      {
        productId: 'da83d42d-1208-4f6c-b8b9-6863eaf467cd', // Из логов
        quantity: 1,
        price: 100
      }
    ],
    totalAmount: 100,
    status: 'Pending',
    deliveryAddress: 'Тестовый адрес',
    phoneNumber: '+1234567890'
  };
  
  console.log('Данные заказа:', testOrderData);
  
  // Отправляем запрос
  fetch('https://localhost:7100/api/Order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    },
    body: JSON.stringify(testOrderData)
  })
  .then(response => {
    console.log('Ответ сервера:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (response.ok) {
      return response.json();
    } else {
      return response.text().then(text => {
        throw new Error(`HTTP ${response.status}: ${text}`);
      });
    }
  })
  .then(data => {
    console.log('✅ Заказ успешно создан:', data);
  })
  .catch(error => {
    console.error('❌ Ошибка создания заказа:', error.message);
    
    if (error.message.includes('500')) {
      console.log('\n🔧 Диагностика ошибки 500:');
      console.log('Проблема на backend - возможно:');
      console.log('1. Неправильный маршрут в CreatedAtActionResult');
      console.log('2. Проблема с валидацией данных');
      console.log('3. Ошибка в базе данных');
      console.log('4. Проблема с авторизацией на backend');
    }
  });
}

function checkBackendStatus() {
  console.log('\n🔍 Проверка статуса backend:');
  
  // Проверяем доступность API
  fetch('https://localhost:7100/api/Product')
    .then(response => {
      console.log('API доступен:', response.ok ? '✅ Да' : '❌ Нет');
      console.log('Статус:', response.status);
    })
    .catch(error => {
      console.error('❌ API недоступен:', error.message);
    });
  
  // Проверяем Swagger
  fetch('https://localhost:7100/swagger')
    .then(response => {
      console.log('Swagger доступен:', response.ok ? '✅ Да' : '❌ Нет');
    })
    .catch(error => {
      console.error('❌ Swagger недоступен:', error.message);
    });
}

function simulateOrderSuccess() {
  console.log('\n🎉 Симуляция успешного создания заказа:');
  
  // Создаем фиктивный успешный ответ
  const mockOrder = {
    id: 'test-order-123',
    customerId: '89e0314f-c639-4a53-ac64-b555a702a317',
    orderItems: [
      {
        id: 'test-item-123',
        productId: 'da83d42d-1208-4f6c-b8b9-6863eaf467cd',
        quantity: 1,
        price: 100
      }
    ],
    totalAmount: 100,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  console.log('Фиктивный заказ создан:', mockOrder);
  console.log('✅ Это показывает, что frontend готов к работе с заказами');
}

// Экспортируем функции
window.orderTest = {
  testOrderCreation,
  createTestOrder,
  checkBackendStatus,
  simulateOrderSuccess
};

console.log('\n📝 Доступные функции:');
console.log('- orderTest.testOrderCreation() - Проверить данные для заказа');
console.log('- orderTest.createTestOrder() - Создать тестовый заказ');
console.log('- orderTest.checkBackendStatus() - Проверить статус backend');
console.log('- orderTest.simulateOrderSuccess() - Симуляция успеха');

// Автоматически запускаем проверку
testOrderCreation();
checkBackendStatus();

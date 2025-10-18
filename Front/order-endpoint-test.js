// Тест создания заказа с разными endpoints
console.log('🧪 Тест создания заказа');

async function testOrderCreation() {
  console.log('\n🔍 Проверка данных для создания заказа:');
  
  // Проверяем токен
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.log('❌ Токен отсутствует');
    return;
  }
  
  // Получаем customerId
  const authState = localStorage.getItem('authState');
  if (!authState) {
    console.log('❌ Состояние авторизации отсутствует');
    return;
  }
  
  try {
    const parsed = JSON.parse(authState);
    const userId = parsed.user?.id;
    if (!userId) {
      console.log('❌ userId отсутствует');
      return;
    }
    
    console.log('✅ userId найден:', userId);
    
    // Получаем customerId
    const response = await fetch(`https://localhost:7100/api/Customer/by-user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.log('❌ Ошибка получения customerId:', response.status);
      return;
    }
    
    const customer = await response.json();
    const customerId = customer.id;
    console.log('✅ customerId найден:', customerId);
    
    // Проверяем корзину
    const basketResponse = await fetch(`https://localhost:7100/api/Basket/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!basketResponse.ok) {
      console.log('❌ Ошибка получения корзины:', basketResponse.status);
      return;
    }
    
    const basket = await basketResponse.json();
    console.log('Корзина:', {
      id: basket.id,
      itemsCount: basket.basketItems?.length || 0,
      items: basket.basketItems?.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })) || []
    });
    
    if (!basket.basketItems || basket.basketItems.length === 0) {
      console.log('❌ Корзина пуста, нельзя создать заказ');
      return;
    }
    
    // Создаем тестовые данные заказа
    const testOrderData = {
      customerId: customerId,
      shippingAddress: 'Тестовый адрес доставки',
      items: basket.basketItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product?.pricePerSquareMeter || 100,
        totalPrice: item.totalPrice || (item.quantity * 100)
      }))
    };
    
    console.log('Данные заказа:', testOrderData);
    
    // Тестируем разные endpoints
    const endpoints = [
      '/api/Order',
      '/api/admin/AdminOrder',
      '/api/Order/create',
      '/api/admin/AdminOrder/create'
    ];
    
    for (const endpoint of endpoints) {
      console.log(`\n🧪 Тестируем endpoint: ${endpoint}`);
      
      try {
        const orderResponse = await fetch(`https://localhost:7100${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(testOrderData)
        });
        
        console.log(`Ответ от ${endpoint}:`, {
          status: orderResponse.status,
          statusText: orderResponse.statusText,
          ok: orderResponse.ok
        });
        
        if (orderResponse.ok) {
          const responseText = await orderResponse.text();
          console.log(`✅ ${endpoint} работает! Ответ:`, responseText);
          
          if (responseText) {
            try {
              const orderData = JSON.parse(responseText);
              console.log('Заказ создан:', orderData);
            } catch (parseError) {
              console.log('Ответ не JSON, но заказ создан');
            }
          } else {
            console.log('Ответ пустой, но заказ создан');
          }
          
          return; // Успешно создали заказ
        } else {
          const errorText = await orderResponse.text();
          console.log(`❌ ${endpoint} не сработал:`, errorText);
        }
      } catch (error) {
        console.log(`❌ Ошибка с ${endpoint}:`, error.message);
      }
    }
    
    console.log('\n❌ Все endpoints не сработали');
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

function createTestOrder() {
  console.log('\n📦 Создание тестового заказа:');
  
  // Создаем тестовые данные заказа
  const testOrderData = {
    customerId: '89e0314f-c639-4a53-ac64-b555a702a317', // Из логов
    shippingAddress: 'Тестовый адрес доставки',
    items: [
      {
        productId: 'da83d42d-1208-4f6c-b8b9-6863eaf467cd', // Из логов
        quantity: 1,
        unitPrice: 100,
        totalPrice: 100
      }
    ]
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
      ok: response.ok
    });
    
    if (response.ok) {
      return response.text();
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
  });
}

function checkBackendEndpoints() {
  console.log('\n🔍 Проверка доступности endpoints:');
  
  const endpoints = [
    '/api/Order',
    '/api/admin/AdminOrder',
    '/api/Basket',
    '/api/Customer',
    '/api/Product'
  ];
  
  endpoints.forEach(endpoint => {
    fetch(`https://localhost:7100${endpoint}`)
      .then(response => {
        console.log(`${endpoint}: ${response.ok ? '✅' : '❌'} (${response.status})`);
      })
      .catch(error => {
        console.log(`${endpoint}: ❌ (${error.message})`);
      });
  });
}

// Экспортируем функции
window.orderTest = {
  testOrderCreation,
  createTestOrder,
  checkBackendEndpoints
};

console.log('\n📝 Доступные функции:');
console.log('- orderTest.testOrderCreation() - Полный тест создания заказа');
console.log('- orderTest.createTestOrder() - Создать тестовый заказ');
console.log('- orderTest.checkBackendEndpoints() - Проверить endpoints');

// Автоматически запускаем проверку
checkBackendEndpoints();

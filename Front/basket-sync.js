// Функция для принудительной синхронизации корзины
console.log('🔄 Принудительная синхронизация корзины');

async function syncBasketWithServer() {
  console.log('\n🔍 Проверка состояния корзины:');
  
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
    const response = await fetch(`https://localhost:7100/api/Customer/user/${userId}`, {
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
    
    // Проверяем корзину на сервере
    console.log('\n🛒 Проверка корзины на сервере:');
    const basketResponse = await fetch(`https://localhost:7100/api/Basket/customer/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!basketResponse.ok) {
      console.log('❌ Ошибка получения корзины:', basketResponse.status);
      return;
    }
    
    const serverBasket = await basketResponse.json();
    console.log('Корзина на сервере:', {
      id: serverBasket.id,
      itemsCount: serverBasket.basketItems?.length || 0,
      items: serverBasket.basketItems?.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })) || []
    });
    
    // Проверяем локальную корзину
    console.log('\n📱 Проверка локальной корзины:');
    const cartState = localStorage.getItem('cartState');
    if (cartState) {
      try {
        const parsed = JSON.parse(cartState);
        console.log('Локальная корзина:', {
          itemsCount: parsed.items?.length || 0,
          items: parsed.items?.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })) || []
        });
        
        // Сравниваем корзины
        const serverItemsCount = serverBasket.basketItems?.length || 0;
        const localItemsCount = parsed.items?.length || 0;
        
        console.log('\n📊 Сравнение корзин:');
        console.log('Сервер:', serverItemsCount, 'товаров');
        console.log('Локально:', localItemsCount, 'товаров');
        
        if (serverItemsCount === 0 && localItemsCount > 0) {
          console.log('🔄 Синхронизируем локальную корзину с сервером...');
          
          for (const item of parsed.items) {
            try {
              const addResponse = await fetch(`https://localhost:7100/api/Basket/${customerId}/items`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify([{
                  productId: item.productId,
                  quantity: item.quantity
                }])
              });
              
              if (addResponse.ok) {
                console.log(`✅ Товар ${item.productId} добавлен на сервер`);
              } else {
                console.log(`❌ Ошибка добавления товара ${item.productId}:`, addResponse.status);
              }
            } catch (error) {
              console.error(`❌ Ошибка добавления товара ${item.productId}:`, error);
            }
          }
          
          console.log('✅ Синхронизация завершена');
        } else if (serverItemsCount > 0 && localItemsCount === 0) {
          console.log('🔄 Синхронизируем серверную корзину с локальной...');
          
          // Обновляем локальную корзину
          const updatedCartState = {
            items: serverBasket.basketItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity
            }))
          };
          
          localStorage.setItem('cartState', JSON.stringify(updatedCartState));
          console.log('✅ Локальная корзина обновлена');
        } else if (serverItemsCount === localItemsCount) {
          console.log('✅ Корзины синхронизированы');
        } else {
          console.log('⚠️ Корзины имеют разное количество товаров');
        }
        
      } catch (error) {
        console.error('❌ Ошибка парсинга локальной корзины:', error);
      }
    } else {
      console.log('❌ Локальная корзина отсутствует');
    }
    
  } catch (error) {
    console.error('❌ Ошибка синхронизации:', error);
  }
}

function clearBasket() {
  console.log('\n🧹 Очистка корзины:');
  
  // Очищаем локальную корзину
  localStorage.removeItem('cartState');
  console.log('✅ Локальная корзина очищена');
  
  // Очищаем корзину на сервере
  const token = localStorage.getItem('auth_token');
  const authState = localStorage.getItem('authState');
  
  if (token && authState) {
    try {
      const parsed = JSON.parse(authState);
      const userId = parsed.user?.id;
      
      if (userId) {
        // Получаем customerId
        fetch(`https://localhost:7100/api/Customer/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(customer => {
          const customerId = customer.id;
          
          // Очищаем корзину на сервере
          fetch(`https://localhost:7100/api/Basket/${customerId}/clear`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) {
              console.log('✅ Корзина на сервере очищена');
            } else {
              console.log('❌ Ошибка очистки корзины на сервере:', response.status);
            }
          })
          .catch(error => {
            console.error('❌ Ошибка очистки корзины на сервере:', error);
          });
        })
        .catch(error => {
          console.error('❌ Ошибка получения customerId:', error);
        });
      }
    } catch (error) {
      console.error('❌ Ошибка парсинга authState:', error);
    }
  }
}

function testBasketSync() {
  console.log('\n🧪 Тест синхронизации корзины:');
  
  // Проверяем текущее состояние
  console.log('Текущее состояние:');
  console.log('Токен:', localStorage.getItem('auth_token') ? '✅ Есть' : '❌ Нет');
  console.log('Состояние авторизации:', localStorage.getItem('authState') ? '✅ Есть' : '❌ Нет');
  console.log('Корзина:', localStorage.getItem('cartState') ? '✅ Есть' : '❌ Нет');
  
  // Запускаем синхронизацию
  syncBasketWithServer();
}

// Экспортируем функции
window.basketSync = {
  syncBasketWithServer,
  clearBasket,
  testBasketSync
};

console.log('\n📝 Доступные функции:');
console.log('- basketSync.syncBasketWithServer() - Синхронизировать корзину');
console.log('- basketSync.clearBasket() - Очистить корзину');
console.log('- basketSync.testBasketSync() - Тест синхронизации');

// Автоматически запускаем тест
testBasketSync();

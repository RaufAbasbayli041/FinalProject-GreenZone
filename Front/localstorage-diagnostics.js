// Диагностика localStorage - что именно там находится
console.log('🔍 Детальная диагностика localStorage');

function analyzeLocalStorage() {
  console.log('\n📋 Анализ localStorage:');
  console.log('localStorage.length:', localStorage.length);
  console.log('localStorage keys:', Object.keys(localStorage));
  
  // Проверяем каждый ключ
  Object.keys(localStorage).forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`\n🔑 Ключ: "${key}"`);
    console.log('Длина значения:', value ? value.length : 0);
    console.log('Тип значения:', typeof value);
    
    if (key === 'auth_token') {
      console.log('✅ Найден auth_token!');
      console.log('Значение:', value);
    } else if (key.includes('auth') || key.includes('token') || key.includes('user')) {
      console.log('🔍 Возможно связанный с авторизацией ключ');
      console.log('Значение:', value);
    } else {
      console.log('📄 Обычный ключ');
      console.log('Значение (первые 100 символов):', value ? value.substring(0, 100) + '...' : 'пустое');
    }
  });
  
  // Проверяем, есть ли токен под другим именем
  const possibleTokenKeys = ['token', 'jwt', 'access_token', 'bearer_token', 'authToken'];
  possibleTokenKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`\n🎯 Найден возможный токен под ключом "${key}":`, value.substring(0, 50) + '...');
    }
  });
}

function checkAuthState() {
  console.log('\n🔐 Проверка состояния авторизации:');
  
  // Проверяем сохраненное состояние
  const authState = localStorage.getItem('authState');
  if (authState) {
    try {
      const parsed = JSON.parse(authState);
      console.log('✅ Сохраненное состояние авторизации:', parsed);
    } catch (error) {
      console.log('❌ Ошибка парсинга authState:', error);
    }
  } else {
    console.log('❌ authState не найден в localStorage');
  }
  
  // Проверяем другие возможные ключи для состояния
  const possibleStateKeys = ['user', 'auth', 'session', 'login'];
  possibleStateKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`\n🔍 Найден ключ "${key}":`, value.substring(0, 100) + '...');
    }
  });
}

function simulateLogin() {
  console.log('\n🔄 Симуляция сохранения токена:');
  
  // Создаем тестовый токен
  const testPayload = {
    sub: 'test-user-id',
    email: 'test@example.com',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role': 'Customer',
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 час
    iat: Math.floor(Date.now() / 1000)
  };
  
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify(testPayload));
  const signature = btoa('test-signature');
  const testToken = `${header}.${payload}.${signature}`;
  
  console.log('Тестовый токен создан:', testToken.substring(0, 50) + '...');
  
  // Сохраняем токен
  localStorage.setItem('auth_token', testToken);
  console.log('✅ Тестовый токен сохранен в localStorage');
  
  // Проверяем, что он сохранился
  const savedToken = localStorage.getItem('auth_token');
  console.log('Проверка сохранения:', savedToken ? '✅ Сохранен' : '❌ Не найден');
  
  if (savedToken) {
    console.log('Сохраненный токен:', savedToken.substring(0, 50) + '...');
  }
}

function clearAndTest() {
  console.log('\n🧹 Очистка и тест:');
  
  // Очищаем все связанное с авторизацией
  const keysToRemove = ['auth_token', 'authState', 'user', 'auth', 'session'];
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Удален ключ: ${key}`);
    }
  });
  
  console.log('localStorage после очистки:', Object.keys(localStorage));
}

// Экспортируем функции
window.localStorageDiagnostics = {
  analyzeLocalStorage,
  checkAuthState,
  simulateLogin,
  clearAndTest
};

console.log('\n📝 Доступные функции:');
console.log('- localStorageDiagnostics.analyzeLocalStorage() - Анализ localStorage');
console.log('- localStorageDiagnostics.checkAuthState() - Проверка состояния авторизации');
console.log('- localStorageDiagnostics.simulateLogin() - Симуляция сохранения токена');
console.log('- localStorageDiagnostics.clearAndTest() - Очистка и тест');

// Автоматически запускаем анализ
analyzeLocalStorage();
checkAuthState();

// Скрипт для восстановления токена
console.log('🔧 Восстановление токена');

function restoreToken() {
  console.log('\n🔍 Проверка состояния авторизации:');
  
  // Проверяем состояние авторизации
  const authState = localStorage.getItem('authState');
  if (authState) {
    try {
      const parsed = JSON.parse(authState);
      console.log('Состояние авторизации:', parsed);
      
      if (parsed.isAuthenticated && !localStorage.getItem('auth_token')) {
        console.log('❌ Проблема: пользователь авторизован, но токен отсутствует');
        console.log('🔧 Создаем временный токен для восстановления...');
        
        // Создаем временный токен на основе сохраненного состояния
        const user = parsed.user;
        if (user) {
          const tempPayload = {
            sub: user.id || 'temp-user-id',
            email: user.email || 'temp@example.com',
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role': user.role || 'Customer',
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 час
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
      } else if (parsed.isAuthenticated && localStorage.getItem('auth_token')) {
        console.log('✅ Все в порядке: пользователь авторизован и токен есть');
        return localStorage.getItem('auth_token');
      } else {
        console.log('ℹ️ Пользователь не авторизован');
        return null;
      }
    } catch (error) {
      console.error('❌ Ошибка парсинга состояния авторизации:', error);
    }
  } else {
    console.log('❌ Состояние авторизации не найдено');
  }
  
  return null;
}

function forceReauth() {
  console.log('\n🔄 Принудительная повторная авторизация:');
  
  // Очищаем все данные авторизации
  localStorage.removeItem('auth_token');
  localStorage.removeItem('authState');
  
  console.log('✅ Все данные авторизации очищены');
  console.log('📝 Инструкции:');
  console.log('1. Перейдите на страницу логина');
  console.log('2. Войдите в систему заново');
  console.log('3. Проверьте, что токен сохраняется');
}

function testTokenAfterRestore() {
  console.log('\n🧪 Тест токена после восстановления:');
  
  const token = localStorage.getItem('auth_token');
  if (token) {
    console.log('✅ Токен найден:', token.substring(0, 50) + '...');
    
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('Payload токена:', payload);
        
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp ? payload.exp < currentTime : false;
        
        console.log('Токен действителен:', !isExpired);
        console.log('Истекает через:', payload.exp ? Math.floor((payload.exp - currentTime) / 60) + ' минут' : 'неизвестно');
      }
    } catch (error) {
      console.error('❌ Ошибка парсинга токена:', error);
    }
  } else {
    console.log('❌ Токен не найден');
  }
}

// Экспортируем функции
window.tokenRestore = {
  restoreToken,
  forceReauth,
  testTokenAfterRestore
};

console.log('\n📝 Доступные функции:');
console.log('- tokenRestore.restoreToken() - Восстановить токен');
console.log('- tokenRestore.forceReauth() - Принудительная повторная авторизация');
console.log('- tokenRestore.testTokenAfterRestore() - Тест токена');

// Автоматически пытаемся восстановить токен
const restoredToken = restoreToken();
if (restoredToken) {
  console.log('\n🎉 Токен восстановлен! Тестируем...');
  testTokenAfterRestore();
} else {
  console.log('\n💡 Токен не был восстановлен. Возможно, нужна повторная авторизация.');
}

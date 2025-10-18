// Test script to verify the UserRole fix
console.log('🧪 Testing UserRole Fix in Cart Component');

// Simulate the getUserRoleFromToken function behavior
function simulateGetUserRoleFromToken() {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Ищем роль в правильных местах согласно бэкенду
    const tokenRole = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'] || 
                     payload.role || 
                     payload.roles;
    
    if (tokenRole) {
      if (Array.isArray(tokenRole)) {
        const role = tokenRole.includes('Admin') ? 'Admin' : 'Customer';
        console.log('Роль из массива:', role);
        return role;
      } else {
        const role = tokenRole === 'Admin' || tokenRole === 'admin' ? 'Admin' : 'Customer';
        console.log('Роль из строки:', role);
        return role;
      }
    }
    
    console.log('Роль не найдена в токене, но есть userId - считаем клиентом');
    // Если роль не найдена, но есть userId, считаем клиентом
    if (payload.sub) {
      return 'Customer';
    }
    
    console.log('Роль не найдена в токене');
  } catch (error) {
    console.error('Error parsing token for role:', error);
  }
  
  return null;
}

// Test the role checking logic
function testRoleChecking() {
  console.log('\n🔍 Testing Role Checking Logic');
  
  const testCases = [
    { userRole: 'Customer', customerId: 'test-customer-id', expected: 'allow' },
    { userRole: 'Admin', customerId: 'test-customer-id', expected: 'allow' },
    { userRole: null, customerId: 'test-customer-id', expected: 'allow' },
    { userRole: 'Customer', customerId: null, expected: 'allow' },
    { userRole: 'Admin', customerId: null, expected: 'deny' },
    { userRole: null, customerId: null, expected: 'deny' }
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\nTest Case ${index + 1}:`, testCase);
    
    const { userRole, customerId } = testCase;
    
    // Simulate the cart component logic
    if (userRole !== 'Customer') {
      console.log('Пользователь не имеет роль Customer:', userRole);
      
      if (customerId) {
        console.log('Но есть customerId, разрешаем доступ:', customerId);
        console.log('✅ Result: ALLOW');
      } else {
        console.log('Нет customerId, запрещаем доступ');
        console.log('❌ Result: DENY');
      }
    } else {
      console.log('Пользователь имеет роль Customer, разрешаем доступ');
      console.log('✅ Result: ALLOW');
    }
  });
}

// Test with actual token if available
function testWithActualToken() {
  console.log('\n🔑 Testing with Actual Token');
  
  const userRole = simulateGetUserRoleFromToken();
  console.log('Actual user role from token:', userRole);
  
  if (userRole) {
    console.log('✅ Token parsing successful');
    console.log('Role type:', typeof userRole);
    console.log('Is Customer:', userRole === 'Customer');
  } else {
    console.log('❌ No token or parsing failed');
  }
}

// Export functions for manual testing
window.testRoleFix = {
  testRoleChecking,
  testWithActualToken,
  simulateGetUserRoleFromToken
};

console.log('📝 Test functions available:');
console.log('- testRoleFix.testRoleChecking() - Test role logic');
console.log('- testRoleFix.testWithActualToken() - Test with actual token');
console.log('- testRoleFix.simulateGetUserRoleFromToken() - Get role from token');

// Auto-run tests
testRoleChecking();
testWithActualToken();

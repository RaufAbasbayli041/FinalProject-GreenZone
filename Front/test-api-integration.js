// Test script to verify customer basket and order API integration
// This script can be run in the browser console to test the API endpoints

console.log('🧪 Testing Customer Basket and Order API Integration');

// Test configuration
const API_BASE = 'https://localhost:7100';
const TEST_CUSTOMER_ID = 'test-customer-id'; // Replace with actual customer ID

// Helper function to make API calls
async function testApiCall(endpoint, method = 'GET', body = null) {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
      method,
      headers,
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    console.log(`📡 ${method} ${endpoint}`, body ? { body } : '');
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Success:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    throw error;
  }
}

// Test functions
async function testBasketOperations() {
  console.log('\n🛒 Testing Basket Operations');
  
  try {
    // 1. Get basket
    console.log('\n1. Getting basket...');
    const basket = await testApiCall(`/api/Basket/${TEST_CUSTOMER_ID}`);
    
    // 2. Add item to basket
    console.log('\n2. Adding item to basket...');
    const addItemData = {
      basketId: basket.id || '',
      productId: 'test-product-id', // Replace with actual product ID
      quantity: 2
    };
    await testApiCall(`/api/Basket/${TEST_CUSTOMER_ID}/items`, 'POST', addItemData);
    
    // 3. Update item in basket
    console.log('\n3. Updating item in basket...');
    const updateItemData = {
      productId: 'test-product-id',
      quantity: 3
    };
    await testApiCall(`/api/Basket/${TEST_CUSTOMER_ID}/items`, 'PUT', updateItemData);
    
    // 4. Get updated basket
    console.log('\n4. Getting updated basket...');
    const updatedBasket = await testApiCall(`/api/Basket/${TEST_CUSTOMER_ID}`);
    
    console.log('✅ Basket operations completed successfully');
    return updatedBasket;
  } catch (error) {
    console.error('❌ Basket operations failed:', error);
    throw error;
  }
}

async function testOrderOperations() {
  console.log('\n📦 Testing Order Operations');
  
  try {
    // 1. Create order
    console.log('\n1. Creating order...');
    const orderData = {
      customerId: TEST_CUSTOMER_ID,
      shippingAddress: 'Test Address, Test City',
      items: [
        {
          productId: 'test-product-id',
          quantity: 2,
          unitPrice: 1000,
          totalPrice: 2000
        }
      ]
    };
    const order = await testApiCall('/api/Order', 'POST', orderData);
    
    // 2. Get orders by customer
    console.log('\n2. Getting orders by customer...');
    const orders = await testApiCall(`/api/Order/customer/${TEST_CUSTOMER_ID}`);
    
    // 3. Get order by ID
    console.log('\n3. Getting order by ID...');
    const orderById = await testApiCall(`/api/Order/${order.id}`);
    
    console.log('✅ Order operations completed successfully');
    return order;
  } catch (error) {
    console.error('❌ Order operations failed:', error);
    throw error;
  }
}

async function testCustomerOperations() {
  console.log('\n👤 Testing Customer Operations');
  
  try {
    // 1. Get customer by user ID
    console.log('\n1. Getting customer by user ID...');
    const userId = 'test-user-id'; // Replace with actual user ID
    const customer = await testApiCall(`/api/Customer/by-user/${userId}`);
    
    console.log('✅ Customer operations completed successfully');
    return customer;
  } catch (error) {
    console.error('❌ Customer operations failed:', error);
    throw error;
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting API Integration Tests...');
  
  try {
    // Test customer operations first
    await testCustomerOperations();
    
    // Test basket operations
    const basket = await testBasketOperations();
    
    // Test order operations
    const order = await testOrderOperations();
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('📊 Test Results:', {
      basket: basket ? '✅ Working' : '❌ Failed',
      order: order ? '✅ Working' : '❌ Failed'
    });
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
  }
}

// Export functions for manual testing
window.testApiIntegration = {
  runAllTests,
  testBasketOperations,
  testOrderOperations,
  testCustomerOperations,
  testApiCall
};

console.log('📝 Test functions available:');
console.log('- testApiIntegration.runAllTests() - Run all tests');
console.log('- testApiIntegration.testBasketOperations() - Test basket only');
console.log('- testApiIntegration.testOrderOperations() - Test orders only');
console.log('- testApiIntegration.testCustomerOperations() - Test customer only');
console.log('- testApiIntegration.testApiCall(endpoint, method, body) - Test single API call');

// Auto-run tests if in browser environment
if (typeof window !== 'undefined') {
  console.log('\n🔧 To run tests manually, use: testApiIntegration.runAllTests()');
}

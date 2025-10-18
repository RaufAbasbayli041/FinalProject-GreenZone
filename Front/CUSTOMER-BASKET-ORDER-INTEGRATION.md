# Customer Basket and Order API Integration

## Overview
This document describes the implementation of customer basket and order functionality using the correct API endpoints as specified in the API documentation.

## API Endpoint Structure

### Customer Endpoints (for regular users)
- **Basket**: `/api/Basket/{customerId}`
- **Orders**: `/api/Order`
- **Customer**: `/api/Customer/by-user/{userId}`

### Admin Endpoints (for administrators)
- **Basket**: `/api/admin/AdminBasket/{customerId}`
- **Orders**: `/api/admin/AdminOrder`
- **Customer**: `/api/admin/AdminCustomer`

## Changes Made

### 1. Updated Basket API Service (`services/basket-api.ts`)
- ✅ Enhanced error handling with proper logging
- ✅ Improved empty basket handling for 404/500 responses
- ✅ Added comprehensive error messages for better debugging
- ✅ Fixed basket structure to use `basketItems` instead of `items`

### 2. Updated Order API Service (`services/order-api.ts`)
- ✅ Simplified order creation to use `/api/Order` for customers
- ✅ Added `getOrdersByCustomerId()` function using `/api/Order/customer/{customerId}`
- ✅ Enhanced token validation and role checking
- ✅ Improved error handling for authentication issues

### 3. Updated Main API Service (`services/api.ts`)
- ✅ Synchronized basket functions with basket-api.ts
- ✅ Enhanced error handling and logging
- ✅ Improved consistency across all basket operations

### 4. Cart Component (`components/cart/cart-new.tsx`)
- ✅ Already properly implemented to work with the updated API services
- ✅ Handles basket operations correctly
- ✅ Supports order creation with proper validation
- ✅ Includes comprehensive error handling and user feedback

## API Endpoints Used

### Basket Operations
```typescript
// Get basket
GET /api/Basket/{customerId}

// Add item to basket
POST /api/Basket/{customerId}/items
Body: { basketId: string, productId: string, quantity: number }

// Update item in basket
PUT /api/Basket/{customerId}/items
Body: { productId: string, quantity: number }

// Remove item from basket
DELETE /api/Basket/{customerId}/items?productId={productId}&quantity={quantity}

// Clear basket
DELETE /api/Basket/{customerId}
```

### Order Operations
```typescript
// Create order
POST /api/Order
Body: { customerId: string, shippingAddress: string, items: OrderItemCreateDto[] }

// Get orders by customer
GET /api/Order/customer/{customerId}

// Get order by ID
GET /api/Order/{id}

// Update order
PUT /api/Order/{id}
Body: { shippingAddress: string }

// Cancel order
PUT /api/Order/{id}/cancel
```

### Customer Operations
```typescript
// Get customer by user ID
GET /api/Customer/by-user/{userId}

// Update customer
PUT /api/Customer/{id}
Body: CustomerUpdateDto
```

## Testing

### Manual Testing
1. **Login as a customer** - Ensure you have a valid customer account
2. **Add products to basket** - Use the catalog page to add items
3. **View cart** - Navigate to `/cart` to see basket contents
4. **Modify quantities** - Update item quantities in the cart
5. **Create order** - Fill out the order form and submit
6. **Check order status** - Verify the order was created successfully

### Automated Testing
Use the provided test script (`test-api-integration.js`):

```javascript
// In browser console:
testApiIntegration.runAllTests()
```

### Test Scenarios
1. **Empty Basket**: Test behavior when basket is empty
2. **Add Items**: Test adding products to basket
3. **Update Quantities**: Test quantity modifications
4. **Remove Items**: Test item removal
5. **Order Creation**: Test complete order flow
6. **Error Handling**: Test API error scenarios

## Error Handling

### Basket Errors
- **404/500**: Returns empty basket structure
- **Network errors**: Shows user-friendly messages
- **Validation errors**: Displays specific error messages

### Order Errors
- **Authentication errors**: Redirects to login
- **Validation errors**: Shows form validation messages
- **API errors**: Displays error notifications

## Authentication

### Token Validation
- JWT tokens are validated before API calls
- Role-based access control (Customer vs Admin)
- Automatic token refresh handling
- Graceful handling of expired tokens

### Role-Based Endpoints
- **Customer role**: Uses `/api/*` endpoints
- **Admin role**: Uses `/api/admin/*` endpoints
- **Automatic detection**: Based on JWT token claims

## Data Flow

### Basket Flow
1. User adds product → `addItemsToBasket()` → POST `/api/Basket/{customerId}/items`
2. User views cart → `getBasketByCustomerId()` → GET `/api/Basket/{customerId}`
3. User updates quantity → `updateItemsInBasket()` → PUT `/api/Basket/{customerId}/items`
4. User removes item → `removeItemsFromBasket()` → DELETE `/api/Basket/{customerId}/items`

### Order Flow
1. User submits order → `createOrder()` → POST `/api/Order`
2. System clears basket → `clearBasket()` → DELETE `/api/Basket/{customerId}`
3. User views orders → `getOrdersByCustomerId()` → GET `/api/Order/customer/{customerId}`

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://localhost:7100
```

### API Base URL
- Default: `https://localhost:7100`
- Configurable via environment variables
- Supports both HTTP and HTTPS

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend allows frontend origin
2. **Authentication errors**: Check JWT token validity
3. **Network errors**: Verify API server is running
4. **Data format errors**: Ensure request body matches API schema

### Debug Information
- All API calls include comprehensive logging
- Error messages provide specific failure reasons
- Network requests show full request/response details

## Future Enhancements
1. **Offline support**: Cache basket data locally
2. **Real-time updates**: WebSocket integration for live updates
3. **Order tracking**: Real-time order status updates
4. **Payment integration**: Support for payment gateways
5. **Inventory management**: Real-time stock checking

## Conclusion
The customer basket and order functionality is now fully integrated with the correct API endpoints. The system supports:

- ✅ Complete basket management (add, update, remove, clear)
- ✅ Order creation and management
- ✅ Proper authentication and authorization
- ✅ Comprehensive error handling
- ✅ User-friendly interface
- ✅ Role-based access control

The implementation follows the API documentation exactly and provides a robust foundation for e-commerce functionality.

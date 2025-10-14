// Configuration file for the GreenZone Admin Panel
export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7100',
  
  // App Configuration
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'GreenZone Admin',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Storage Keys
  tokenKey: 'greenzone_token',
  
  // Pagination
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  
  // UI Configuration
  sidebarWidth: 256,
  headerHeight: 64,
  
  // Features
  features: {
    darkMode: true,
    notifications: true,
    export: true,
    fileUpload: true,
  },
  
  // Order Statuses (should match backend)
  orderStatuses: {
    1: { name: 'Новый', color: 'blue' },
    2: { name: 'В обработке', color: 'yellow' },
    3: { name: 'Доставляется', color: 'green' },
    4: { name: 'Доставлен', color: 'green' },
    5: { name: 'Отменен', color: 'red' },
  },
  
  // Delivery Statuses (should match backend)
  deliveryStatuses: {
    1: { name: 'Подготовка', color: 'blue' },
    2: { name: 'В пути', color: 'yellow' },
    3: { name: 'Доставлен', color: 'green' },
    4: { name: 'Возврат', color: 'red' },
  },
};

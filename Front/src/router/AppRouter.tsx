import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Auth
import { AuthProvider } from '../auth/AuthProvider';

// Layouts
import { AdminLayout } from '../layout/AdminLayout';

// Protected Routes
import { ProtectedRoute, AdminRoute } from '../components/ProtectedRoute';

// Public Pages
import { Login } from './ui/Login';

// Admin Pages
import { AdminDashboard } from './admin/AdminDashboard';
import { OrdersList } from './admin/OrdersList';
import { OrderCreate } from './admin/OrderCreate';
import { OrderView } from './admin/OrderView';
import { ProductsList } from './admin/ProductsList';
import { ProductCreate } from './admin/ProductCreate';
import { CustomersList } from './admin/CustomersList';
import { CustomerView } from './admin/CustomerView';
import { CategoriesList } from './admin/CategoriesList';
import { CategoryCreate } from './admin/CategoryCreate';
import { DeliveriesList } from './admin/DeliveriesList';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppRouter: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            
            {/* Orders */}
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminLayout>
                  <OrdersList />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/orders/create" element={
              <AdminRoute>
                <AdminLayout>
                  <OrderCreate />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/orders/:id" element={
              <AdminRoute>
                <AdminLayout>
                  <OrderView />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/orders/:id/edit" element={
              <AdminRoute>
                <AdminLayout>
                  <OrderCreate />
                </AdminLayout>
              </AdminRoute>
            } />
            
            {/* Products */}
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminLayout>
                  <ProductsList />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/products/create" element={
              <AdminRoute>
                <AdminLayout>
                  <ProductCreate />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/products/:id" element={
              <AdminRoute>
                <AdminLayout>
                  <ProductCreate />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/products/:id/edit" element={
              <AdminRoute>
                <AdminLayout>
                  <ProductCreate />
                </AdminLayout>
              </AdminRoute>
            } />
            
            {/* Customers */}
            <Route path="/admin/customers" element={
              <AdminRoute>
                <AdminLayout>
                  <CustomersList />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/customers/:id" element={
              <AdminRoute>
                <AdminLayout>
                  <CustomerView />
                </AdminLayout>
              </AdminRoute>
            } />
            
            {/* Categories */}
            <Route path="/admin/categories" element={
              <AdminRoute>
                <AdminLayout>
                  <CategoriesList />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/categories/create" element={
              <AdminRoute>
                <AdminLayout>
                  <CategoryCreate />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/categories/:id/edit" element={
              <AdminRoute>
                <AdminLayout>
                  <CategoryCreate />
                </AdminLayout>
              </AdminRoute>
            } />
            
            {/* Deliveries */}
            <Route path="/admin/deliveries" element={
              <AdminRoute>
                <AdminLayout>
                  <DeliveriesList />
                </AdminLayout>
              </AdminRoute>
            } />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

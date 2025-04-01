import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from 'use-shopping-cart';
import { Homepage } from './components/Homepage';
import { Chat } from './components/Chat';
import { AdminPanel } from './admin/AdminPanel';
import { AuthLayout } from './components/AuthLayout';
import { Dashboard } from './components/Dashboard';
import { ContactForm } from './components/ContactForm';
import { FloatingChat } from './components/FloatingChat';
import { ProductsPage } from './components/ProductsPage';
import { ServicesPage } from './components/ServicesPage';
import { useAuth } from './lib/auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brick-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <CartProvider
      mode="payment"
      cartMode="client-only"
      stripe={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
      successUrl={`${window.location.origin}/success`}
      cancelUrl={`${window.location.origin}/products`}
      currency="USD"
      allowedCountries={['US']}
      billingAddressCollection={true}
    >
      <BrowserRouter>
        <div className="min-h-screen bg-surface-50">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/demo/bff" element={<Chat />} />
            <Route path="/auth/*" element={<AuthLayout />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/services" element={<ServicesPage />} />
            
            {/* Protected Routes */}
            <Route path="/admin/*" element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            } />
            <Route path="/dashboard/*" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
          </Routes>
          
          {/* Chat Widget */}
          <FloatingChat />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
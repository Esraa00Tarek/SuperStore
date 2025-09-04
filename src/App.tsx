import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Crafts from "./pages/Crafts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import ForgotPassword from "./pages/admin/ForgotPassword";
import Profile from "./pages/admin/Profile";
import ProductsPage from "./pages/admin/ProductsPage";
import CraftsPage from "./pages/admin/CraftsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import ContactManagerPage from "./pages/admin/ContactManagerPage";
import WhatsAppNumbersPage from "./pages/admin/WhatsAppNumbersPage";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

const queryClient = new QueryClient();

const AppContent = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<Products />} />
      <Route path="/crafts" element={<Crafts />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        {/* Public routes */}
        <Route index element={
          <Navigate to="/admin/dashboard" replace />
        } />
        <Route path="login" element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="forgot-password" element={
          <ProtectedRoute requireAuth={false}>
            <ForgotPassword />
          </ProtectedRoute>
        } />
        
        {/* Protected admin routes */}
        <Route element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="crafts" element={<CraftsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="contacts" element={<ContactManagerPage />} />
          <Route path="whatsapp" element={<WhatsAppNumbersPage />} />
        </Route>
      </Route>
      
      {/* 404 - Keep this last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

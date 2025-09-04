import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean; // If false, will redirect to /admin if user is already authenticated
}

const ProtectedRoute = ({ children, requireAdmin = false, requireAuth = true }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Handle public routes (like login page)
  if (!requireAuth) {
    // If user is already authenticated, redirect to products page
    if (currentUser) {
      return <Navigate to="/admin/products" replace />;
    }
    // For non-authenticated users, allow access to public routes
    return <>{children}</>;
  }

  // Handle protected routes
  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check for admin role if required
  if (requireAdmin) {
    // Here you would check if the user has admin role
    // For now, we'll just check if the user exists
    return <>{children}</>;
  }
  
  // Render the children or the outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

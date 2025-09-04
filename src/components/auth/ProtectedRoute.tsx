import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they log in, which is a nicer user experience.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

import { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Cleanup function for effects
  useEffect(() => {
    return () => {
      // Proper cleanup if needed
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
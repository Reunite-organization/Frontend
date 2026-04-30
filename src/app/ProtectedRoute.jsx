import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './providers/AuthProvider';
import { LoadingSkeleton } from '../features/wanted/components/shared/LoadingSkeleton';
export const ProtectedRoute = () => {
  const context = useContext(AuthContext);
  const location = useLocation();

  if (!context) {
    throw new Error("ProtectedRoute must be used within an AuthProvider");
  }

  const { isAuthenticated, isLoading } = context;

  if (isLoading) return <div><LoadingSkeleton/></div>; 

  return isAuthenticated 
    ? <Outlet /> 
    : (
      <Navigate
        to={`/auth/login?redirect=${encodeURIComponent(
          `${location.pathname}${location.search}${location.hash}`,
        )}`}
        state={{ from: location }}
        replace
      />
    );
};

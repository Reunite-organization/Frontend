import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { normalizeRole } from "../lib/authRoles";

const hasRequiredRole = (userRole, roles) => {
  if (!roles || roles.length === 0) return true;
  const currentRole = normalizeRole(userRole);
  return roles.map(normalizeRole).includes(currentRole);
};

export const RoleRoute = ({ roles = [], fallbackPath = "/" }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole(user?.role, roles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => (
  <RoleRoute roles={["ADMIN", "COORDINATOR"]} fallbackPath="/cases" />
);

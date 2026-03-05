import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * AdminRoute - Requires authentication + ADMIN role.
 * - Loading: show spinner
 * - Not authenticated or not admin: redirect to /
 * - Admin: render children
 */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const roleName = typeof user?.role === 'string' ? user.role : user?.role?.name;
  if (roleName?.toUpperCase() !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

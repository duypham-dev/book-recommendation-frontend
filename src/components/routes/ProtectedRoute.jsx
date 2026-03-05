import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * ProtectedRoute - Requires authentication.
 * - Loading: show spinner (wait for auth to resolve)
 * - Not authenticated: redirect to /
 * - Admin: redirect to /admin
 * - Regular user: render children
 */
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const roleName = typeof user?.role === 'string' ? user.role : user?.role?.name;
  if (roleName?.toUpperCase() === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
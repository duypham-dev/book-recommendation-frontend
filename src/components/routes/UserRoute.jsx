import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * UserRoute - Public pages accessible by guests & regular users.
 * Admin users are redirected to /admin.
 * No loading spinner needed — public content renders immediately.
 */
const UserRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const roleName = typeof user?.role === 'string' ? user.role : user?.role?.name;
    if (roleName?.toUpperCase() === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
};

export default UserRoute;

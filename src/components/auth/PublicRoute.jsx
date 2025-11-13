import { Navigate } from 'react-router-dom';
import useAuth from '../../firebaseServices/auth/useAuth';

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <></>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;

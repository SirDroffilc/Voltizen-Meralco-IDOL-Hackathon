import { Navigate } from 'react-router-dom';
import useAuth from '../../firebaseServices/auth/useAuth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // create a loading spinner here 
    return <></>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

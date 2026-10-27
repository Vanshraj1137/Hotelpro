import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, staff = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="container py-5"><div className="spinner-border text-secondary" /></div>;
  // remember where the user wanted to go so Login can send them back
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (staff && user.role === 'guest') return <Navigate to="/" replace />;
  return children;
}

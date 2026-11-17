import { Navigate } from 'react-router-dom';
import { isAdmin } from '../api/auth';

export default function AdminRoute({ children }) {
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
}
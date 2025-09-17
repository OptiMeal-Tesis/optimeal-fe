import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function PublicRoute({ children, redirectTo = "/home" }: PublicRouteProps) {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    // Redirect to home page if already authenticated
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

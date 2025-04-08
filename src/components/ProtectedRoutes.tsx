import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../store/features/auth/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode; // Standard prop name for component children
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    // User not authenticated, redirect to login page
    // 'replace' prevents adding the dashboard URL to history when not logged in
    console.log('ProtectedRoute: User not authenticated, redirecting to login.');
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the child components
  return <>{children}</>; // Render the wrapped component (e.g., DashboardPage)
}

export default ProtectedRoute;

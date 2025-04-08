import React, { useEffect } from 'react'; // Added useEffect for potential redirect logic
import { useNavigate } from 'react-router-dom'; // Added Navigate
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout, selectCurrentUser, selectIsAuthenticated } from '../store/features/auth/authSlice';

function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    console.log("Dispatching logout action from Dashboard.");
    dispatch(logout());
    // Optional: Clear any specific localStorage items if needed on manual logout
    // localStorage.removeItem('someSessionItem');
    navigate('/', { replace: true }); // Navigate back to login
  };

  // Basic in-component route protection
  useEffect(() => {
      // If checking after render and not authenticated, redirect
      // A ProtectedRoute component is cleaner for preventing render altogether
      if (!isAuthenticated) {
          console.log("Not authenticated on Dashboard, redirecting...");
          navigate('/', { replace: true, state: { message: 'You must be logged in to view the dashboard.' } });
      }
  }, [isAuthenticated, navigate]); // Re-run if auth state or navigate function changes


  // Alternatively, use the Navigate component for declarative redirect before rendering content:
  // if (!isAuthenticated) {
  //     return <Navigate to="/" replace state={{ message: 'You must be logged in to view the dashboard.' }} />;
  // }

  // Render content only if authenticated (avoids flicker during redirect)
  if (!isAuthenticated) {
      return null; // Or a loading indicator
  }


  return (
    <div className="card p-4 shadow-sm">
      <h1 className="h3 mb-0">Dashboard</h1>
      {currentUser ? (
        <>
        <p>Welcome back, <strong>{currentUser.name}</strong>!</p>
        <p className="text-muted">Email: {currentUser.email}</p> {/* Muted text */}
      </>
      ) : (
        <p>Welcome!</p> // Should ideally not happen if isAuthenticated is true
      )}
      <p>This is  protected dashboard area.</p>
      {/* We will add session expiry info display later */}

      <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
      
    </div>
  );
}
export default DashboardPage;
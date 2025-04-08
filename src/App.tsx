import { useEffect, useRef } from 'react'; // Import useEffect, useRef
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoutes'; // Import ProtectedRoute
import { useAppSelector, useAppDispatch } from './store/hooks'; // Import hooks
import { logout, selectIsAuthenticated, selectSessionExpiry } from './store/features/auth/authSlice'; // Import actions/selectors
import './App.css';
import Layout from './components/Layout';

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sessionExpiresAt = useAppSelector(selectSessionExpiry);
  const timerIdRef = useRef<number | null>(null); // Use ref to store timer ID across renders

  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, sessionExpiresAt });

    // Clear any existing timer if auth state changes
    if (timerIdRef.current) {
       console.log("Clearing previous timer:", timerIdRef.current);
       clearTimeout(timerIdRef.current);
       timerIdRef.current = null;
    }

    if (isAuthenticated && sessionExpiresAt) {
      const now = Date.now();
      const delay = sessionExpiresAt - now;
      console.log(`Session expires at: ${new Date(sessionExpiresAt).toLocaleTimeString()}, Current time: ${new Date(now).toLocaleTimeString()}, Delay: ${delay}ms`);

      if (delay > 0) {
        // User is logged in, session is not yet expired, set the timer
        timerIdRef.current = window.setTimeout(() => {
          console.log("Session timer expired! Dispatching logout.");
          // Dispatch logout (we'll add navigation with message later)
          dispatch(logout());
          // Note: Navigation should ideally happen here too
          timerIdRef.current = null; // Clear ref after timer fires
        }, delay);
        console.log("Set new session expiry timer. ID:", timerIdRef.current, "Delay:", delay);
      } else {
        // Session already expired when this effect ran (e.g., maybe on load with persisted state)
         console.log("Session already expired. Dispatching logout immediately.");
         dispatch(logout()); // Log out immediately
      }
    }

    // Cleanup function: Clears the timer if the component unmounts
    // or if dependencies change causing the effect to re-run *before* the timer fires.
    return () => {
      if (timerIdRef.current) {
        console.log("Effect cleanup: Clearing timer:", timerIdRef.current);
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
    // Dependencies: Re-run effect if auth status or expiry time changes, or dispatch changes
  }, [isAuthenticated, sessionExpiresAt, dispatch]);

  return (
    <div className="App">
      {/* Routes setup remains the same */}
      <Layout>
        {/* You could add a Navbar here later */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
      </Layout>
      {/* You could add a Footer here later */}
    </div>
  );
}

export default App;

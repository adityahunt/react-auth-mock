import { useEffect, useRef } from 'react'; 
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoutes'; 
import { useAppSelector, useAppDispatch } from './store/hooks';
import { logout, selectIsAuthenticated, selectSessionExpiry } from './store/features/auth/authSlice';
import './App.css';
import Layout from './components/Layout';

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sessionExpiresAt = useAppSelector(selectSessionExpiry);
  const timerIdRef = useRef<number | null>(null); 

  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, sessionExpiresAt });

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
        timerIdRef.current = window.setTimeout(() => {
          console.log("Session timer expired! Dispatching logout.");
          dispatch(logout());
          timerIdRef.current = null;
        }, delay);
        console.log("Set new session expiry timer. ID:", timerIdRef.current, "Delay:", delay);
      } else {
         console.log("Session already expired. Dispatching logout immediately.");
         dispatch(logout());
      }
    }

    return () => {
      if (timerIdRef.current) {
        console.log("Effect cleanup: Clearing timer:", timerIdRef.current);
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [isAuthenticated, sessionExpiresAt, dispatch]);

  return (
    <div className="App">
      <Layout>
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
    </div>
  );
}

export default App;

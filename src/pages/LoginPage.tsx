import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/features/auth/authSlice';

// Define type for stored credentials (can be shared or redefined)
interface StoredUserCredentials {
  email: string;
  password: string; // MOCK - Insecure
  name: string;
}

// Key for localStorage (should match SignupPage)
const USERS_STORAGE_KEY = "registeredUsers";

// Helper function to load users (could be moved to a utils file)
const getStoredUsers = (): StoredUserCredentials[] => {
    const storedUsersString = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsersString) {
      try {
        // Basic validation: Ensure it's likely an array before parsing fully
        if (storedUsersString.trim().startsWith('[')) {
            const parsedUsers = JSON.parse(storedUsersString);
             if (Array.isArray(parsedUsers)) {
                // Optionally add more validation per user object if needed
                return parsedUsers as StoredUserCredentials[];
            } else {
                 console.error("Stored 'registeredUsers' is not an array. Resetting.");
            }
        } else {
             console.error("Stored 'registeredUsers' does not look like an array string. Resetting.");
        }
        // If parsing failed or wasn't an array, remove the invalid item
        localStorage.removeItem(USERS_STORAGE_KEY);
        return [];
      } catch (e) {
        console.error("Failed to parse stored users:", e);
        localStorage.removeItem(USERS_STORAGE_KEY); // Remove corrupted data
        return [];
      }
    }
    return []; // Return empty array if nothing is stored
  };


function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation(); // Get location object
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // Renamed state variable for clarity - holds message from navigation
    const [navigationMessage, setNavigationMessage] = useState<string | null>(null);

  // Check for messages passed via navigation state (e.g., from auto-logout)
  useEffect(() => {
    // Check if location.state exists and has a 'message' property of type string
    if (location.state && typeof location.state.message === 'string') {
        console.log("LoginPage Effect: Message received from navigation state:", location.state.message);
        setNavigationMessage(location.state.message);

        // OPTIONAL BUT RECOMMENDED: Clear the state from history after reading it.
        // This prevents the message from sticking around if the user navigates
        // back/forward in history without a page refresh.
        // It won't stop the message disappearing on a manual refresh (F5).
        const stateWithoutMessage = { ...location.state };
        delete stateWithoutMessage.message; // Remove the message property
        navigate(location.pathname, { replace: true, state: stateWithoutMessage });

    } else {
        // If no message is found in the state on subsequent renders/navigation,
        // ensure the local message state is cleared (if it wasn't already).
        if (navigationMessage !== null) {
            console.log("LoginPage Effect: No message found in navigation state, clearing local message.");
            setNavigationMessage(null);
        }
    }
    // Dependency: Re-run this effect if the location.state object reference changes.
  }, [location.state, navigate, navigationMessage]); // Added navigationMessage to dependencies to handle clearing correctly

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setNavigationMessage(null); // Clear navigation message on new login attempt

    const storedUsers = getStoredUsers();

    // Find user by email AND password (INSECURE MOCK COMPARISON)
    const foundUser = storedUsers.find(
      user => user.email === email && user.password === password
    );

    if (foundUser) {
      console.log('Login successful for:', foundUser.email);
      const userPayload = { name: foundUser.name, email: foundUser.email };
      const expiryTime = Date.now() + 10*60 * 1000; // 10 minutes session

      dispatch(login({ user: userPayload, expiresAt: expiryTime }));
      navigate('/dashboard', { replace: true });

    } else {
      console.log('Login failed for email:', email);
      setError('Invalid email or password.');
    }
    setPassword(''); // Clear password field regardless of outcome
  };

   // Clear navigation/error message when user types in email/password fields
   const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (navigationMessage) setNavigationMessage(null); // Clear nav message on interaction
    if (error) setError(''); // Also clear regular errors
   }

  return (
    <div className="card p-4 shadow-sm">
      <h1 className="text-center mb-4">Login</h1>
      {/* Display navigation message if present */}
      {navigationMessage && <div className="alert alert-warning" role="alert" >{navigationMessage}</div>}
      {/* Display login error message if present */}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <form onSubmit={handleLogin}>
         {/* Use handleInputChange for inputs */}
         <div className="mb-3">
            <label htmlFor="loginEmail" className='form-label'>Email:</label>
            <input
                type="email" className="form-control" id="loginEmail" value={email}
                onChange={(e) => handleInputChange(setEmail, e.target.value)} required 
            />
         </div>
         <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label">Password:</label>
            <input
                type="password" className="form-control" id="loginPassword" value={password}
                onChange={(e) => handleInputChange(setPassword, e.target.value)} required
            />
        </div>
        {/* Optional: Add remember me checkbox if desired */}
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="rememberMe" />
          <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
        </div>
        <div className="d-grid"> {/* Make button full width */}
          <button type="submit" className="btn btn-primary"> {/* Primary button styling */}
            Log In
          </button>
        </div>
      </form>
      <p className="mt-3 text-center"> {/* Margin top and center text */}
        Don't have an account? <Link to="/signup">Sign Up Here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
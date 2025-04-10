import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/features/auth/authSlice';

interface StoredUserCredentials {
  email: string;
  password: string;
  name: string;
}

const USERS_STORAGE_KEY = "registeredUsers";

const getStoredUsers = (): StoredUserCredentials[] => {
    const storedUsersString = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsersString) {
      try {
        if (storedUsersString.trim().startsWith('[')) {
            const parsedUsers = JSON.parse(storedUsersString);
             if (Array.isArray(parsedUsers)) {
                return parsedUsers as StoredUserCredentials[];
            } else {
                 console.error("Stored 'registeredUsers' is not an array. Resetting.");
            }
        } else {
             console.error("Stored 'registeredUsers' does not look like an array string. Resetting.");
        }
        localStorage.removeItem(USERS_STORAGE_KEY);
        return [];
      } catch (e) {
        console.error("Failed to parse stored users:", e);
        localStorage.removeItem(USERS_STORAGE_KEY);
        return [];
      }
    }
    return [];
  };

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [navigationMessage, setNavigationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && typeof location.state.message === 'string') {
        setNavigationMessage(location.state.message);
        const stateWithoutMessage = { ...location.state };
        delete stateWithoutMessage.message;
        navigate(location.pathname, { replace: true, state: stateWithoutMessage });
    } else {
        if (navigationMessage !== null) {
            setNavigationMessage(null);
        }
    }
  }, [location.state, navigate, navigationMessage]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNavigationMessage(null);

    const storedUsers = getStoredUsers();

    const foundUser = storedUsers.find(
      user => user.email === email && user.password === password
    );

    if (foundUser) {
      const userPayload = { name: foundUser.name, email: foundUser.email };
      const expiryTime = Date.now() + 10*60 * 1000;

      dispatch(login({ user: userPayload, expiresAt: expiryTime }));
      navigate('/dashboard', { replace: true });

    } else {
      setError('Invalid email or password.');
    }
    setPassword('');
  };

   const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (navigationMessage) setNavigationMessage(null);
    if (error) setError('');
   }

  return (
    <div className="card p-4 shadow-sm">
      <h1 className="text-center mb-4">Login</h1>
      {navigationMessage && <div className="alert alert-warning" role="alert" >{navigationMessage}</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <form onSubmit={handleLogin}>
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
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="rememberMe" />
          <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </div>
      </form>
      <p className="mt-3 text-center">
        Don't have an account? <Link to="/signup">Sign Up Here</Link>
      </p>
    </div>
  );
}

export default LoginPage;

import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";

interface StoredUserCredentials {
    email: string;
    password: string;
    name: string;
}

const USERS_STORAGE_KEY = "registeredUsers";

function SignupPage(){
  console.log('Hello from SignupPage component!');
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getStoredUsers=():StoredUserCredentials[]=>{
    const storedUsersString=localStorage.getItem(USERS_STORAGE_KEY);
    if(storedUsersString){
      try{
        return JSON.parse(storedUsersString) as StoredUserCredentials[];
      }catch(e){
        console.error("Failed to parse stored users:", e);
        localStorage.removeItem(USERS_STORAGE_KEY);
        return [];
      }
    }
    return [];
  };

  const handleSignup=(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setError('');
    setSuccessMessage('');
  if(!name || !email || !password || !confirmPassword){
    setError('All fields are required');
    return;
  }
  if(password !== confirmPassword){
    setError('Passwords do not match');
    return;
  }
  const storedUsers = getStoredUsers();
  const userExists = storedUsers.some(user => user.email === email);
  if(userExists){
    setError('An account with this email already exists');
    return;
  }
  const newUser: StoredUserCredentials = { email, password, name };

  const updatedUsers = [...storedUsers, newUser];
  try{
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    console.log('User registered successfully and stored:', newUser);
    setSuccessMessage('User registered successfully! Redirecting to login...');

    setTimeout(() => {
      navigate('/'); 
    },  1500); 
  }
  catch(e){
    console.error('Failed to save user to local Storage:', e);
    setError('Signup failed. Could not save user data.');
  }
};
  return (
    <div className="card p-4 shadow-sm">
      <h1 className="text-center mb-4">Sign Up</h1>
      {error && <div className="alert alert-warning" role="alert" >{error}</div>}
      {successMessage && <div className="alert alert-warning" role="alert" >{successMessage}</div>}
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name:</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-grid">

        <button type="submit" className="btn btn-success" disabled={!!successMessage}>Sign Up</button>
        </div>
      </form>
      <p className="mt-3 text-center">
        Already have an account? <Link to="/">Log In</Link>
      </p>
    </div>
  );
}
export default SignupPage;

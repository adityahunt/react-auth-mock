import { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
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
    navigate('/', { replace: true }); 
  };

  useEffect(() => {
      if (!isAuthenticated) {
          console.log("Not authenticated on Dashboard, redirecting...");
          navigate('/', { replace: true, state: { message: 'You must be logged in to view the dashboard.' } });
      }
  }, [isAuthenticated, navigate]); 



  if (!isAuthenticated) {
      return null; 
  }


  return (
    <div className="card p-4 shadow-sm">
      <h1 className="h3 mb-0">Dashboard</h1>
      {currentUser ? (
        <>
        <p>Welcome back, <strong>{currentUser.name}</strong>!</p>
        <p className="text-muted">Email: {currentUser.email}</p> 
      </>
      ) : (
        <p>Welcome!</p> 
      )}
      <p>This is  protected dashboard area.</p>

      <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
      
    </div>
  );
}
export default DashboardPage;
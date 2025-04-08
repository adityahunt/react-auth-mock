import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../index'; // Import RootState for selector typing later

// Define the type for the user information
interface UserInfo {
  name: string;
  email: string;
  // Add other relevant user fields if needed
}

// Define the shape of the authentication state slice
interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  sessionExpiresAt: number | null; // Store expiry time as a timestamp (milliseconds)
  // Could add loading/error states here too
  // isLoading: boolean;
  // error: string | null;
}

// Define the initial state for this slice
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  sessionExpiresAt: null,
  // isLoading: false,
  // error: null,
};

// Define the payload type for the login action
interface LoginPayload {
    user: UserInfo;
    expiresAt: number;
}

export const authSlice = createSlice({
  name: 'auth', // Name of the slice
  initialState, // Initial state object
  // Reducers define how the state can be updated
  reducers: {
    // Action: 'auth/login'
    // Reducer function for handling the login action
    login: (state, action: PayloadAction<LoginPayload>) => {
      // Immer allows direct "mutation" here
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.sessionExpiresAt = action.payload.expiresAt;
      // state.isLoading = false;
      // state.error = null;
      console.log("Login reducer executed. New state:", JSON.parse(JSON.stringify(state))); // Log immutable state
    },
    // Action: 'auth/logout'
    // Reducer function for handling the logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.sessionExpiresAt = null;
      // state.isLoading = false;
      // state.error = null; // Clear errors on logout too
      console.log("Logout reducer executed.");
    },
     // Could add reducers for loginStart, loginFailure etc.
    // loginStart: (state) => { state.isLoading = true; state.error = null;},
    // loginFailure: (state, action: PayloadAction<string>) => { /* handle error */ }
  },
});

// Export the auto-generated action creators
// Components will import these to dispatch actions
export const { login, logout } = authSlice.actions;

// Optional: Selectors - Functions to easily select data from this slice's state
// Components can use these with useSelector hook
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState): UserInfo | null => state.auth.user;
export const selectSessionExpiry = (state: RootState): number | null => state.auth.sessionExpiresAt;

// Export the reducer function for this slice
// This will be imported into the main store configuration
export default authSlice.reducer;
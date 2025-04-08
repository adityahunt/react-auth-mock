import { configureStore } from '@reduxjs/toolkit';
// Import the reducer from the auth slice
import authReducer from './features/auth/authSlice'; // Corrected path

export const store = configureStore({
  reducer: {
    // Add the auth reducer to the store under the 'auth' key
    auth: authReducer,
    // other reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
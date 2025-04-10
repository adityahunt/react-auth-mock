import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../index';

interface UserInfo {
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  sessionExpiresAt: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  sessionExpiresAt: null,
};

interface LoginPayload {
  user: UserInfo;
  expiresAt: number;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.sessionExpiresAt = action.payload.expiresAt;
      console.log("Login reducer executed. New state:", JSON.parse(JSON.stringify(state)));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.sessionExpiresAt = null;
      console.log("Logout reducer executed.");
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState): UserInfo | null => state.auth.user;
export const selectSessionExpiry = (state: RootState): number | null => state.auth.sessionExpiresAt;

export default authSlice.reducer;

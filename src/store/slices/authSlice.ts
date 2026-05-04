import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "../../types";

const storedToken = localStorage.getItem("dash-token");
const storedUser = localStorage.getItem("dash-user");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      console.log("action.payload ", action.payload);
      localStorage.setItem("dash-token", action.payload.accessToken);
      localStorage.setItem("dash-user", JSON.stringify(action.payload.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("dash-token");
      localStorage.removeItem("dash-user");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setLoading } =
  authSlice.actions;
export default authSlice.reducer;

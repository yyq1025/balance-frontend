import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authData: JSON.parse(localStorage.getItem("profile") || "null"),
  },
  reducers: {
    auth: (state, action: PayloadAction<any>) => {
      localStorage.setItem("profile", JSON.stringify(action.payload));
      state.authData = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("profile");
      state.authData = null;
    },
  },
});

export const { auth, logout } = authSlice.actions;

export const selectAuthData = (state: RootState) => state.auth.authData;

export default authSlice.reducer;

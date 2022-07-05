import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { message } from "antd";
import * as api from "../api";
import type { NavigateFunction } from "react-router-dom";
import type { RootState } from "../app/store";

interface Auth {
  email: string;
  token: string;
}

interface LoginArgs {
  values: any;
  navigate: NavigateFunction;
}

export const login = createAsyncThunk<Auth, LoginArgs, { rejectValue: string }>(
  "auth/login",
  async ({ values, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.login(values);
      navigate("/account/balances", { replace: true });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<any>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue(err.message);
      }
    }
  }
);

interface RegisterArgs {
  values: any;
  navigate: NavigateFunction;
}

export const register = createAsyncThunk<
  Auth,
  RegisterArgs,
  { rejectValue: string }
>("auth/register", async ({ values, navigate }, { rejectWithValue }) => {
  try {
    const response = await api.register(values);
    navigate("/account/balances", { replace: true });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    if (err.response?.data) {
      return rejectWithValue(err.response.data.message);
    } else {
      return rejectWithValue(err.message);
    }
  }
});

interface resetArgs {
  values: any;
  navigate: NavigateFunction;
}

export const reset = createAsyncThunk<void, resetArgs, { rejectValue: string }>(
  "auth/reset",
  async ({ values, navigate }, { rejectWithValue }) => {
    try {
      await api.reset(values);
      navigate("/login");
    } catch (error) {
      const err = error as AxiosError<any>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue(err.message);
      }
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authData: JSON.parse(localStorage.getItem("profile") || "null"),
  },
  reducers: {
    signOut: (state) => {
      localStorage.removeItem("profile");
      state.authData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("profile", JSON.stringify(action.payload));
        state.authData = action.payload;
        message.success("Login successful");
      })
      .addCase(login.rejected, (_, action) => {
        message.error(action.payload);
      })
      .addCase(register.fulfilled, (state, action) => {
        localStorage.setItem("profile", JSON.stringify(action.payload));
        state.authData = action.payload;
        message.success("Register successful");
      })
      .addCase(register.rejected, (_, action) => {
        message.error(action.payload);
      })
      .addCase(reset.fulfilled, (state) => {
        localStorage.removeItem("profile");
        state.authData = null;
        message.success("Reset successful");
      })
      .addCase(reset.rejected, (_, action) => {
        message.error(action.payload);
      });
  },
});

export const { signOut } = authSlice.actions;

export const selectAuthData = (state: RootState) => state.auth.authData;

export default authSlice.reducer;

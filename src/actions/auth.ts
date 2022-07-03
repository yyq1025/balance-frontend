import { auth, logout } from "../slices/authSlice";
import * as api from "../api";
import type { RootState, AppDispatch } from "../app/store";
import { message } from "antd";
import axios, { AxiosError } from "axios";
import { useNavigate, NavigateFunction } from "react-router-dom";

export const login =
  (values: any, navigate: NavigateFunction) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.login(values);
      const { email, token } = response.data;
      dispatch(auth({ email, token }));
      message.success("Login Successful");
      navigate("/account/balances", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<any>;
        if (err.response?.data) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
      }
    }
  };

export const register =
  (values: any, navigate: NavigateFunction) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.register(values);
      const { email, token } = response.data;
      dispatch(auth({ email, token }));
      message.success("Register Successful");
      navigate("/account/balances");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<any>;
        if (err.response?.data) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
      }
    }
  };

export const reset =
  (values: any, navigate: NavigateFunction) =>
  async (dispatch: AppDispatch) => {
    try {
      await api.reset(values);
      dispatch(logout());
      message.success("Reset Password Successful");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<any>;
        if (err.response?.data) {
          message.error(err.response.data.message);
        } else {
          message.error(err.message);
        }
      }
    }
  };

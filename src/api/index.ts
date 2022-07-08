import axios from "axios";
import type {
  QueryForm,
  LoginForm,
  RegisterForm,
  ResetForm,
} from "../common/types";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
});

// api.interceptors.request.use((config) => {
//   const token = JSON.parse(localStorage.getItem("profile") || "null")?.token;
//   if (token) {
//     config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
//   }
//   return config;
// });

export const register = (values: RegisterForm) =>
  api.post("/user/register", values);
export const code = (email: string) => api.post("/user/code", { email });
export const login = (values: LoginForm) => api.post("/user/login", values);
export const reset = (values: ResetForm) => api.put("/user/password", values);

export const fetchNetworks = () => api.get("/networks");
export const createWallet = (token: string, values: QueryForm) =>
  api.post("/wallet", values, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteWallet = (token: string, id: number) =>
  api.delete(`/wallet/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const fetchBalances = (token: string) =>
  api.get("/wallet/balances", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const fetchBalance = (token: string, id: number) =>
  api.get(`/wallet/balances/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

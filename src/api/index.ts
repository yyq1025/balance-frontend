import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("profile") || "null")?.token;
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
});

export const register = (values: any) => api.post("/user/register", values);
export const code = (email: string) => api.post("/user/code", { email });
export const login = (values: any) => api.post("/user/login", values);
export const reset = (values: any) => api.put("/user/password", values);

export const fetchNetworks = () => api.get("/networks");
export const createWallet = (values: any) => api.post("/wallet", values);
export const deleteWallet = (id: number) => api.delete(`/wallet/${id}`);
export const fetchBalances = () => api.get("/wallet/balances");
export const fetchBalance = (id: number) => api.get(`/wallet/balances/${id}`);

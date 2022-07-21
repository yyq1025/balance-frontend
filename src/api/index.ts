import axios from "axios";

import type { QueryForm } from "../common/types";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
});

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

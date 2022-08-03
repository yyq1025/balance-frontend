import axios from "axios";

import { Pagination, QueryForm } from "./types";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
});

export const fetchNetworks = () => api.get("/networks");
export const createWallet = (token: string, values: QueryForm) =>
  api.post("/wallets", values, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteWallet = (token: string, id: number) =>
  api.delete(`/wallets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const fetchBalances = (token: string, next: Pagination | null) =>
  api.get("/wallets", {
    headers: { Authorization: `Bearer ${token}` },
    params: next,
  });
export const fetchBalance = (token: string, id: number) =>
  api.get(`/wallets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

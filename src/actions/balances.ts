import {
  createBalance,
  updateBalances,
  updateBalance,
  deleteBalances,
} from "../slices/balancesSlice";
import * as api from "../api";
import { AppDispatch } from "../app/store";
import { message } from "antd";
import axios, { AxiosError } from "axios";

export const addBalance = (values: any) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.createWallet(values);
    dispatch(createBalance(response.data.balance));
    message.success("Query created successfully");
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

export const fetchBalances = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.fetchBalances();
    dispatch(updateBalances(response.data.balances));
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

export const fetchBalance = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.fetchBalance(id);
    dispatch(updateBalance(response.data.balance));
    message.success("Balance synced");
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

export const deleteWallet = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.deleteWallet(id);
    dispatch(deleteBalances(response.data.wallets));
    message.success("Query deleted successfully");
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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface Wallet {
  id: number;
  address: string;
  network: string;
  token: string;
  tag?: string;
}

export interface Balance extends Wallet {
  symbol: string;
  balance: string;
}

export const balanecsSlice = createSlice({
  name: "balanecs",
  initialState: {
    balances: Array<Balance>(),
    loaded: false,
  },
  reducers: {
    createBalance: (state, action: PayloadAction<Balance>) => {
      state.balances.push(action.payload);
    },
    updateBalances: (state, action: PayloadAction<Balance[]>) => {
      state.balances = action.payload;
      state.loaded = true;
    },
    updateBalance: (state, action: PayloadAction<Balance>) => {
      const index = state.balances.findIndex(
        (balance) => balance.id === action.payload.id
      );
      state.balances[index] = action.payload;
    },
    deleteBalances: (state, action: PayloadAction<Wallet[]>) => {
      state.balances = state.balances.filter(
        (balance) => !action.payload.find((wallet) => wallet.id === balance.id)
      );
    },
  },
});

export const { createBalance, updateBalances, updateBalance, deleteBalances } =
  balanecsSlice.actions;

export const selectBalances = (state: RootState) => state.balances;

export default balanecsSlice.reducer;

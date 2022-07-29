import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import * as api from "../../api";
import type { RootState } from "../../app/store";
import {
  ErrorMessage,
  Pagination,
  QueryForm,
  Status,
} from "../../common/types";
import { Network } from "../networks/networksSlice";

interface Balance {
  id: number;
  address: string;
  networkName: string;
  token: string;
  network: Network;
  symbol: string;
  balance: number;
}

interface BalancesResponse {
  balances: Balance[];
  next: Pagination | null;
}

interface BalanceResponse {
  balance: Balance;
}

interface DeleteResponse {
  id: number;
}

export const balancesAdapter = createEntityAdapter<Balance>({
  sortComparer: (a, b) => b.id - a.id,
});

const initialState = balancesAdapter.getInitialState<
  Status & { next: Pagination | null }
>({
  status: "idle",
  error: null,
  next: null,
});

export const fetchBalances = createAsyncThunk<
  BalancesResponse,
  { token: string },
  { state: RootState; rejectValue: ErrorMessage }
>(
  "balances/fetchBalances",
  async ({ token }, { getState, rejectWithValue }) => {
    try {
      const response = await api.fetchBalances(token, getState().balances.next);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorMessage>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: err.message });
    }
  },
  { condition: (_, { getState }) => getState().balances.status !== "loading" }
);

export const addBalance = createAsyncThunk<
  BalanceResponse,
  { token: string; values: QueryForm },
  { rejectValue: ErrorMessage }
>("balances/addBalance", async ({ token, values }, { rejectWithValue }) => {
  try {
    console.log(values);
    const response = await api.createWallet(token, values);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorMessage>;
    if (err.response?.data) {
      return rejectWithValue(err.response.data);
    }
    return rejectWithValue({ message: err.message });
  }
});

export const fetchBalance = createAsyncThunk<
  BalanceResponse,
  { token: string; id: number },
  { rejectValue: ErrorMessage }
>("balances/fetchBalance", async ({ token, id }, { rejectWithValue }) => {
  try {
    const response = await api.fetchBalance(token, id);
    console.log(response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorMessage>;
    if (err.response?.data) {
      return rejectWithValue(err.response.data);
    }
    return rejectWithValue({ message: err.message });
  }
});

export const deleteWallets = createAsyncThunk<
  DeleteResponse,
  { token: string; id: number },
  { rejectValue: ErrorMessage }
>("balances/deleteBalances", async ({ token, id }, { rejectWithValue }) => {
  try {
    const response = await api.deleteWallet(token, id);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorMessage>;
    if (err.response?.data) {
      return rejectWithValue(err.response.data);
    }
    return rejectWithValue({ message: err.message });
  }
});

export const balanecsSlice = createSlice({
  name: "balanecs",
  initialState,
  reducers: {
    resetWallets: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalances.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBalances.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.next = action.payload.next;
        balancesAdapter.upsertMany(state, action.payload.balances);
      })
      .addCase(fetchBalances.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || null;
      })
      .addCase(addBalance.fulfilled, (state, action) => {
        balancesAdapter.addOne(state, action.payload.balance);
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        balancesAdapter.upsertOne(state, action.payload.balance);
      })
      .addCase(deleteWallets.fulfilled, (state, action) => {
        balancesAdapter.removeOne(state, action.payload.id);
      });
  },
});

export const { resetWallets } = balanecsSlice.actions;

export const { selectIds: selectBalanceIds, selectById: selectBalanceById } =
  balancesAdapter.getSelectors((state: RootState) => state.balances);

export const selectBalancesStatus = (state: RootState) => state.balances.status;
export const selectBalancesError = (state: RootState) => state.balances.error;
export const selectBalancesNext = (state: RootState) => state.balances.next;

export default balanecsSlice.reducer;

import { Auth0ContextInterface } from "@auth0/auth0-react";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import * as api from "../../api";
import type { RootState } from "../../app/store";
import type { ErrorResponse, QueryForm, Status } from "../../common/types";

interface Balance {
  id: number;
  address: string;
  network: string;
  token: string;
  symbol: string;
  balance: string;
}

type GetAccessTokenSilentlyType =
  Auth0ContextInterface["getAccessTokenSilently"];

export const balancesAdapter = createEntityAdapter<Balance>({
  sortComparer: (a, b) => a.id - b.id,
});

const initialState = balancesAdapter.getInitialState<Status>({
  status: "idle",
  error: null,
});

export const fetchBalances = createAsyncThunk<
  Balance[],
  { getAccessTokenSilently: GetAccessTokenSilentlyType },
  { rejectValue: string }
>(
  "balances/fetchBalances",
  async ({ getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.fetchBalances(token);
      return response.data.balances;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue(err.message);
      }
    }
  }
);

export const addBalance = createAsyncThunk<
  Balance,
  { getAccessTokenSilently: GetAccessTokenSilentlyType; values: QueryForm },
  { rejectValue: string }
>(
  "balances/addBalance",
  async ({ getAccessTokenSilently, values }, { rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.createWallet(token, values);
      return response.data.balance;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue(err.message);
      }
    }
  }
);

export const fetchBalance = createAsyncThunk<
  Balance,
  { getAccessTokenSilently: GetAccessTokenSilentlyType; id: number },
  { rejectValue: string }
>(
  "balances/fetchBalance",
  async ({ getAccessTokenSilently, id }, { rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.fetchBalance(token, id);
      return response.data.balance;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue(err.message);
      }
    }
  }
);

export const deleteWallets = createAsyncThunk<
  number[],
  { getAccessTokenSilently: GetAccessTokenSilentlyType; id: number },
  { rejectValue: string }
>(
  "balances/deleteBalances",
  async ({ getAccessTokenSilently, id }, { rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.deleteWallet(token, id);
      return response.data.ids;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue(err.message);
      }
    }
  }
);

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
        balancesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchBalances.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || null;
      })
      .addCase(addBalance.fulfilled, (state, action) => {
        balancesAdapter.addOne(state, action.payload);
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        balancesAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteWallets.fulfilled, (state, action) => {
        balancesAdapter.removeMany(state, action.payload);
      });
  },
});

export const { resetWallets } = balanecsSlice.actions;

export const { selectIds: selectBalanceIds, selectById: selectBalanceById } =
  balancesAdapter.getSelectors((state: RootState) => state.balances);

export const selectBalancesStatus = (state: RootState) => state.balances.status;
export const selectBalancesError = (state: RootState) => state.balances.error;

export default balanecsSlice.reducer;

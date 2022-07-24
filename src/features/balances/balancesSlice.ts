import { Auth0ContextInterface } from "@auth0/auth0-react";
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

interface Balance {
  id: number;
  address: string;
  network: string;
  token: string;
  symbol: string;
  balance: string;
}

interface BalancesResponse {
  balances: Balance[];
  next: Pagination;
}

interface BalanceResponse {
  balance: Balance;
}

interface DeleteResponse {
  ids: number[];
}

type GetAccessTokenSilentlyType =
  Auth0ContextInterface["getAccessTokenSilently"];

export const balancesAdapter = createEntityAdapter<Balance>({
  sortComparer: (a, b) => b.id - a.id,
});

const initialState = balancesAdapter.getInitialState<Status>({
  status: "idle",
  error: null,
});

export const fetchBalances = createAsyncThunk<
  BalancesResponse,
  { getAccessTokenSilently: GetAccessTokenSilentlyType },
  { state: RootState; rejectValue: ErrorMessage }
>(
  "balances/fetchBalances",
  async ({ getAccessTokenSilently }, { getState, rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.fetchBalances(token, getState().balances.next);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorMessage>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue({ message: err.message });
      }
    }
  },
  { condition: (_, { getState }) => getState().balances.status !== "loading" }
);

export const addBalance = createAsyncThunk<
  BalanceResponse,
  { getAccessTokenSilently: GetAccessTokenSilentlyType; values: QueryForm },
  { rejectValue: ErrorMessage }
>(
  "balances/addBalance",
  async ({ getAccessTokenSilently, values }, { rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.createWallet(token, values);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorMessage>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue({ message: err.message });
      }
    }
  }
);

export const fetchBalance = createAsyncThunk<
  BalanceResponse,
  { getAccessTokenSilently: GetAccessTokenSilentlyType; id: number },
  { rejectValue: ErrorMessage }
>(
  "balances/fetchBalance",
  async ({ getAccessTokenSilently, id }, { rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.fetchBalance(token, id);
      return response.data.balance;
    } catch (error) {
      const err = error as AxiosError<ErrorMessage>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue({ message: err.message });
      }
    }
  }
);

export const deleteWallets = createAsyncThunk<
  DeleteResponse,
  { getAccessTokenSilently: GetAccessTokenSilentlyType; id: number },
  { rejectValue: ErrorMessage }
>(
  "balances/deleteBalances",
  async ({ getAccessTokenSilently, id }, { rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.deleteWallet(token, id);
      return response.data.ids;
    } catch (error) {
      const err = error as AxiosError<ErrorMessage>;
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue({ message: err.message });
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
        console.log(action.payload);
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
        balancesAdapter.removeMany(state, action.payload.ids);
      });
  },
});

export const { resetWallets } = balanecsSlice.actions;

export const { selectIds: selectBalanceIds, selectById: selectBalanceById } =
  balancesAdapter.getSelectors((state: RootState) => state.balances);

export const selectBalancesStatus = (state: RootState) => state.balances.status;
export const selectBalancesError = (state: RootState) => state.balances.error;
export const selectBalancesPage = (state: RootState) =>
  state.balances.next?.page;

export default balanecsSlice.reducer;

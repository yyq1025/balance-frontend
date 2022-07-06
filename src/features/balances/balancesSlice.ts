import {
  createEntityAdapter,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { message } from "antd";
import * as api from "../../api";
import type { RootState } from "../../app/store";

interface Wallet {
  id: number;
  address: string;
  network: string;
  token: string;
  tag?: string;
}

interface Balance extends Wallet {
  symbol: string;
  balance: string;
}

export const balancesAdapter = createEntityAdapter<Balance>({
  sortComparer: (a, b) => a.id - b.id,
});

const initialState = balancesAdapter.getInitialState({
  loaded: false,
});

export const fetchBalances = createAsyncThunk<
  Balance[],
  void,
  { rejectValue: string }
>("balances/fetchBalances", async (_, { rejectWithValue }) => {
  try {
    const response = await api.fetchBalances();
    return response.data.balances;
  } catch (error) {
    const err = error as AxiosError<any>;
    if (err.response?.data) {
      return rejectWithValue(err.response.data.message);
    } else {
      return rejectWithValue(err.message);
    }
  }
});

export const addBalance = createAsyncThunk<
  Balance,
  any,
  { rejectValue: string }
>("balances/addBalance", async (values, { rejectWithValue }) => {
  try {
    const response = await api.createWallet(values);
    return response.data.balance;
  } catch (error) {
    const err = error as AxiosError<any>;
    if (err.response?.data) {
      return rejectWithValue(err.response.data.message);
    } else {
      return rejectWithValue(err.message);
    }
  }
});

export const fetchBalance = createAsyncThunk<
  Balance,
  number,
  { rejectValue: string }
>("balances/fetchBalance", async (id, { rejectWithValue }) => {
  try {
    const response = await api.fetchBalance(id);
    return response.data.balance;
  } catch (error) {
    const err = error as AxiosError<any>;
    if (err.response?.data) {
      return rejectWithValue(err.response.data.message);
    } else {
      return rejectWithValue(err.message);
    }
  }
});

export const deleteWallets = createAsyncThunk<
  number[],
  number,
  { rejectValue: string }
>("balances/deleteBalances", async (id, { rejectWithValue }) => {
  try {
    const response = await api.deleteWallet(id);
    return response.data.ids;
  } catch (error) {
    const err = error as AxiosError<any>;
    if (err.response?.data) {
      return rejectWithValue(err.response.data.message);
    } else {
      return rejectWithValue(err.message);
    }
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
      .addCase(fetchBalances.fulfilled, (state, action) => {
        balancesAdapter.setAll(state, action.payload);
        state.loaded = true;
      })
      .addCase(fetchBalances.rejected, (_, action) => {
        message.error(action.payload);
      })
      .addCase(addBalance.fulfilled, (state, action) => {
        balancesAdapter.addOne(state, action.payload);
        message.success("Query added");
      })
      .addCase(addBalance.rejected, (_, action) => {
        message.error(action.payload);
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        balancesAdapter.upsertOne(state, action.payload);
        message.success("Query updated");
      })
      .addCase(fetchBalance.rejected, (_, action) => {
        message.error(action.payload);
      })
      .addCase(deleteWallets.fulfilled, (state, action) => {
        balancesAdapter.removeMany(state, action.payload);
        message.success("Query deleted");
      })
      .addCase(deleteWallets.rejected, (_, action) => {
        message.error(action.payload);
      });
  },
});

export const { resetWallets } = balanecsSlice.actions;

export const { selectIds: selectBalanceIds, selectById: selectBalanceById } =
  balancesAdapter.getSelectors((state: RootState) => state.balances);

export const selectBalancesLoaded = (state: RootState) => state.balances.loaded;

export default balanecsSlice.reducer;

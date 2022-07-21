import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import * as api from "../../api";
import type { RootState } from "../../app/store";
import type { ErrorResponse, Status } from "../../common/types";

interface Network {
  chainId: string;
  name: string;
  url: string;
  symbol: string;
  explorer: string;
}

const networksAdapter = createEntityAdapter<Network>({
  selectId: (network) => network.name,
});

const initialState = networksAdapter.getInitialState<Status>({
  status: "idle",
  error: null,
});

export const fetchNetworks = createAsyncThunk<
  Network[],
  void,
  {
    rejectValue: string;
  }
>("networks/fetchNetworks", async (_, { rejectWithValue }) => {
  try {
    const response = await api.fetchNetworks();
    return response.data.networks;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    if (err.response?.data) {
      return rejectWithValue(err.response.data.message);
    } else {
      return rejectWithValue(err.message);
    }
  }
});

export const networksSlice = createSlice({
  name: "networks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNetworks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNetworks.fulfilled, (state, action) => {
        state.status = "succeeded";
        networksAdapter.setAll(state, action.payload);
      })
      .addCase(fetchNetworks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || null;
      });
  },
});

export const {
  selectIds: selectNetworkNames,
  selectById: selectNetworkByName,
} = networksAdapter.getSelectors((state: RootState) => state.networks);

export const selectNetworksStatus = (state: RootState) => state.networks.status;
export const selectNetworksError = (state: RootState) => state.networks.error;

export default networksSlice.reducer;

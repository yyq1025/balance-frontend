import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import type { RootState } from "../../app/store";
import * as api from "../../common/api";
import { ErrorMessage, Status } from "../../common/types";

export interface Network {
  chainId: string;
  name: string;
  url: string;
  symbol: string;
  explorer: string;
}

interface NetworksResponse {
  networks: Network[];
}

const networksAdapter = createEntityAdapter<Network>({
  selectId: (network) => network.name,
});

const initialState = networksAdapter.getInitialState<Status>({
  status: "idle",
  error: null,
});

export const fetchNetworks = createAsyncThunk<
  NetworksResponse,
  void,
  {
    state: RootState;
    rejectValue: ErrorMessage;
  }
>(
  "networks/fetchNetworks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.fetchNetworks();
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
  {
    condition: (_, { getState }) => getState().networks.status !== "loading",
  }
);

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
        networksAdapter.setAll(state, action.payload.networks);
      })
      .addCase(fetchNetworks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || null;
      });
  },
});

export const {
  selectIds: selectNetworkNames,
  selectById: selectNetworkByName,
  selectAll: selectNetworks,
} = networksAdapter.getSelectors((state: RootState) => state.networks);

export const selectNetworksStatus = (state: RootState) => state.networks.status;
export const selectNetworksError = (state: RootState) => state.networks.error;

export default networksSlice.reducer;

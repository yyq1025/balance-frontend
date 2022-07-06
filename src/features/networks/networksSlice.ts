import {
  createEntityAdapter,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { message } from "antd";
import { AxiosError } from "axios";
import * as api from "../../api";
import type { RootState } from "../../app/store";

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

const initialState = networksAdapter.getInitialState({
  loaded: false,
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
    const err = error as AxiosError<any>;
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
      .addCase(fetchNetworks.fulfilled, (state, action) => {
        networksAdapter.setAll(state, action.payload);
        state.loaded = true;
      })
      .addCase(fetchNetworks.rejected, (_, action) => {
        message.error(action.payload);
      });
  },
});

export const {
  selectIds: selectNetworkNames,
  selectById: selectNetworkByName,
} = networksAdapter.getSelectors((state: RootState) => state.networks);

export const selectNetworksLoaded = (state: RootState) => state.networks.loaded;

export default networksSlice.reducer;

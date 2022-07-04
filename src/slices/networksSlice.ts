import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

export interface Network {
  chainId: string;
  name: string;
  url: string;
  symbol: string;
}

export const networksSlice = createSlice({
  name: "networks",
  initialState: {
    networks: Array<Network>(),
    loaded: false,
  },
  reducers: {
    updateNetworks: (state, action: PayloadAction<Network[]>) => {
      state.networks = action.payload;
      state.loaded = true;
    },
  },
});

export const { updateNetworks } = networksSlice.actions;

export const selectNetworks = (state: RootState) => state.networks;

export default networksSlice.reducer;

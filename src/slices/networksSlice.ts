import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface Network {
  name: string;
  url: string;
  symbol: string;
}

export const networksSlice = createSlice({
  name: "networks",
  initialState: {
    networks: Array<Network>(),
  },
  reducers: {
    updateNetworks: (state, action: PayloadAction<Network[]>) => {
      state.networks = action.payload;
    },
  },
});

export const { updateNetworks } = networksSlice.actions;

export const selectNetworks = (state: RootState) => state.networks.networks;

export default networksSlice.reducer;

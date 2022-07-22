import { configureStore } from "@reduxjs/toolkit";

import balancesReducer from "../features/balances/balancesSlice";
import networksReducer from "../features/networks/networksSlice";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    balances: balancesReducer,
    networks: networksReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";

import balancesReducer from "../features/balances/balancesSlice";
import networksReducer from "../features/networks/networksSlice";

const store = configureStore({
  reducer: {
    balances: balancesReducer,
    networks: networksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../common/authSlice";
import balancesReducer from "../features/balances/balancesSlice";
import networksReducer from "../features/networks/networksSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    balances: balancesReducer,
    networks: networksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;

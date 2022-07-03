import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import balancesReducer from "../slices/balancesSlice";
import networksReducer from "../slices/networksSlice";

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

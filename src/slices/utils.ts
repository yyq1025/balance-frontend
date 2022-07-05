import { signOut } from "./authSlice";
import { resetWallets } from "./balancesSlice";
import { AppDispatch } from "../app/store";

export const logout = () => (dispatch: AppDispatch) => {
  dispatch(resetWallets());
  dispatch(signOut());
};

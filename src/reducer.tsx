import { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  authData: JSON.parse(localStorage.getItem("profile") || "null"),
};

export default function authReducer(
  state = initialState,
  action: PayloadAction
) {
  switch (action.type) {
    case "LOGIN":
      console.log(action.payload);
      localStorage.setItem("profile", JSON.stringify(action.payload));
      return {
        ...state,
        authData: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("profile");
      return {
        ...state,
        authData: null,
      };
    default:
      return state;
  }
}

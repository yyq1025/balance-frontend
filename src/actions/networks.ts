import { updateNetworks } from "../slices/networksSlice";
import * as api from "../api";
import { AppDispatch } from "../app/store";
import { message } from "antd";
import axios, { AxiosError } from "axios";

export const fetchNetworks = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.fetchNetworks();
    dispatch(updateNetworks(response.data.networks));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<any>;
      if (err.response?.data) {
        message.error(err.response.data.message);
      } else {
        message.error(err.message);
      }
    }
  }
};

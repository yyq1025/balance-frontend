import { Network } from "../features/networks/networksSlice";

export interface ErrorMessage {
  message: string;
}

export interface Pagination {
  idLte: number;
  page: number;
  pageSize: number;
}

export interface Status {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface QueryForm {
  address: string;
  network: Network | null;
  token: string;
}

export interface ErrorMessage {
  message: string;
}

export interface Pagination {
  idLte?: number;
  page?: number;
  pageSize?: number;
}

export interface Status {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  next?: Pagination;
}

export interface QueryForm {
  address: string;
  network: string;
  token: string;
}

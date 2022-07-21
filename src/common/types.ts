export interface ErrorResponse {
  message: string;
}

export interface Status {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface QueryForm {
  address: string;
  network: string;
  token: string;
}

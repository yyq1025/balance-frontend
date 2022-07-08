export interface ErrorResponse {
  message: string;
}

export interface QueryForm {
  address: string;
  network: string;
  token?: string;
  tag?: string;
}

export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterForm {
  email: string;
  code: string;
  password: string;
}

export interface ResetForm {
  email: string;
  code: string;
  password: string;
}

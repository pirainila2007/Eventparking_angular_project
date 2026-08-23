export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  customerId: number;
  fullName: string;
  email: string;
  role: string;
  token: string;
  expiration: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  message: string;
}
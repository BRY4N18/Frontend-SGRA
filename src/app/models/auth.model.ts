export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  serverSynced: boolean;
}

export interface AuthError {
  error: string;
}


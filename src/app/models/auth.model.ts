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
  accountState: string; // 'A' = Activo, 'I' = Inactivo, 'C' = Cambio contraseña
}

export interface AuthError {
  error: string;
}


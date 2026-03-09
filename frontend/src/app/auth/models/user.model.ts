// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt?: string;  // ← Add this! (? means optional)
}

// Auth response from backend
export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}
// Login request data
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request data
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

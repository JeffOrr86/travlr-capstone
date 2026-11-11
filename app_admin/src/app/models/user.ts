// User interface matching our auth payload
export interface User {
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
}

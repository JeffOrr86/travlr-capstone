// User interface matching our auth payload
export interface User {
  email: string;
  name: string;
  role?: string; // Added role property

}

export interface AuthResponse {
  token: string;
}

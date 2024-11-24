export interface AuthResponse {
  token: string;
  usuario: {
    nome: string;
    email: string;
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthResponse } from '../models/authResponse.model';
import { RegistroUsuario } from '../models/registro.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private apiUrl = 'https://localhost:7218/Auth';

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email,
      senha
    });
  }

  setSession(authResult: AuthResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('usuario', JSON.stringify(authResult.usuario));
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isAuthenticatedSubject.next(false);
  }

  public hasValidToken(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuarioAtual(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  registro(registroUsuario: RegistroUsuario): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, registroUsuario);
  }

}

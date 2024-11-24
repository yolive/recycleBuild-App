import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PerfilUsuario } from '../models/perfilUsuario.model';
import { TopDoadores } from '../models/topDoadores.model';
import { LixoReciclado } from '../models/lixoReciclado.model';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReciclagemService {

  private apiUrl = `${environment.apiUrl}/Reciclagem`;
  // private apiUrl = 'https://localhost:7218/Reciclagem';

  constructor(private http: HttpClient, private authService: AuthService) { }

   // Método privado para criar headers com token
    private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Método para adicionar reciclagem
  adicionarReciclagem(peso: number): Observable<LixoReciclado> {
    const  usuarioAtual = this.authService.getUsuarioAtual();

    const lixoReciclado: LixoReciclado = {
      idUsuario: usuarioAtual.id,
      peso: peso,
      dataReciclagem: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    };


    return this.http.post<LixoReciclado>(this.apiUrl, lixoReciclado, {
      headers: this.getAuthHeaders()
    });
  }

  // Método para obter total mensal
  getTotalMensal(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.apiUrl}/total-mensal`, {
      headers: this.getAuthHeaders()
    });
  }

  // Método para obter top doadores
  getTopDoadores(): Observable<TopDoadores[]> {
    return this.http.get<TopDoadores[]>(`${this.apiUrl}/top-doadores`, {
      headers: this.getAuthHeaders()
    });
  }

  // Método para verificar se o usuário está autenticado
  canAccessRecyclingFeatures(): boolean {
    return this.authService.hasValidToken();
  }

}

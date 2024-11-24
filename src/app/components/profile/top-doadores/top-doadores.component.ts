import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReciclagemService } from '../../../services/reciclagem.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopDoadores } from '../../../models/topDoadores.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-top-doadores',
  standalone: true,
  imports: [CommonModule, FormsModule, MatListModule, MatCardModule, MatTabsModule, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './top-doadores.component.html',
  styleUrl: './top-doadores.component.scss'
})
export class TopDoadoresComponent {
  totalMensal: number = 0;
  pesoReciclagem: number = 0;
  topDoadores: TopDoadores[] = [];
  isAuthenticated: boolean = false;

  constructor(
    private reciclagemService: ReciclagemService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    // Verifica se usuário está autenticado
    const usuario = this.authService.getUsuarioAtual();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.carregarTotalMensal();
        this.carregarTopDoadores();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  carregarTotalMensal() {
    this.reciclagemService.getTotalMensal().subscribe({
      next: (perfil) => {
        this.totalMensal = perfil.totalMensal;
      },
      error: (erro) => {
        this.handleError(erro);
      }
    });
  }

  carregarTopDoadores() {
    this.reciclagemService.getTopDoadores().subscribe({
      next: (doadores) => {
        this.topDoadores = doadores;
      },
      error: (erro) => {
        this.handleError(erro);
      }
    });
  }

  registrarReciclagem() {
    if (!this.isAuthenticated) {
      this.snackBar.open('Você precisa estar logado', 'Fechar', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    if (this.pesoReciclagem <= 0) {
      this.snackBar.open('Informe um peso válido', 'Fechar', { duration: 3000 });
      return;
    }

    this.reciclagemService.adicionarReciclagem(this.pesoReciclagem).subscribe({
      next: () => {
        this.snackBar.open('Reciclagem registrada com sucesso!', 'Fechar', { duration: 3000 });
        this.pesoReciclagem = 0;
        this.carregarTotalMensal();
        this.carregarTopDoadores();
      },
      error: (erro) => {
        this.handleError(erro);
      }
    });
  }

  private handleError(erro: any) {
    if (erro.status === 401) {
      this.snackBar.open('Sessão expirada. Por favor, faça login novamente.', 'Fechar', { duration: 3000 });
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      this.snackBar.open('Ocorreu um erro na operação', 'Fechar', { duration: 3000 });
    }
  }

}

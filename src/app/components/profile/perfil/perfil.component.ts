import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PerfilUsuario } from '../../../models/perfilUsuario.model';
import { ReciclagemService } from '../../../services/reciclagem.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  usuario: PerfilUsuario | null = null;

  constructor(private reciclagemService: ReciclagemService) {}

  ngOnInit(): void {
    this.carregarPerfilUsuario();
  }

  carregarPerfilUsuario(): void {
    this.reciclagemService.getTotalMensal()
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar perfil do usuário', error);
          return of(null);
        })
      )
      .subscribe(perfil => {
        if (perfil) {
          this.usuario = perfil;
        }
      });
  }

}

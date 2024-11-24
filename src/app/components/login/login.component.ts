import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { 
  Validators, 
  FormBuilder, 
  FormControl, 
  FormsModule, 
  ReactiveFormsModule,
  NonNullableFormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatGridListModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(false);
  readonly hide = signal(true);
  readonly errorMessage = signal('');

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly email = this.loginForm.get('email') as FormControl;
  readonly senha = this.loginForm.get('senha') as FormControl;

  constructor() {
    // Monitor email changes para atualizar mensagens de erro
    this.email.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage(): void {
    if (this.email.hasError('required')) {
      this.errorMessage.set('Email é obrigatório');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Não é um email válido');
    } else {
      this.errorMessage.set('');
    }
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.hide.update(state => !state);
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, senha } = this.loginForm.getRawValue();
    
    this.isLoading.set(true);
    
    this.authService.login(email, senha)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          // Assumindo que o serviço retorna um token ou dados do usuário
          this.authService.setSession(response);
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          let errorMessage = 'Erro ao realizar login';
          
          // Tratamento de erros específicos do backend
          if (error.status === 401) {
            errorMessage = 'Email ou senha inválidos';
          } else if (error.status === 404) {
            errorMessage = 'Usuário não encontrado';
          }
          
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  register(): void {
    this.router.navigate(['/registrar']);
  }

}

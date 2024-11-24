import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { 
  Validators, 
  FormBuilder, 
  FormsModule, 
  ReactiveFormsModule 
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { RegistroUsuario } from '../../models/registro.model';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatGridListModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrarComponent {
  errorMessage = signal('');
  hide = signal(true);
  isLoading = signal(false);

  registroForm = this.fb.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registroForm.get('email')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    const emailControl = this.registroForm.get('email');
    if (emailControl?.hasError('required')) {
      this.errorMessage.set('Email é obrigatório');
    } else if (emailControl?.hasError('email')) {
      this.errorMessage.set('Não é um email válido');
    } else {
      this.errorMessage.set('');
    }
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.update(state => !state);
    event.stopPropagation();
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const registroUsuario: RegistroUsuario = {
        nome: this.registroForm.get('nome')?.value ?? '',
        email: this.registroForm.get('email')?.value ?? '',
        senha: this.registroForm.get('senha')?.value ?? ''
      };
  
      this.authService.registro(registroUsuario).subscribe({
        next: (response) => {
          // Se o backend retornar o token e usuário já no registro
          this.authService.setSession(response);
          this.router.navigate(['/']); // ou para onde desejar redirecionar
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Erro ao registrar usuário');
        }
      });
    }
  }


























//   errorMessage = signal('');
//   hide = signal(true);

//   registrtoForm = this.fb.group({
//     nome: ['', Validators.required],
//     email: ['', [Validators.required, Validators.email]],
//     senha: ['', Validators.required, Validators.minLength(6)],
// });

// constructor(
//   private authService: AuthService,
//   private router: Router,
//   private fb: FormBuilder) {
//     // merge(this.registrtoForm.statusChanges, this.registrtoForm.valueChanges)
//     //   .pipe(takeUntilDestroyed())
//     //   .subscribe(() => this.updateErrorMessage());
//     this.registrtoForm.get('email')?.valueChanges
//       .pipe(takeUntilDestroyed())
//       .subscribe(() => this.updateErrorMessage());
//   }

//   updateErrorMessage() {
//     const emailControl = this.registrtoForm.get('email');
//     if (emailControl?.hasError('required')) {
//       this.errorMessage.set('Email é obrigatório');
//     } else if (emailControl?.hasError('email')) {
//       this.errorMessage.set('Não é um email válido');
//     } else {
//       this.errorMessage.set('');
//     }
//   }

//   clickEvent(event: MouseEvent) {
//     this.hide.set(!this.hide());
//     event.stopPropagation();
//   }

//   onSubmit() {
//     if (this.registrtoForm.valid) {
//       const userData = {
//         nome: this.registrtoForm.get('nome')?.value,
//         email: this.registrtoForm.get('email')?.value,
//         senha: this.registrtoForm.get('senha')?.value
//       };

//       this.authService.register(userData).subscribe({
//         next: () => {
//           this.router.navigate(['/']);
//         },
//         error: (error) => {
//           this.errorMessage.set(error.error.message || 'Erro ao registrar usuário');
//         }
//       });
//     }
//   }

}

import { Component, inject, model, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [RouterLink, MatCardModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  nameFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  
  hidePassword = signal(true);
  readonly checkedTerms = model(false);
  
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private authService = inject(AuthService);

  showPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  OnSubmit() {
    if (this.emailFormControl.invalid || this.nameFormControl.invalid || this.passwordFormControl.invalid) {
      this.invalidForm();
      return;
    }
    this.register();
  }
  register() {
    const email = this.emailFormControl.value as string;
    const senha = this.passwordFormControl.value as string;
    const nome = this.nameFormControl.value as string;
    
    this.authService.register(email, senha, nome)
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => {
          console.error('Erro no registro:', err);
          this._snackBar.open('Erro no registro: ' + err.message, 'Fechar', {
            duration: 5000
          });
        }
      });
  }


  invalidForm() {
    if (this.emailFormControl.invalid) {
      this.emailFormControl.markAsTouched();
    }
    if (this.nameFormControl.invalid) {
      this.nameFormControl.markAsTouched();
    }
    if (this.passwordFormControl.invalid) {
      this.passwordFormControl.markAsTouched();
    }
  }
}

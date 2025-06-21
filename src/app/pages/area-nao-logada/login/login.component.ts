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
  selector: 'app-login',
  imports: [RouterLink, MatCardModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  hidePassword = signal(true);
  readonly checkedRememberLogin = model(false);

  private router = inject(Router);
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  ngOnInit() {
    const email = localStorage.getItem('email_farm');
    const password = localStorage.getItem('password_farm');
    if (email?.length && password?.length) {
      this.emailFormControl.setValue(email);
      this.passwordFormControl.setValue(password);
      this.checkedRememberLogin.set(true);
    }
  }

  showPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  onSubmit() {
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      this.goToLogin();
      return;
    } 
    this.invalidForm();
  }

  invalidForm() {
    if (this.emailFormControl.invalid) {
      this.emailFormControl.markAsTouched();
    }
    if (this.passwordFormControl.invalid) {
      this.passwordFormControl.markAsTouched();
    }
  }

  goToLogin() {
    this.rememberMe();
    const email = this.emailFormControl.value as string;
    const password = this.passwordFormControl.value as string;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('Logado com sucesso:', res)
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this._snackBar.open('Erro no login: ' + err.message, 'Fechar', {
          duration: 5000
        });
      }
    });

  }

  rememberMe() {
    if (!this.checkedRememberLogin()) { this.clearLocalStorage(); return; }
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
    localStorage.setItem('email_farm', email ?? '');
    localStorage.setItem('password_farm', password ?? '');
  }
  
  clearLocalStorage() {
    localStorage.removeItem('email_farm');
    localStorage.removeItem('password_farm');
  }
}

import { Component, model, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private router: Router) { }

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
  register(){
    // Fazer o registro do usuário no firebase
    this.goToHome();
  }
  goToHome(){
    this.router.navigate(['/home']);
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

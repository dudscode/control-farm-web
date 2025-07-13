import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  formGroupResetPassword: FormGroup = new FormGroup({
    novaSenha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    senhaAntiga: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  get disabled(): boolean {
    return !this.formGroupResetPassword.valid ;
  }

  redefinirSenha() {
    const { novaSenha , senhaAntiga } = this.formGroupResetPassword.value;
    console.log('Resetting password for:', novaSenha);
    this.authService.updateUserPassword(senhaAntiga, novaSenha).subscribe({
      next: () => {
        console.log('Password updated successfully');
        this._snackBar.open('Senha atualizada com sucesso', 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error updating password:', error);
        this._snackBar.open('Erro ao atualizar a senha', 'Fechar', {
          duration: 3000
        });
      }
    });
  }


}

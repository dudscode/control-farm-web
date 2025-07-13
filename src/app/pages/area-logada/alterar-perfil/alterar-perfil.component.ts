import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alterar-perfil',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    NgxMaskDirective,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [DatePipe],
  templateUrl: './alterar-perfil.component.html',
  styleUrl: './alterar-perfil.component.scss'
})
export class AlterarPerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  formGroupProfile: FormGroup = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    sobrenome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endereco: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dataNascimento: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        (control) => {
          const value = control.value;
          const dateRegex = /^(\d{2})(\d{2})(\d{4})$/;
          if (!value || !dateRegex.test(value)) {
            return { invalidDate: true };
          }
          const [, dayStr, monthStr, yearStr] = value.match(dateRegex) || [];
          const day = Number(dayStr);
          const month = Number(monthStr);
          const year = Number(yearStr);
          const date = new Date(year, month - 1, day);
          if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
          ) {
            return { invalidDate: true };
          }
          return null;
        }
      ]
    }),
  });
  formEdited: boolean = false;
  imageEdited: boolean = false;
  urlProfilePicture: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile?: File;
  private datePipe: DatePipe = inject(DatePipe);

  ngOnInit(): void {

    this.authService.getUserProfile().subscribe((user) => {
      if (user) {
        this.formGroupProfile.patchValue({
          nome: user.nome,
          sobrenome: user.sobrenome,
          endereco: user.logradouro,
          phone: user.numero || '',
          dataNascimento: user.dataNascimento
            ? this.datePipe.transform(user.dataNascimento, 'dd/MM/yyyy')
            : ''
        });
        this.urlProfilePicture = user.urlFotoPerfil;
        this.formGroupProfile.valueChanges.subscribe((_) => {

          this.formEdited = true;
        });
      }
    });

  }
  onFileSelected(event: any): void {
    this.imageEdited = true;
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  editarProfile(): void {
    let dataNascimento = this.formGroupProfile.value.dataNascimento;
    const dateRegex = /^(\d{2})(\d{2})(\d{4})$/;
    if (dateRegex.test(dataNascimento)) {
      const [, day, month, year] = dataNascimento.match(dateRegex) || [];
      dataNascimento = `${year}-${month}-${day}`;
    }

    this.authService.updateUserProfile({
      nome: this.formGroupProfile.value.nome,
      sobrenome: this.formGroupProfile.value.sobrenome,
      dataNascimento: dataNascimento,
      logradouro: this.formGroupProfile.value.endereco,
      numero: this.formGroupProfile.value.phone
    }).subscribe({
      next: () => {
        this._snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
          duration: 2000
        });
        this.formEdited = false;
        setTimeout(() => {
          window.location.reload();
        }, 2100);
      },
      error: (error) => {
        console.error('Erro ao atualizar perfil:', error);
        this._snackBar.open('Erro ao atualizar perfil', 'Fechar', {
          duration: 3000
        });
      }
    });
  }
  editarProfilePicture(): void {
    if (!this.selectedFile) {
      this.editarProfile();
      return;
    }
    this.authService.updateUserProfilePictureStorage(this.selectedFile).subscribe({
      next: _ => {
        console.log('Imagem de perfil atualizada com sucesso!');
        this.editarProfile();
      },
      error: (err) => {
        console.error('Erro ao atualizar imagem de perfil:', err);
      }
    });
  }
  get disabled(): boolean {
    if (this.formEdited || this.selectedFile !== undefined) {
      return !this.formGroupProfile.valid;
    }
    if (this.imageEdited) {
      return !this.selectedFile;
    }
    return true;
  }
}

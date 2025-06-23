import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { ISearchOption, optionsSearch } from '../../helpers/search';
import { AuthService } from '../../../core/services/auth/auth.service';



@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  readonly user$ = this.authService.userDados;


  searchControl = new FormControl<string | ISearchOption>('');
  options: ISearchOption[] = optionsSearch;
  filteredOptions: Observable<ISearchOption[]> | undefined;
  notificationsCount = signal(0);

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name && name.length > 0 ? this._filter(name) : [];
      }),
    );
  }

  displayFn(search: ISearchOption): string {
    return search && search.name ? search.name : '';
  }


  private _filter(name: string): ISearchOption[] {
    const filterValue = name.toLowerCase();
    return filterValue
      ? this.options.filter(option => option.name.toLowerCase().includes(filterValue)) : [];
  }

  reditectToLink(search: ISearchOption) {
    if (search.routerLink) {
      this.router.navigate([search.routerLink]);
      this.searchControl.setValue('');

    }
  }

  updateProfile() {
    this.authService.updateUserProfile({
      nome: 'Eduarda',
      sobrenome: 'Alves',
      dataNascimento: '1990-01-01',
      logradouro: 'Rua Exemplo',
      numero: '123',
      urlFotoPerfil: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz6OrnV4LqsxU7PyGFf7Pgg0rhVPpWpQrXVw&s'
    }).subscribe(
      (user) => {
        console.log('Perfil atualizado com sucesso', user);
      },
      error => {
        console.error('Erro ao atualizar perfil:', error);
      }
    )
  }

}

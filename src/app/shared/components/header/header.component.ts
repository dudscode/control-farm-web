import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { ISearchOption, optionsSearch } from '../../helpers/search';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';



@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  {
  private router = inject(Router);
  private authService = inject(AuthService);
  readonly user$ = this.authService.userDados;

  notificationsCount = signal(0);

  

  displayFn(search: ISearchOption): string {
    return search && search.name ? search.name : '';
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
  navigateTo(url: string) {
    this.router.navigate([url]);
  }


}

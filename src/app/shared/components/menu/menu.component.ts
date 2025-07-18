import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';



@Component({
  selector: 'app-menu',
  imports: [MatButtonToggleModule, MatIconModule, MatDividerModule, MatButtonModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent  implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  hideSingleSelectionIndicator = signal(false);
  selectedValue = signal(this.router.url);
  private urlValue : any= {
    '/home/vendas': '/home/vendas',
    '/home/cadastro-vendas': '/home/vendas',
    '/home/producao': '/home/producao',
    '/home/cadastro-produtos': '/home/producao',
    '/home/metas': '/home/metas',
    '/home/cadastro-metas': '/home/metas',
  }
  ngOnInit() {
    this.router.events
    .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe(() => {
      this.validateSelection(this.router.url);
    });
  }
  validateSelection(value: string) {
    const urlsSelected = this.urlValue[value] || this.urlValue['/home/vendas'];
    this.selectedValue.set(urlsSelected);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      }
    });
  }
}

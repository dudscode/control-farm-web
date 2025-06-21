import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private authService= inject(AuthService);
  private router = inject(Router);
  
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Usuário deslogado com sucesso');
        this.router.navigate(['/']);
      },
      error: () => {
        console.error('Erro ao deslogar:');
      }
    });
  }
}

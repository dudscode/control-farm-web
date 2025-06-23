import { inject, Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    console.log('AuthGuard chamado');
    return this.authService.user$.pipe(
      map(user => {
        const permitido = !!user;
        console.log('Usuário autenticado?', permitido);
        return permitido || this.router.createUrlTree(['/']);
      })
    );
  }
}

import { inject, Injectable } from '@angular/core';
import {
  CanActivate,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RedirectIfLoggedInGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      map(user => {
        const redirecionar = !!user;
        return redirecionar ? this.router.createUrlTree(['/home/vendas']) : true;
      })
    );
  }
}

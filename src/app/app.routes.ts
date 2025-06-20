import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { HomeComponent } from './pages/area-logada/home/home.component';
import { LoginComponent } from './pages/area-nao-logada/login/login.component';
import { RegisterComponent } from './pages/area-nao-logada/register/register.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { RedirectIfLoggedInGuard } from './core/guards/redirect/redirect.guards';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        canActivate: [RedirectIfLoggedInGuard],

    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [RedirectIfLoggedInGuard],
    },
    {
    path: 'mfe',
    loadComponent: () =>
        loadRemoteModule('control-farm-mfe', './Component').then((m) => m.AppComponent),
  },{
    path: '**',
    redirectTo: '',
  },
];

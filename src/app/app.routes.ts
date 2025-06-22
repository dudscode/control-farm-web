import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { HomeComponent } from './pages/area-logada/home/home.component';
import { LoginComponent } from './pages/area-nao-logada/login/login.component';
import { RegisterComponent } from './pages/area-nao-logada/register/register.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { RedirectIfLoggedInGuard } from './core/guards/redirect/redirect.guards';
import { NotFoundComponent } from './pages/area-nao-logada/not-found/not-found.component';

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
        children: [
            {
                path: 'vendas',
                loadComponent: () =>
                    loadRemoteModule('control-farm-mfe', './Vendas').then((m) => m.VendasComponent),
            },
            {
                path: 'producao',
                loadComponent: () =>
                    loadRemoteModule('control-farm-mfe', './Producao').then((m) => m.ProducaoComponent),
            },
            {
                path: 'metas',
                loadComponent: () =>
                    loadRemoteModule('control-farm-mfe', './Metas').then((m) => m.MetasComponent),
            },
            {
                path: '**',
                loadComponent: () =>
                    loadRemoteModule('control-farm-mfe', './Vendas').then((m) => m.VendasComponent),
            },
        ]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [RedirectIfLoggedInGuard],
    },
    {
        path: 'not-found',
        component: NotFoundComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];

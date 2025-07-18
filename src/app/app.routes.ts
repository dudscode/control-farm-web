import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { HomeComponent } from './pages/area-logada/home/home.component';
import { LoginComponent } from './pages/area-nao-logada/login/login.component';
import { RegisterComponent } from './pages/area-nao-logada/register/register.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { RedirectIfLoggedInGuard } from './core/guards/redirect/redirect.guards';
import { NotFoundComponent } from './pages/area-nao-logada/not-found/not-found.component';
import { AlterarPerfilComponent } from './pages/area-logada/alterar-perfil/alterar-perfil.component';
import { ResetPasswordComponent } from './pages/area-logada/reset-password/reset-password.component';

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
                path: 'cadastro-vendas',
                loadComponent: () =>
                    loadRemoteModule('control-farm-mfe', './CadastroVendas').then((m) => m.CadastroVendasComponent),
            },
            {
                path: 'producao',
                loadComponent: () =>
                    loadRemoteModule('control-farm-mfe', './Producao').then((m) => m.ProducaoComponent),
            },
            {
                path: 'cadastro-produtos',
                loadComponent: () =>
                    loadRemoteModule('control-farm-mfe', './CadastroProdutos').then((m) => m.CadastroProdutosComponent),
            },
            {
                path: 'metas',
                loadComponent: () =>
                    loadRemoteModule('control-farm-mfe', './Metas').then((m) => m.MetasComponent),
            },
            {
                path: 'cadastro-metas',
                loadComponent: () =>
                    loadRemoteModule('control-farm-mfe', './CadastroMetas').then((m) => m.CadastroMetasComponent),
            },
            {
                path: 'alterar-perfil',
                component: AlterarPerfilComponent
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent
            },
            {
                path: '**',
                redirectTo: 'vendas',
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

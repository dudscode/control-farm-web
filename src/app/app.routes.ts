import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { HomeComponent } from './pages/area-logada/home/home.component';
import { LoginComponent } from './pages/area-nao-logada/login/login.component';
import { RegisterComponent } from './pages/area-nao-logada/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent

    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
    path: 'mfe',
    loadComponent: () =>
        loadRemoteModule('control-farm-mfe', './Component').then((m) => m.AppComponent),
  },
];

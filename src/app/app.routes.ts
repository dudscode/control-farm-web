import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'

    },
    {
    path: 'mfe',
    loadComponent: () =>
        loadRemoteModule('control-farm-mfe', './Component').then((m) => m.AppComponent),
  },
];

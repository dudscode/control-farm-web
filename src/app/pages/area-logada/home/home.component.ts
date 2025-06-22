import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MenuComponent } from '../../../shared/components/menu/menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatSidenavModule, MenuComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  
}

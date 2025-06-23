import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuComponent } from '../../../shared/components/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-home',
  imports: [MatSidenavModule, MenuComponent, RouterOutlet, HeaderComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private userService = inject(UserService);

  ngOnInit() {
    const uuid = sessionStorage.getItem('uuid_farm') ?? localStorage.getItem('uuid_farm');
    if (uuid) {
      this.userService.getUserProfile(uuid).subscribe();
    }
  }


}

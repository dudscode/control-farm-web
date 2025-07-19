import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuComponent } from '../../../shared/components/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-home',
  imports: [MatSidenavModule, MenuComponent, RouterOutlet, HeaderComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.authService.getUserProfile().subscribe(_ =>{
      this.notificationService.getNotificationsCount();
    });
  }


}

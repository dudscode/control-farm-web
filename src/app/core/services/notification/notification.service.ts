import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
export interface INotification {
  message: string;
  read: boolean;
  title: string;
  id: string;
}
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private authService = inject(AuthService);
  notificationsCount = signal(0);
  notification = signal<INotification[]>([]);

  getNotificationsCount() {
    this.authService.getNotifications().subscribe((notifications: INotification[]) => {
      this.notification.set(notifications);
      this.notificationsCount.set(notifications.filter(n => !n.read).length);
    });
  }

  markAsRead() {
    if(this.notificationsCount()) {
      this.authService.markAllNotificationsAsRead().subscribe();
    }
  }
}

import { Component, inject } from '@angular/core';
import {
  IonBadge,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline,
  createOutline,
  homeOutline,
  notificationsOutline,
  settingsOutline,
} from 'ionicons/icons';
import { TranslatePipe } from '../core/pipes/translate.pipe';
import { AuthService } from '../core/services/auth.service';
import { NotificationsService } from '../core/services/notifications.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonBadge,
    TranslatePipe,
  ],
})
export class TabsPage {
  readonly auth = inject(AuthService);
  readonly isEmployer = this.auth.isEmployer;
  readonly unread = inject(NotificationsService).unreadCount;

  constructor() {
    addIcons({
      homeOutline,
      createOutline,
      settingsOutline,
      briefcaseOutline,
      notificationsOutline,
    });
  }
}

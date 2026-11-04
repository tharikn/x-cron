import { Component, computed, inject } from '@angular/core';
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
  person,
  personOutline,
  settingsOutline,
} from 'ionicons/icons';
import { TranslatePipe } from '../core/pipes/translate.pipe';
import { AuthService } from '../core/services/auth.service';
import { LocaleService } from '../core/services/locale.service';
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
  private readonly auth = inject(AuthService);
  private readonly locale = inject(LocaleService);

  readonly isEmployer = this.auth.isEmployer;
  readonly isSignedIn = this.auth.isSignedIn;
  readonly unread = inject(NotificationsService).unreadCount;
  readonly profileTabLabel = computed(() => {
    if (!this.auth.isSignedIn()) {
      return this.locale.t('nav.signIn') || 'Sign in';
    }
    const u = this.auth.user();
    const name =
      u?.displayName?.trim() ||
      u?.username?.trim() ||
      u?.email?.trim() ||
      this.locale.t('nav.account') ||
      'Account';
    return name.length > 12 ? `${name.slice(0, 11)}…` : name;
  });

  constructor() {
    addIcons({
      homeOutline,
      createOutline,
      settingsOutline,
      briefcaseOutline,
      notificationsOutline,
      personOutline,
      person,
    });
  }
}

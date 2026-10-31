import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { AuthService } from './core/services/auth.service';
import { NotificationsService } from './core/services/notifications.service';
import { PreferencesService } from './core/services/preferences.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly preferences = inject(PreferencesService);
  private readonly notifications = inject(NotificationsService);

  async ngOnInit(): Promise<void> {
    await this.auth.refreshMe();
    await this.preferences.hydrate();
    await this.notifications.registerDevice();
    if (this.auth.isSignedIn()) {
      try {
        await this.notifications.loadPrefs();
        await this.notifications.refreshInbox();
      } catch {
        // optional until signed in with API
      }
    }
  }
}

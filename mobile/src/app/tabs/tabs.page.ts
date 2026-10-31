import { Component, inject } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline,
  createOutline,
  homeOutline,
  megaphoneOutline,
  personOutline,
  optionsOutline,
} from 'ionicons/icons';
import { TranslatePipe } from '../core/pipes/translate.pipe';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, TranslatePipe],
})
export class TabsPage {
  readonly auth = inject(AuthService);
  readonly isAdmin = this.auth.isAdmin;

  constructor() {
    addIcons({
      homeOutline,
      createOutline,
      optionsOutline,
      briefcaseOutline,
      personOutline,
      megaphoneOutline,
    });
  }
}

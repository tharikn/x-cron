import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import {
  AdsService,
  type AdminCreative,
  type AdminPlacement,
} from '../../core/services/ads.service';

@Component({
  selector: 'app-ads-admin',
  templateUrl: './ads-admin.page.html',
  styleUrls: ['./ads-admin.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonButton,
  ],
})
export class AdsAdminPage implements OnInit {
  private readonly ads = inject(AdsService);
  private readonly toastController = inject(ToastController);

  readonly creatives = signal<AdminCreative[]>([]);
  readonly placements = signal<AdminPlacement[]>([]);

  slot: 'discover_feed' | 'job_detail_footer' | 'web_home_rail' = 'discover_feed';
  kind: 'house' | 'third_party' | 'employer_promo' = 'house';
  advertiser = 'X Cron';
  headline = '';
  body = '';
  ctaLabel = 'Learn more';
  targetUrl = '/tabs/account';
  active = true;
  priority = 10;
  editId = '';

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    try {
      const [creatives, placements] = await Promise.all([
        this.ads.adminListCreatives(),
        this.ads.adminListPlacements(),
      ]);
      this.creatives.set(creatives.items);
      this.placements.set(placements.items);
    } catch {
      await this.showToast('Could not load ad admin data. Sign in as admin.');
    }
  }

  edit(creative: AdminCreative): void {
    this.editId = creative.id;
    this.slot = creative.slot as typeof this.slot;
    this.kind = creative.kind as typeof this.kind;
    this.advertiser = creative.advertiser;
    this.headline = creative.headline;
    this.body = creative.body;
    this.ctaLabel = creative.ctaLabel;
    this.targetUrl = creative.targetUrl;
    this.active = creative.active;
    this.priority = creative.priority;
  }

  resetForm(): void {
    this.editId = '';
    this.headline = '';
    this.body = '';
    this.ctaLabel = 'Learn more';
    this.active = true;
    this.priority = 10;
  }

  async saveCreative(): Promise<void> {
    if (!this.headline.trim() || !this.body.trim()) {
      await this.showToast('Headline and body are required.');
      return;
    }
    try {
      await this.ads.adminUpsertCreative({
        ...(this.editId ? { id: this.editId } : {}),
        slot: this.slot,
        kind: this.kind,
        advertiser: this.advertiser.trim() || 'X Cron',
        headline: this.headline.trim(),
        body: this.body.trim(),
        ctaLabel: this.ctaLabel.trim() || 'Learn more',
        targetUrl: this.targetUrl.trim() || '/tabs/discover',
        active: this.active,
        priority: Number(this.priority) || 0,
      });
      this.resetForm();
      await this.reload();
      await this.showToast('Creative saved.');
    } catch {
      await this.showToast('Could not save creative.');
    }
  }

  async togglePlacement(placement: AdminPlacement): Promise<void> {
    try {
      await this.ads.adminUpsertPlacement(placement.slot, {
        enabled: !placement.enabled,
        maxPerSession: placement.maxPerSession,
        frequencyCapPerDay: placement.frequencyCapPerDay,
        label: placement.label,
      });
      await this.reload();
    } catch {
      await this.showToast('Could not update placement.');
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      color: 'dark',
    });
    await toast.present();
  }
}

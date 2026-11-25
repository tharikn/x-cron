import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import type {
  PortfolioDocument,
  PortfolioSiteSummary,
} from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.service';
import { PortfolioRendererComponent } from '../../shared/portfolio-renderer/portfolio-renderer.component';
import { ListSkeletonComponent } from '../../shared/skeleton/list-skeleton.component';

@Component({
  selector: 'app-portfolio-detail',
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonButton,
    IonBadge,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonTextarea,
    PortfolioRendererComponent,
    ListSkeletonComponent,
  ],
  templateUrl: './portfolio-detail.page.html',
  styleUrls: ['./portfolio-detail.page.scss'],
})
export class PortfolioDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly portfolio = inject(PortfolioService);
  private readonly toastCtrl = inject(ToastController);

  private async showToast(message: string): Promise<void> {
    const t = await this.toastCtrl.create({ message, duration: 2200, position: 'bottom' });
    await t.present();
  }

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly publishing = signal(false);
  readonly site = signal<PortfolioSiteSummary | null>(null);
  readonly draft = signal<PortfolioDocument | null>(null);
  readonly tab = signal<'preview' | 'quick-edit'>('preview');

  heroHeadline = '';
  heroSubheadline = '';
  aboutBio = '';

  private siteId = '';

  async ngOnInit(): Promise<void> {
    this.siteId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.siteId) {
      this.loading.set(false);
      return;
    }
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await this.portfolio.loadDraft(this.siteId);
      this.site.set(res.site);
      this.draft.set(res.document);
      this.syncQuickFields(res.document);
    } catch {
      await this.showToast('Could not load portfolio.');
    } finally {
      this.loading.set(false);
    }
  }

  private syncQuickFields(doc: PortfolioDocument): void {
    const loc = doc.site.defaultLocale || 'en-IN';
    const sections = doc.pages[0]?.sections ?? [];
    const hero = sections.find((s) => s.type === 'hero');
    const about = sections.find((s) => s.type === 'about');

    const readLoc = (val: unknown): string => {
      if (typeof val === 'string') return val;
      if (val && typeof val === 'object') {
        const rec = val as Record<string, string>;
        return rec[loc] ?? rec['en-IN'] ?? Object.values(rec)[0] ?? '';
      }
      return '';
    };

    this.heroHeadline = readLoc(hero?.props['headline']);
    this.heroSubheadline = readLoc(hero?.props['subheadline']);
    this.aboutBio = readLoc(about?.props['body']);
  }

  async saveQuickEdit(): Promise<void> {
    const doc = this.draft();
    const s = this.site();
    if (!doc || !s) return;

    const loc = doc.site.defaultLocale || 'en-IN';
    const cloned: PortfolioDocument = JSON.parse(JSON.stringify(doc));
    const sections = cloned.pages[0]?.sections ?? [];
    const hero = sections.find((sec) => sec.type === 'hero');
    const about = sections.find((sec) => sec.type === 'about');

    if (hero) {
      hero.props['headline'] = {
        ...((hero.props['headline'] as Record<string, string>) || {}),
        [loc]: this.heroHeadline,
      };
      hero.props['subheadline'] = {
        ...((hero.props['subheadline'] as Record<string, string>) || {}),
        [loc]: this.heroSubheadline,
      };
    }

    if (about) {
      about.props['body'] = {
        ...((about.props['body'] as Record<string, string>) || {}),
        [loc]: this.aboutBio,
      };
    }

    this.saving.set(true);
    try {
      const updated = await this.portfolio.saveDraft(
        this.siteId,
        cloned,
        s.revision,
      );
      this.site.set(updated.site);
      this.draft.set(cloned);
      await this.showToast('Draft saved!');
      this.tab.set('preview');
    } catch {
      await this.showToast('Save failed. Please reload and try again.');
    } finally {
      this.saving.set(false);
    }
  }

  async publish(): Promise<void> {
    this.publishing.set(true);
    try {
      await this.portfolio.publish(this.siteId);
      await this.load();
      await this.showToast('Portfolio published!');
    } catch {
      await this.showToast('Publish failed. Ensure sections are valid.');
    } finally {
      this.publishing.set(false);
    }
  }
}

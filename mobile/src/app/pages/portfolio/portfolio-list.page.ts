import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import type {
  PortfolioSiteSummary,
  PortfolioTemplateSummary,
} from '../../core/models/portfolio.model';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ListSkeletonComponent } from '../../shared/skeleton/list-skeleton.component';

@Component({
  selector: 'app-portfolio-list',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    ListSkeletonComponent,
  ],
  templateUrl: './portfolio-list.page.html',
  styleUrls: ['./portfolio-list.page.scss'],
})
export class PortfolioListPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly portfolio = inject(PortfolioService);
  private readonly toastCtrl = inject(ToastController);
  private readonly router = inject(Router);

  private async showToast(message: string): Promise<void> {
    const t = await this.toastCtrl.create({ message, duration: 2200, position: 'bottom' });
    await t.present();
  }

  readonly isSignedIn = this.auth.isSignedIn;
  readonly sites = this.portfolio.sites;
  readonly templates = signal<PortfolioTemplateSummary[]>([]);
  readonly loading = signal(true);
  readonly creating = signal(false);
  readonly busyId = signal<string | null>(null);
  readonly showCreate = signal(false);

  form = {
    name: '',
    templateId: 'minimal-swiss-01',
    slug: '',
    defaultLocale: 'en-IN',
  };

  async ngOnInit(): Promise<void> {
    await this.auth.ensureSession();
    if (!this.auth.isSignedIn()) {
      this.loading.set(false);
      return;
    }
    await Promise.all([this.reload(), this.loadTemplates()]);
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    try {
      await this.portfolio.listSites();
    } catch {
      await this.showToast('Could not load portfolios.');
    } finally {
      this.loading.set(false);
    }
  }

  async loadTemplates(): Promise<void> {
    try {
      const list = await this.portfolio.listTemplates();
      this.templates.set(list);
      if (list.length > 0 && !list.some((t) => t.id === this.form.templateId)) {
        this.form.templateId = list[0].id;
      }
    } catch {
      // Ignore if offline
    }
  }

  async createSite(): Promise<void> {
    const name = this.form.name.trim();
    if (!name) {
      await this.showToast('Please enter a portfolio name.');
      return;
    }
    this.creating.set(true);
    try {
      const created = await this.portfolio.createSite({
        name,
        templateId: this.form.templateId,
        slug: this.form.slug.trim() || undefined,
        defaultLocale: this.form.defaultLocale,
      });
      this.form.name = '';
      this.form.slug = '';
      this.showCreate.set(false);
      await this.reload();
      await this.showToast('Portfolio created!');
      await this.router.navigate(['/tabs/portfolio', created.id]);
    } catch (err: unknown) {
      const msg = (err as { error?: { message?: string } })?.error?.message || 'Could not create portfolio.';
      await this.showToast(msg);
    } finally {
      this.creating.set(false);
    }
  }

  async togglePublish(site: PortfolioSiteSummary): Promise<void> {
    this.busyId.set(site.id);
    try {
      if (site.status === 'published') {
        await this.portfolio.unpublish(site.id);
        await this.showToast('Portfolio unpublished.');
      } else {
        await this.portfolio.publish(site.id);
        await this.showToast('Portfolio published!');
      }
      await this.reload();
    } catch {
      await this.showToast('Action failed. Check portfolio completeness.');
    } finally {
      this.busyId.set(null);
    }
  }
}

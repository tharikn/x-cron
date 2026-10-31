import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonText,
} from '@ionic/angular';
import type { Job } from '../../core/models/job.model';
import { LocaleService } from '../../core/services/locale.service';
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
} from '../../core/utils/format';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss'],
  imports: [
    RouterLink,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonText,
  ],
})
export class JobCardComponent {
  private readonly locale = inject(LocaleService);

  @Input({ required: true }) job!: Job;

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly languageLabel = (code: string) => this.locale.label(code);
}

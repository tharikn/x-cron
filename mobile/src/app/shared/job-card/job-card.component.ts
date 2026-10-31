import { Component, Input } from '@angular/core';
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
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
  languageLabel,
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
  @Input({ required: true }) job!: Job;

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly languageLabel = languageLabel;
}

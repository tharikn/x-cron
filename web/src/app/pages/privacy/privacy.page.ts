import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  templateUrl: './privacy.page.html',
  styleUrl: './privacy.page.scss',
})
export class PrivacyPage implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Privacy',
      description:
        'How X Cron Jobs handles account data, preferences, and device notifications.',
      path: '/privacy',
      robots: 'noindex,follow',
    });
  }
}

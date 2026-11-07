import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-terms',
  imports: [RouterLink],
  templateUrl: './terms.page.html',
  styleUrl: './terms.page.scss',
})
export class TermsPage implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Terms',
      description: 'Basic terms of use for the X Cron Jobs MVP.',
      path: '/terms',
    });
  }
}

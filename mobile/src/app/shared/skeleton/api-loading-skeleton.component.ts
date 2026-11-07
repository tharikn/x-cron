import { Component } from '@angular/core';

/** Global API busy — thin top shimmer bar (not a centered icon stack). */
@Component({
  selector: 'app-api-loading-skeleton',
  template: `
    <div class="api-loading__bar" aria-hidden="true">
      <span class="api-loading__shimmer"></span>
    </div>
  `,
})
export class ApiLoadingSkeletonComponent {}

import { Component } from '@angular/core';

/**
 * Global API / navigation busy indicator — thin top shimmer bar only.
 * Page content uses layout-matched skeletons; never a centered “icon” stack.
 */
@Component({
  selector: 'app-api-loading-skeleton',
  template: `
    <div class="api-loading__bar" aria-hidden="true">
      <span class="api-loading__shimmer"></span>
    </div>
  `,
})
export class ApiLoadingSkeletonComponent {}

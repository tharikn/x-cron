import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'locations/:state/:city',
    loadComponent: () =>
      import('./pages/location/location.page').then((m) => m.LocationPage),
  },
  {
    path: 'jobs',
    children: [
      {
        path: '**',
        loadComponent: () =>
          import('./pages/job-detail/job-detail.page').then((m) => m.JobDetailPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

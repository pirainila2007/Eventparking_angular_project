import {
  Routes
} from '@angular/router';

import {
  Login
} from './pages/login/login';

import {
  CustomerDashboard
} from './pages/customer-dashboard/customer-dashboard';

import {
  Events
} from './pages/events/events';

import {
  authGuard
} from './core/guards/auth.guard';

import {
  MyBookings
} from './pages/my-bookings/my-bookings';

export const routes:
  Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'customer/dashboard',

    component:
      CustomerDashboard,

    canActivate: [
      authGuard
    ]
  },

  {
    path: 'customer/events',

    component:
      Events,

    canActivate: [
      authGuard
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  },

  {
  path: 'customer/bookings',

  component:
    MyBookings,

  canActivate: [
    authGuard
  ]
}

];

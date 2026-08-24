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

import {
  Payment
} from './pages/payment/payment';

import {
  Receipt
} from './pages/receipt/receipt';

import {
  Notifications
} from './pages/notifications/notifications';

import {
  SeatSelection
} from './pages/seat-selection/seat-selection';

import {
  ParkingSelection
} from './pages/parking-selection/parking-selection';

import {
  BookingReview
} from './pages/booking-review/booking-review';

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
},

{
  path: 'customer/payment/:bookingId',

  component: Payment,

  canActivate: [
    authGuard
  ]
},

{
  path: 'customer/receipt/:paymentId',

  component: Receipt,

  canActivate: [
    authGuard
  ]
},

{
  path: 'customer/notifications',

  component: Notifications,

  canActivate: [
    authGuard
  ]
},

{
  path:
    'customer/booking/:eventId/seats',

  component:
    SeatSelection,

  canActivate: [
    authGuard
  ]
},

{
  path:
    'customer/booking/:eventId/parking',

  component:
    ParkingSelection,

  canActivate: [
    authGuard
  ]
},

{
  path:
    'customer/booking/:eventId/review',

  component:
    BookingReview,

  canActivate: [
    authGuard
  ]
},

];


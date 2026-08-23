import {
  Component,
  computed,
  OnInit,
  signal
} from '@angular/core';

import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../../services/auth';

import {
  DashboardService
} from '../../services/dashboard';

import {
  CustomerDashboard as CustomerDashboardData
} from '../../models/dashboard.model';


@Component({
  selector: 'app-customer-dashboard',

  imports: [
    DatePipe,
    DecimalPipe
  ],

  templateUrl:
    './customer-dashboard.html',

  styleUrl:
    './customer-dashboard.css',
})
export class CustomerDashboard
  implements OnInit {


  fullName =
    localStorage.getItem(
      'fullName'
    ) ?? 'Customer';


  email =
    localStorage.getItem(
      'email'
    ) ?? '';


  isLoading =
    signal(true);


  errorMessage =
    signal('');


  dashboard =
    signal<CustomerDashboardData | null>(
      null
    );


  totalPaid = computed(() => {

    const data =
      this.dashboard();

    if (!data) {
      return 0;
    }

    return data.recentPayments.reduce(
      (
        total,
        payment
      ) =>
        total + payment.amount,
      0
    );

  });


  constructor(

    private dashboardService:
      DashboardService,

    private authService:
      AuthService,

    private router:
      Router

  ) {}


  ngOnInit(): void {

    this.loadDashboard();

  }


  loadDashboard(): void {

    this.errorMessage.set('');

    this.isLoading.set(true);


    const customerIdValue =
      localStorage.getItem(
        'customerId'
      );


    if (!customerIdValue) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Customer information is missing. Please sign in again.'
      );

      return;

    }


    const customerId =
      Number(customerIdValue);


    if (
      Number.isNaN(customerId)
    ) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Invalid customer information. Please sign in again.'
      );

      return;

    }


    this.dashboardService
      .getCustomerDashboard(
        customerId
      )
      .subscribe({

        next: (response) => {

          this.dashboard.set(
            response
          );

          this.isLoading.set(false);

        },


        error: (error) => {

          console.error(
            'Dashboard error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Unable to load your dashboard. Please try again.'
          );

        }

      });

  }


  refresh(): void {

    this.loadDashboard();

  }


  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}
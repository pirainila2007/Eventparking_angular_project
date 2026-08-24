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
  BookingService
} from '../../services/booking';

import {
  CustomerBooking
} from '../../models/booking.model';

@Component({
  selector: 'app-my-bookings',

  imports: [
    DatePipe,
    DecimalPipe
  ],

  templateUrl:
    './my-bookings.html',

  styleUrl:
    './my-bookings.css',
})
export class MyBookings
  implements OnInit {

  fullName =
    localStorage.getItem(
      'fullName'
    ) ?? 'Customer';


  email =
    localStorage.getItem(
      'email'
    ) ?? '';


  bookings =
    signal<CustomerBooking[]>([]);


  isLoading =
    signal(true);


  errorMessage =
    signal('');


  successMessage =
    signal('');


  cancellingId =
    signal<number | null>(null);


  activeBookings =
    computed(() =>
      this.bookings().filter(
        booking =>
          booking.status
            .toLowerCase()
            !== 'cancelled'
      )
    );


  cancelledBookings =
    computed(() =>
      this.bookings().filter(
        booking =>
          booking.status
            .toLowerCase()
            === 'cancelled'
      )
    );


  totalSpent =
    computed(() => {

      return this.bookings()
        .filter(
          booking =>
            booking.paymentStatus
              .toLowerCase()
              === 'paid'
        )
        .reduce(
          (
            total,
            booking
          ) =>
            total +
            booking.totalAmount,
          0
        );

    });


  constructor(

    private bookingService:
      BookingService,

    private authService:
      AuthService,

    private router:
      Router

  ) {}


  ngOnInit(): void {

    this.loadBookings();

  }


  loadBookings(): void {

    this.errorMessage.set('');

    this.successMessage.set('');

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
      !Number.isInteger(customerId) ||
      customerId <= 0
    ) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Invalid customer information.'
      );

      return;

    }


    this.bookingService
      .getCustomerHistory(
        customerId
      )
      .subscribe({

        next: response => {

          this.bookings.set(
            response ?? []
          );

          this.isLoading.set(false);

        },


        error: error => {

          console.error(
            'Booking history error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Unable to load your bookings.'
          );

        }

      });

  }


  canCancel(
    booking: CustomerBooking
  ): boolean {

    const status =
      booking.status
        .toLowerCase();

    return (
      status !== 'cancelled' &&
      status !== 'expired'
    );

  }


  cancelBooking(
    booking: CustomerBooking
  ): void {

    if (
      !this.canCancel(booking)
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        `Cancel booking ${booking.bookingNumber}?`
      );


    if (!confirmed) {
      return;
    }


    this.errorMessage.set('');

    this.successMessage.set('');

    this.cancellingId.set(
      booking.bookingId
    );


    this.bookingService
      .cancelBooking(
        booking.bookingId
      )
      .subscribe({

        next: response => {

          this.cancellingId.set(
            null
          );

          this.successMessage.set(
            response.message ||
            'Booking cancelled successfully.'
          );

          this.bookings.update(
            items =>
              items.map(
                item =>
                  item.bookingId
                    === booking.bookingId
                    ? {
                        ...item,
                        status: 'Cancelled'
                      }
                    : item
              )
          );

        },


        error: error => {

          console.error(
            'Cancel booking error:',
            error
          );

          this.cancellingId.set(
            null
          );

          this.errorMessage.set(
            error.error?.message ||
            'Unable to cancel booking.'
          );

        }

      });

  }


  goToDashboard(): void {

    this.router.navigate([
      '/customer/dashboard'
    ]);

  }


  goToEvents(): void {

    this.router.navigate([
      '/customer/events'
    ]);

  }

    payBooking(
  booking: CustomerBooking
): void {

  this.router.navigate([
    '/customer/payment',
    booking.bookingId
  ]);

}


  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}
import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  BookingService
} from '../../services/booking';

import {
  PaymentService
} from '../../services/payment';

import {
  AuthService
} from '../../services/auth';

import {
  CustomerBooking
} from '../../models/booking.model';

import {
  PaymentResponse
} from '../../models/payment.model';

@Component({
  selector: 'app-payment',

  imports: [
    DatePipe,
    DecimalPipe
  ],

  templateUrl: './payment.html',

  styleUrl: './payment.css',
})
export class Payment implements OnInit {

  fullName =
    localStorage.getItem('fullName')
    ?? 'Customer';


  booking =
    signal<CustomerBooking | null>(
      null
    );


  payment =
    signal<PaymentResponse | null>(
      null
    );


  selectedMethod =
    signal('Card');


  isLoading =
    signal(true);


  isPaying =
    signal(false);


  errorMessage =
    signal('');


  successMessage =
    signal('');


  bookingId = 0;


  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private bookingService:
      BookingService,

    private paymentService:
      PaymentService,

    private authService:
      AuthService

  ) {}


  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get(
          'bookingId'
        )
      );


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Invalid booking ID.'
      );

      return;

    }


    this.bookingId = id;

    this.loadBooking();

  }


  loadBooking(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');


    this.bookingService
      .getBookingById(
        this.bookingId
      )
      .subscribe({

        next: response => {

          this.booking.set(
            response
          );

          this.isLoading.set(false);

        },


        error: error => {

          console.error(
            'Booking load error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            error.error?.message ||
            'Unable to load booking information.'
          );

        }

      });

  }


  selectMethod(
    method: string
  ): void {

    this.selectedMethod.set(
      method
    );

  }


  canPay(): boolean {

    const currentBooking =
      this.booking();


    if (!currentBooking) {
      return false;
    }


    const bookingStatus =
      currentBooking.status
        ?.toLowerCase();


    const paymentStatus =
      currentBooking.paymentStatus
        ?.toLowerCase();


    return (
      bookingStatus !== 'cancelled' &&
      bookingStatus !== 'expired' &&
      paymentStatus !== 'paid'
    );

  }


  payNow(): void {

    if (
      !this.canPay() ||
      this.isPaying()
    ) {

      return;

    }


    this.errorMessage.set('');

    this.successMessage.set('');

    this.isPaying.set(true);


    this.paymentService
      .createPayment({

        bookingId:
          this.bookingId,

        paymentMethod:
          this.selectedMethod()

      })
      .subscribe({

        next: response => {

          this.isPaying.set(false);

          this.payment.set(
            response
          );


          this.successMessage.set(
            'Payment completed successfully.'
          );


          this.booking.update(
            booking => {

              if (!booking) {
                return booking;
              }

              return {
                ...booking,
                status:
                  'Confirmed',

                paymentStatus:
                  'Paid'
              };

            }
          );

        },


        error: error => {

          console.error(
            'Payment error:',
            error
          );

          this.isPaying.set(false);


          if (error.status === 409) {

            this.errorMessage.set(
              error.error?.message ||
              'This booking has already been paid.'
            );

            return;

          }


          if (error.status === 400) {

            this.errorMessage.set(
              error.error?.message ||
              'Payment cannot be completed for this booking.'
            );

            return;

          }


          this.errorMessage.set(
            error.error?.message ||
            'Payment failed. Please try again.'
          );

        }

      });

  }
viewReceipt(): void {

  const paymentData =
    this.payment();


  if (!paymentData) {
    return;
  }


  this.router.navigate([
    '/customer/receipt',
    paymentData.paymentId
  ]);

}

  goToBookings(): void {

    this.router.navigate([
      '/customer/bookings'
    ]);

  }


  goToDashboard(): void {

    this.router.navigate([
      '/customer/dashboard'
    ]);

  }


  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}
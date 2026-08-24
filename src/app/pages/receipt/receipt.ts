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
  PaymentService
} from '../../services/payment';

import {
  BookingService
} from '../../services/booking';

import {
  PaymentResponse
} from '../../models/payment.model';

import {
  CustomerBooking
} from '../../models/booking.model';


@Component({
  selector: 'app-receipt',

  imports: [
    DatePipe,
    DecimalPipe
  ],

  templateUrl: './receipt.html',

  styleUrl: './receipt.css',
})
export class Receipt implements OnInit {

  payment =
    signal<PaymentResponse | null>(
      null
    );


  booking =
    signal<CustomerBooking | null>(
      null
    );


  isLoading =
    signal(true);


  errorMessage =
    signal('');


  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private paymentService:
      PaymentService,

    private bookingService:
      BookingService

  ) {}


  ngOnInit(): void {

    const paymentId =
      Number(
        this.route.snapshot.paramMap.get(
          'paymentId'
        )
      );


    if (
      !Number.isInteger(paymentId) ||
      paymentId <= 0
    ) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Invalid payment ID.'
      );

      return;

    }


    this.loadReceipt(
      paymentId
    );

  }


  loadReceipt(
    paymentId: number
  ): void {

    this.isLoading.set(true);

    this.errorMessage.set('');


    this.paymentService
      .getPaymentById(
        paymentId
      )
      .subscribe({

        next: paymentResponse => {

          this.payment.set(
            paymentResponse
          );


          this.bookingService
            .getBookingById(
              paymentResponse.bookingId
            )
            .subscribe({

              next: bookingResponse => {

                this.booking.set(
                  bookingResponse
                );

                this.isLoading.set(
                  false
                );

              },


              error: error => {

                console.error(
                  'Booking receipt error:',
                  error
                );

                this.isLoading.set(
                  false
                );

                this.errorMessage.set(
                  'Payment was found, but booking details could not be loaded.'
                );

              }

            });

        },


        error: error => {

          console.error(
            'Payment receipt error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            error.error?.message ||
            'Unable to load receipt.'
          );

        }

      });

  }


  printReceipt(): void {

    window.print();

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

}
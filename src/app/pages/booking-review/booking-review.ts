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
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  EventService
} from '../../services/event';

import {
  SeatService
} from '../../services/seat';

import {
  ParkingSlotService
} from '../../services/parking-slot';

import {
  BookingService
} from '../../services/booking';

import {
  ParkingEvent
} from '../../models/event.model';

import {
  EventSeat
} from '../../models/seat.model';

import {
  ParkingSlot
} from '../../models/parking-slot.model';

@Component({
  selector: 'app-booking-review',

  imports: [
    DatePipe,
    DecimalPipe
  ],

  templateUrl:
    './booking-review.html',

  styleUrl:
    './booking-review.css',
})
export class BookingReview
  implements OnInit {

  eventId = 0;


  event =
    signal<ParkingEvent | null>(
      null
    );


  seats =
    signal<EventSeat[]>([]);


  parkingSlots =
    signal<ParkingSlot[]>([]);


  selectedSeatIds =
    signal<number[]>([]);


  selectedParkingSlotId =
    signal<number | null>(
      null
    );


  isLoading =
    signal(true);


  isCreating =
    signal(false);


  errorMessage =
    signal('');


  selectedSeats =
    computed(() => {

      const ids =
        this.selectedSeatIds();

      return this.seats()
        .filter(
          seat =>
            ids.includes(
              seat.seatId
            )
        );

    });


  selectedParking =
    computed(() => {

      const id =
        this.selectedParkingSlotId();

      if (id === null) {
        return null;
      }

      return this.parkingSlots()
        .find(
          slot =>
            slot.parkingSlotId
              === id
        ) ?? null;

    });


  seatTotal =
    computed(() => {

      return this.selectedSeats()
        .reduce(
          (
            total,
            seat
          ) =>
            total + seat.price,
          0
        );

    });


  parkingTotal =
    computed(() => {

      return (
        this.selectedParking()
          ?.fee ?? 0
      );

    });


  grandTotal =
    computed(() => {

      return (
        this.seatTotal()
        +
        this.parkingTotal()
      );

    });


  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private eventService:
      EventService,

    private seatService:
      SeatService,

    private parkingSlotService:
      ParkingSlotService,

    private bookingService:
      BookingService

  ) {}


  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot
          .paramMap
          .get('eventId')
      );


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Invalid event ID.'
      );

      return;

    }


    this.eventId = id;

    this.restoreBookingSelection();

  }


  restoreBookingSelection(): void {

    const storedEventId =
      Number(
        sessionStorage.getItem(
          'bookingEventId'
        )
      );


    const seatValue =
      sessionStorage.getItem(
        'bookingSeatIds'
      );


    if (
      storedEventId !== this.eventId ||
      !seatValue
    ) {

      this.router.navigate([
        '/customer/booking',
        this.eventId,
        'seats'
      ]);

      return;

    }


    try {

      const seatIds =
        JSON.parse(
          seatValue
        ) as number[];


      if (
        !Array.isArray(seatIds) ||
        seatIds.length === 0
      ) {

        this.router.navigate([
          '/customer/booking',
          this.eventId,
          'seats'
        ]);

        return;

      }


      this.selectedSeatIds.set(
        seatIds
      );


      const parkingId =
        Number(
          sessionStorage.getItem(
            'bookingParkingSlotId'
          )
        );


      if (
        Number.isInteger(parkingId) &&
        parkingId > 0
      ) {

        this.selectedParkingSlotId.set(
          parkingId
        );

      }


      this.loadEvent();

    }

    catch {

      this.router.navigate([
        '/customer/booking',
        this.eventId,
        'seats'
      ]);

    }

  }


  loadEvent(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');


    this.eventService
      .getEventById(
        this.eventId
      )
      .subscribe({

        next: response => {

          this.event.set(
            response
          );

          this.loadSeats();

        },


        error: error => {

          console.error(
            'Event error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Unable to load event details.'
          );

        }

      });

  }


  loadSeats(): void {

    this.seatService
      .getEventSeats(
        this.eventId
      )
      .subscribe({

        next: response => {

          this.seats.set(
            response ?? []
          );

          this.loadParking();

        },


        error: error => {

          console.error(
            'Seat review error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Unable to load selected seats.'
          );

        }

      });

  }


  loadParking(): void {

    this.parkingSlotService
      .getEventParkingSlots(
        this.eventId
      )
      .subscribe({

        next: response => {

          this.parkingSlots.set(
            response ?? []
          );

          this.isLoading.set(false);

        },


        error: error => {

          console.error(
            'Parking review error:',
            error
          );

          this.parkingSlots.set([]);

          this.isLoading.set(false);

        }

      });

  }


  confirmBooking(): void {

    if (
      this.isCreating()
    ) {
      return;
    }


    const customerId =
      Number(
        localStorage.getItem(
          'customerId'
        )
      );


    if (
      !Number.isInteger(customerId) ||
      customerId <= 0
    ) {

      this.errorMessage.set(
        'Customer information is missing. Please login again.'
      );

      return;

    }


    if (
      this.selectedSeats()
        .length === 0
    ) {

      this.errorMessage.set(
        'At least one seat is required.'
      );

      return;

    }


    this.errorMessage.set('');

    this.isCreating.set(true);


    this.bookingService
      .createBooking({

        customerId:
          customerId,

        eventId:
          this.eventId,

        totalSeats:
          this.selectedSeats()
            .length,

        totalAmount:
          this.grandTotal(),

        status:
          'Pending'

      })
      .subscribe({

        next: response => {

          this.isCreating.set(false);


          /*
           * Current backend POST /api/Booking
           * creates the booking record.
           *
           * Seat IDs / Parking ID remain
           * frontend selection state because
           * current API version does not expose
           * customer attach endpoints.
           */


          sessionStorage.removeItem(
            'bookingEventId'
          );

          sessionStorage.removeItem(
            'bookingSeatIds'
          );

          sessionStorage.removeItem(
            'bookingParkingSlotId'
          );


          this.router.navigate([
            '/customer/payment',
            response.bookingId
          ]);

        },


        error: error => {

          console.error(
            'Create booking error:',
            error
          );

          this.isCreating.set(false);


          this.errorMessage.set(
            error.error?.message ||
            'Unable to create booking. Please try again.'
          );

        }

      });

  }


  editSeats(): void {

    this.router.navigate([
      '/customer/booking',
      this.eventId,
      'seats'
    ]);

  }


  editParking(): void {

    this.router.navigate([
      '/customer/booking',
      this.eventId,
      'parking'
    ]);

  }

}
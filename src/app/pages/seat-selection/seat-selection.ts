import {
  Component,
  computed,
  OnInit,
  signal
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  SeatService
} from '../../services/seat';

import {
  EventService
} from '../../services/event';

import {
  EventSeat
} from '../../models/seat.model';

import {
  ParkingEvent
} from '../../models/event.model';


@Component({
  selector: 'app-seat-selection',

  imports: [
    DecimalPipe
  ],

  templateUrl:
    './seat-selection.html',

  styleUrl:
    './seat-selection.css',
})
export class SeatSelection
  implements OnInit {


  eventId = 0;


  event =
    signal<ParkingEvent | null>(
      null
    );


  seats =
    signal<EventSeat[]>([]);


  selectedSeatIds =
    signal<number[]>([]);


  isLoading =
    signal(true);


  errorMessage =
    signal('');


  selectedSeats =
    computed(() => {

      const ids =
        this.selectedSeatIds();

      return this.seats().filter(
        seat =>
          ids.includes(
            seat.seatId
          )
      );

    });


  totalAmount =
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


  availableCount =
    computed(() => {

      return this.seats()
        .filter(
          seat =>
            this.isAvailable(
              seat
            )
        )
        .length;

    });


  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private seatService:
      SeatService,

    private eventService:
      EventService

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

    this.loadPage();

  }


  loadPage(): void {

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
            'Event load error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Unable to load event information.'
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

          this.isLoading.set(false);

        },


        error: error => {

          console.error(
            'Seat load error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Unable to load event seats.'
          );

        }

      });

  }


  isAvailable(
    seat: EventSeat
  ): boolean {

    return (
      seat.status
        ?.toLowerCase()
        === 'available'
    );

  }


  isSelected(
    seatId: number
  ): boolean {

    return this.selectedSeatIds()
      .includes(
        seatId
      );

  }


  toggleSeat(
    seat: EventSeat
  ): void {

    if (
      !this.isAvailable(seat)
    ) {

      return;

    }


    this.selectedSeatIds.update(
      current => {

        if (
          current.includes(
            seat.seatId
          )
        ) {

          return current.filter(
            id =>
              id !== seat.seatId
          );

        }


        return [
          ...current,
          seat.seatId
        ];

      }
    );

  }


  clearSelection(): void {

    this.selectedSeatIds.set([]);

  }


  continueToParking(): void {

    if (
      this.selectedSeatIds()
        .length === 0
    ) {

      this.errorMessage.set(
        'Please select at least one seat.'
      );

      return;

    }


    sessionStorage.setItem(
      'bookingEventId',
      this.eventId.toString()
    );


    sessionStorage.setItem(
      'bookingSeatIds',
      JSON.stringify(
        this.selectedSeatIds()
      )
    );


    this.router.navigate([
      '/customer/booking',
      this.eventId,
      'parking'
    ]);

  }


  goBack(): void {

    this.router.navigate([
      '/customer/events'
    ]);

  }

}
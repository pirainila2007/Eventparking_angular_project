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
  ParkingSlotService
} from '../../services/parking-slot';

import {
  EventService
} from '../../services/event';

import {
  ParkingSlot
} from '../../models/parking-slot.model';

import {
  ParkingEvent
} from '../../models/event.model';

@Component({
  selector: 'app-parking-selection',

  imports: [
    DecimalPipe
  ],

  templateUrl:
    './parking-selection.html',

  styleUrl:
    './parking-selection.css',
})
export class ParkingSelection
  implements OnInit {

  eventId = 0;

  event =
    signal<ParkingEvent | null>(
      null
    );

  parkingSlots =
    signal<ParkingSlot[]>([]);

  selectedParkingId =
    signal<number | null>(
      null
    );

  selectedSeatIds =
    signal<number[]>([]);

  isLoading =
    signal(true);

  errorMessage =
    signal('');


  selectedParking =
    computed(() => {

      const parkingId =
        this.selectedParkingId();

      if (parkingId === null) {
        return null;
      }

      return this.parkingSlots()
        .find(
          slot =>
            slot.parkingSlotId
              === parkingId
        ) ?? null;

    });


  availableCount =
    computed(() => {

      return this.parkingSlots()
        .filter(
          slot =>
            this.isAvailable(slot)
        )
        .length;

    });


  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private parkingSlotService:
      ParkingSlotService,

    private eventService:
      EventService

  ) {}


  ngOnInit(): void {

    const eventId =
      Number(
        this.route.snapshot
          .paramMap
          .get('eventId')
      );

    if (
      !Number.isInteger(eventId) ||
      eventId <= 0
    ) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Invalid event ID.'
      );

      return;
    }

    this.eventId = eventId;

    this.restoreSeatSelection();

    this.loadEvent();

  }


  restoreSeatSelection(): void {

    const storedEventId =
      Number(
        sessionStorage.getItem(
          'bookingEventId'
        )
      );

    const storedSeats =
      sessionStorage.getItem(
        'bookingSeatIds'
      );

    if (
      storedEventId !== this.eventId ||
      !storedSeats
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
          storedSeats
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

          this.loadParkingSlots();

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


  loadParkingSlots(): void {

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
            'Parking load error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Unable to load parking spaces.'
          );

        }

      });

  }


  isAvailable(
    slot: ParkingSlot
  ): boolean {

    return (
      slot.status
        ?.toLowerCase()
        === 'available'
    );

  }


  isSelected(
    parkingSlotId: number
  ): boolean {

    return (
      this.selectedParkingId()
        === parkingSlotId
    );

  }


  selectParking(
    slot: ParkingSlot
  ): void {

    if (
      !this.isAvailable(slot)
    ) {
      return;
    }

    if (
      this.selectedParkingId()
        === slot.parkingSlotId
    ) {

      this.selectedParkingId.set(
        null
      );

      return;
    }

    this.selectedParkingId.set(
      slot.parkingSlotId
    );

  }


  continueBooking(): void {

    const selected =
      this.selectedParking();

    if (selected) {

      sessionStorage.setItem(
        'bookingParkingSlotId',
        selected.parkingSlotId
          .toString()
      );

    } else {

      sessionStorage.removeItem(
        'bookingParkingSlotId'
      );

    }

    this.router.navigate([
      '/customer/booking',
      this.eventId,
      'review'
    ]);

  }


  skipParking(): void {

    this.selectedParkingId.set(
      null
    );

    sessionStorage.removeItem(
      'bookingParkingSlotId'
    );

    this.continueBooking();

  }


  goBack(): void {

    this.router.navigate([
      '/customer/booking',
      this.eventId,
      'seats'
    ]);

  }

}
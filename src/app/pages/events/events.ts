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
  EventService
} from '../../services/event';

import {
  AuthService
} from '../../services/auth';

import {
  ParkingEvent
} from '../../models/event.model';


@Component({
  selector: 'app-events',

  imports: [
    DatePipe,
    DecimalPipe
  ],

  templateUrl: './events.html',

  styleUrl: './events.css',
})
export class Events implements OnInit {

  fullName =
    localStorage.getItem(
      'fullName'
    ) ?? 'Customer';


  email =
    localStorage.getItem(
      'email'
    ) ?? '';


  events =
    signal<ParkingEvent[]>([]);


  isLoading =
    signal(true);


  errorMessage =
    signal('');


  searchTerm =
    signal('');


  selectedCategory =
    signal('All');


  selectedEvent =
    signal<ParkingEvent | null>(
      null
    );


  detailsLoading =
    signal(false);


  categories = computed(() => {

    const names =
      this.events()
        .map(
          event =>
            event.category
              ?.categoryName
        )
        .filter(
          (
            category
          ): category is string =>
            !!category
        );


    return [
      'All',
      ...Array.from(
        new Set(names)
      )
    ];

  });


  filteredEvents = computed(() => {

    const category =
      this.selectedCategory();


    if (category === 'All') {

      return this.events();

    }


    return this.events().filter(
      event =>
        event.category
          ?.categoryName === category
    );

  });


  constructor(

    private eventService:
      EventService,

    private authService:
      AuthService,

    private router:
      Router

  ) {}


  ngOnInit(): void {

    this.loadUpcomingEvents();

  }


  loadUpcomingEvents(): void {

    this.errorMessage.set('');

    this.isLoading.set(true);

    this.selectedCategory.set(
      'All'
    );


    this.eventService
      .getUpcomingEvents()
      .subscribe({

        next: (
          response
        ) => {

          this.events.set(
            response
          );

          this.isLoading.set(false);

        },


        error: (
          error
        ) => {

          console.error(
            'Events error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Unable to load upcoming events. Please try again.'
          );

        }

      });

  }


  searchEvents(): void {

    const keyword =
      this.searchTerm()
        .trim();


    if (!keyword) {

      this.loadUpcomingEvents();

      return;

    }


    this.errorMessage.set('');

    this.isLoading.set(true);

    this.selectedCategory.set(
      'All'
    );


    this.eventService
      .searchEvents(
        keyword
      )
      .subscribe({

        next: (
          response
        ) => {

          this.events.set(
            response
          );

          this.isLoading.set(false);

        },


        error: (
          error
        ) => {

          console.error(
            'Search error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Unable to search events.'
          );

        }

      });

  }


  clearSearch(): void {

    this.searchTerm.set('');

    this.loadUpcomingEvents();

  }


  selectCategory(
    category: string
  ): void {

    this.selectedCategory.set(
      category
    );

  }


  openEventDetails(
    eventId: number
  ): void {

    this.detailsLoading.set(
      true
    );

    this.selectedEvent.set(
      null
    );


    this.eventService
      .getEventById(
        eventId
      )
      .subscribe({

        next: (
          response
        ) => {

          this.selectedEvent.set(
            response
          );

          this.detailsLoading.set(
            false
          );

        },


        error: (
          error
        ) => {

          console.error(
            'Event details error:',
            error
          );

          this.detailsLoading.set(
            false
          );

          this.errorMessage.set(
            'Unable to load event details.'
          );

        }

      });

  }
bookEvent(
  eventId: number
): void {

  this.closeEventDetails();

  this.router.navigate([
    '/customer/booking',
    eventId,
    'seats'
  ]);

}

  closeEventDetails(): void {

    this.selectedEvent.set(
      null
    );

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
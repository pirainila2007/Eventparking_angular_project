import {
  Component,
  computed,
  OnInit,
  signal
} from '@angular/core';

import {
  DatePipe
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  NotificationService
} from '../../services/notification';

import {
  AuthService
} from '../../services/auth';

import {
  CustomerNotification
} from '../../models/notification.model';

@Component({
  selector: 'app-notifications',

  imports: [
    DatePipe
  ],

  templateUrl:
    './notifications.html',

  styleUrl:
    './notifications.css',
})
export class Notifications
  implements OnInit {

  fullName =
    localStorage.getItem(
      'fullName'
    ) ?? 'Customer';


  email =
    localStorage.getItem(
      'email'
    ) ?? '';


  notifications =
    signal<CustomerNotification[]>([]);


  isLoading =
    signal(true);


  errorMessage =
    signal('');


  markingId =
    signal<number | null>(null);


  unreadCount =
    computed(() =>
      this.notifications()
        .filter(
          notification =>
            !notification.isRead
        )
        .length
    );


  readCount =
    computed(() =>
      this.notifications()
        .filter(
          notification =>
            notification.isRead
        )
        .length
    );


  constructor(

    private notificationService:
      NotificationService,

    private authService:
      AuthService,

    private router:
      Router

  ) {}


  ngOnInit(): void {

    this.loadNotifications();

  }


  loadNotifications(): void {

    this.errorMessage.set('');

    this.isLoading.set(true);


    const customerIdValue =
      localStorage.getItem(
        'customerId'
      );


    if (!customerIdValue) {

      this.isLoading.set(false);

      this.errorMessage.set(
        'Customer information is missing.'
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


    this.notificationService
      .getCustomerNotifications(
        customerId
      )
      .subscribe({

        next: response => {

          this.notifications.set(
            response ?? []
          );

          this.isLoading.set(false);

        },


        error: error => {

          console.error(
            'Notification error:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Unable to load notifications.'
          );

        }

      });

  }


  markAsRead(
    notification:
      CustomerNotification
  ): void {

    if (
      notification.isRead ||
      this.markingId()
        === notification.notificationId
    ) {

      return;

    }


    this.markingId.set(
      notification.notificationId
    );


    this.notificationService
      .markAsRead(
        notification.notificationId
      )
      .subscribe({

        next: () => {

          this.notifications.update(
            notifications =>
              notifications.map(
                item =>
                  item.notificationId
                    === notification.notificationId
                    ? {
                        ...item,
                        isRead: true
                      }
                    : item
              )
          );


          this.markingId.set(
            null
          );

        },


        error: error => {

          console.error(
            'Mark notification error:',
            error
          );

          this.markingId.set(
            null
          );

          this.errorMessage.set(
            error.error?.message ||
            'Unable to mark notification as read.'
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


  goToBookings(): void {

    this.router.navigate([
      '/customer/bookings'
    ]);

  }


  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}
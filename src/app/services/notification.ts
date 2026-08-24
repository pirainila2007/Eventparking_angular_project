import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CustomerNotification
} from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly apiUrl =
    '/api/Notification';

  constructor(
    private http: HttpClient
  ) {}


  getCustomerNotifications(
    customerId: number
  ): Observable<CustomerNotification[]> {

    return this.http.get<CustomerNotification[]>(
      `${this.apiUrl}/customer/${customerId}`
    );

  }


  markAsRead(
    notificationId: number
  ): Observable<unknown> {

    return this.http.put(
      `${this.apiUrl}/${notificationId}/read`,
      {}
    );

  }

}
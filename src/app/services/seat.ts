import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  EventSeat
} from '../models/seat.model';

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  private readonly apiUrl =
    '/api/Seat';

  constructor(
    private http: HttpClient
  ) {}


  getEventSeats(
    eventId: number
  ): Observable<EventSeat[]> {

    return this.http.get<EventSeat[]>(
      `${this.apiUrl}/event/${eventId}`
    );

  }

}
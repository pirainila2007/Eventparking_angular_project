import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  ParkingEvent
} from '../models/event.model';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly apiUrl =
    '/api/Event';


  constructor(
    private http: HttpClient
  ) {}


  getAllEvents():
    Observable<ParkingEvent[]> {

    return this.http.get<ParkingEvent[]>(
      this.apiUrl
    );

  }


  getUpcomingEvents():
    Observable<ParkingEvent[]> {

    return this.http.get<ParkingEvent[]>(
      `${this.apiUrl}/upcoming`
    );

  }


  getEventById(
    eventId: number
  ): Observable<ParkingEvent> {

    return this.http.get<ParkingEvent>(
      `${this.apiUrl}/${eventId}`
    );

  }


  searchEvents(
    keyword: string
  ): Observable<ParkingEvent[]> {

    const params =
      new HttpParams()
        .set(
          'keyword',
          keyword
        );

    return this.http.get<ParkingEvent[]>(
      `${this.apiUrl}/search`,
      {
        params
      }
    );

  }

}
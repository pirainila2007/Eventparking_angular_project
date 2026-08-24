import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ParkingSlot
} from '../models/parking-slot.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingSlotService {

  private readonly apiUrl =
    '/api/ParkingSlot';

  constructor(
    private http: HttpClient
  ) {}

  getEventParkingSlots(
    eventId: number
  ): Observable<ParkingSlot[]> {

    return this.http.get<ParkingSlot[]>(
      `${this.apiUrl}/event/${eventId}`
    );
  }
}
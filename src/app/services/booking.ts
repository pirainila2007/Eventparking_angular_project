import {
  HttpClient
} from '@angular/common/http';

import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  CreateBookingRequest,
  CreateBookingResponse,
  CustomerBooking
} from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly apiUrl =
    '/api/Booking';


  constructor(
    private http: HttpClient
  ) {}


  createBooking(
    request: CreateBookingRequest
  ): Observable<CreateBookingResponse> {

    return this.http.post<CreateBookingResponse>(
      this.apiUrl,
      request
    );

  }


  getCustomerHistory(
    customerId: number
  ): Observable<CustomerBooking[]> {

    return this.http.get<CustomerBooking[]>(
      `${this.apiUrl}/history/${customerId}`
    );

  }


  getBookingById(
    bookingId: number
  ): Observable<CustomerBooking> {

    return this.http.get<CustomerBooking>(
      `${this.apiUrl}/${bookingId}`
    );

  }


  cancelBooking(
    bookingId: number
  ): Observable<{
    message: string;
  }> {

    return this.http.put<{
      message: string;
    }>(
      `${this.apiUrl}/cancel/${bookingId}`,
      {}
    );

  }

}
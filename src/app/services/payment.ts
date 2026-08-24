import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CreatePaymentRequest,
  PaymentResponse
} from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly apiUrl = '/api/Payment';

  constructor(
    private http: HttpClient
  ) {}


  createPayment(
    request: CreatePaymentRequest
  ): Observable<PaymentResponse> {

    return this.http.post<PaymentResponse>(
      this.apiUrl,
      request
    );

  }


  getPaymentById(
    paymentId: number
  ): Observable<PaymentResponse> {

    return this.http.get<PaymentResponse>(
      `${this.apiUrl}/${paymentId}`
    );

  }

  
}
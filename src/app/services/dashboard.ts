import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CustomerDashboard
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl =
    '/api/Dashboard';

  constructor(
    private http: HttpClient
  ) {}

  getCustomerDashboard(
    customerId: number
  ): Observable<CustomerDashboard> {

    return this.http.get<CustomerDashboard>(
      `${this.apiUrl}/customer/${customerId}`
    );

  }

}
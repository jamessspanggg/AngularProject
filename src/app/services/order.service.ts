import { Injectable } from '@angular/core';
import { Order } from '../shared/order';
import { Observable, of } from 'rxjs';
import { map, catchError, timestamp } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(baseURL + 'orders')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  addOrder(order: Order): Observable<Order> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Order>(baseURL + 'orders', order, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}

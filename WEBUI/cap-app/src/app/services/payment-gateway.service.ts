import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayService {

  constructor(
    private http: HttpClient

  ) {

  }
  private getForteConfigApiMethod = "/api/ForteConfig";
  private getForteConfigApiMethod360 = "/api/ForteConfig/GetAllForteConfig360/";
  private checkoutsessionWithoutDiscount = '/api/Payments/create-checkout-session-WithoutDiscount';
  private checkoutsession = '/api/Payments/create-checkout-session';
  private success = '/order/success'
  private apiCheckPaymentIsDone = '/api/Payments/CheckPaymentIsDone';
  private PayviaBank = '/api/Payments/DirectToBankPay';
  getForteConfig360(EmailId: any): Observable<any> {
    const options = {
      params: {
        EmailId
      }
    };

    return this.http.get<any>(`${environment.apiUrl}${this.getForteConfigApiMethod360}${EmailId}`)
      .pipe(catchError(this.handleError));
  }

  getForteConfig(EmailId: any): Observable<any> {
    const options = {
      params: {
        EmailId
      }
    };

    return this.http.get<any>(`${environment.apiUrl}${this.getForteConfigApiMethod}`, options)
      .pipe(catchError(this.handleError));
  }
  OrderSuccess(session_id: any): Observable<any> {
    const options = {
      params: {
        session_id: session_id

      }
    };
    return this.http.get<any>(`${environment.apiUrl}${this.success}`, options)
      .pipe(catchError(this.handleError));
  }

  CreateCheckoutSession(obj: any): Observable<any> {
    const options = {
      params: {
        EmailId: obj.EmailId,
        priceId: obj.priceId,
        StudentId: obj.StudentId
      }
    };
    return this.http.get<any>(`${environment.apiUrl}${this.checkoutsession}`, options)
      .pipe(catchError(this.handleError));
  }
  PayViaBank(obj: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${this.PayviaBank}`, obj)
      .pipe(catchError(this.handleError));
  }
  CheckPaymentIsDone(obj: any): Observable<any> {

    const options = {
      params: {
        EmailId: obj.EmailId,
        Program: obj.Program
      }
    };
    return this.http.get<any>(`${environment.apiUrl}${this.apiCheckPaymentIsDone}`, options)
      .pipe(catchError(this.handleError));
  }

  CreateCheckoutSessionWithoutDiscount(obj: any): Observable<any> {

    const options = {
      params: {
        EmailId: obj.EmailId,
        priceId: obj.priceId,
        StudentId: obj.StudentId,
      }
    };
    return this.http.get<any>(`${environment.apiUrl}${this.checkoutsessionWithoutDiscount}`, options)
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err) {
      if (err && err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = `An error occurred: ${err.error.message}`;
      } else if (err) {
        errorMessage = `${err['text']}`;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `Server returned code: ${err && err.status}, error message is: ${err.message
          }`;
      }
      return throwError(err);
    }
  }
}

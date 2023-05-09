import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private readonly URL = environment.api

  constructor(private http: HttpClient) { }

  consultarPagos(subcontrato: any): Observable<any> {
    const body = {
      subcontrato
    }

    /* return this.http.post(`${this.URL}/pago/${subcontrato}`) */
    return this.http.post(`${this.URL}/pago/`, body)

  }

}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private readonly URL = environment.api
  private dataSubject = new Subject<any>();

  constructor(private http: HttpClient) { }

  consultarPagos(subcontrato: any): Observable<any> {
    const body = {
      subcontrato
    }
    return this.http.post(`${this.URL}/pago/`, body)
  }

  modificarPago(body : any): Observable<any> {

    return this.http.put(`${this.URL}/pago/valor`, body)
  }

  cargarPago(body : any): Observable<any> {

    return this.http.put(`${this.URL}/pago/cargar`, body)
  }
}

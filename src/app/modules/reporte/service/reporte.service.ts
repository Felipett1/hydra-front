import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private readonly URL = environment.api

  constructor(private http: HttpClient) { }

  obtenerServicioTiempo(body: any): Observable<any> {
    return this.http.post(`${this.URL}/servicio/reporte`, body)
  }

  obtenerPagoTiempo(body: any): Observable<any> {
    return this.http.post(`${this.URL}/pago/reporte`, body)
  }
}

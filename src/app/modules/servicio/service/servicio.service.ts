import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private readonly URL = environment.api

  constructor(private http: HttpClient) { }

  consultarContrato(cliente: number): Observable<any> {
    const body = {
      cliente
    }
    return this.http.post(`${this.URL}/subcontrato/cliente`, body)
  }

  consultarCliente(cliente: number): Observable<any> {
    return this.http.get(`${this.URL}/cliente/${cliente}`)
  }

  consultarEstadoContrato(id: number): Observable<any> {
    const body = {
      id
    }
    return this.http.post(`${this.URL}/subcontrato/IdEstado`, body)
  }

  consultarHistoricoServicios(id: number): Observable<any> {
    const body = {
      id
    }
    return this.http.post(`${this.URL}/servicio/subcontrato`, body)
  }
}

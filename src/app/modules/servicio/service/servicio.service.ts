import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private readonly URL = environment.api
  private dataSubject = new Subject<any>();

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

  consultarHistoricoServiciosActivos(id: number): Observable<any> {
    const body = {
      id
    }
    return this.http.post(`${this.URL}/servicio/subcontrato/activo`, body)
  }

  crearServicio(body: any): Observable<any> {
    return this.http.put(`${this.URL}/servicio`, body)
  }

  cerrarServicio(body: any): Observable<any> {
    return this.http.put(`${this.URL}/servicio/cerrar`, body)
  }

  crearNovedadServicio(body: any): Observable<any> {
    return this.http.put(`${this.URL}/novedad/servicio/crear`, body)
  }

  consultarNovedadServicio(body: any): Observable<any> {
    return this.http.post(`${this.URL}/novedad/servicio/consulta`, body)
  }

  notificarServicio(body: any): Observable<any> {
    return this.http.post(`${this.URL}/notificacion/servicio`, body)
  }

  //Utilidades
  sendData(data: any): void {
    this.dataSubject.next(data);
  }

  getData(): Subject<any> {
    return this.dataSubject;
  }
}

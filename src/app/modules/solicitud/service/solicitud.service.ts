import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private readonly URL = environment.api
  public consulta: any
  constructor(private http: HttpClient) { }

  notificarSolicitud(body: any): Observable<any> {
    return this.http.post(`${this.URL}/notificacion/solicitud`, body)
  }

}

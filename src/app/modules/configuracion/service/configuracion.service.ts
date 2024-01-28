import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private readonly URL = environment.api

  constructor(private http: HttpClient) { }

  consultarUsuarios(): Observable<any> {
    return this.http.get(`${this.URL}/usuario`)
  }

  modificarUsuario(body: any): Observable<any> {
    return this.http.post(`${this.URL}/usuario/clave`, body)
  }
}

import { environment } from './../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreRegistroService {
  private readonly URL = environment.api

  constructor(private http: HttpClient) { 
    
  }

  preRegistro(nombre: string, correo: string, celular: number): Observable<any> {
    const body = {
      nombre,
      correo,
      celular
    }
    return this.http.post(`${this.URL}/notificacion/PreRegistro`, body)
  }

}

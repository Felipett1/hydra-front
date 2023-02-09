import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LoginService { private readonly URL = environment.api

  constructor(private http: HttpClient) { 
  }

  autenticar(usuario: string, clave: string): Observable<any> {
    const body = {
      usuario,
      clave
    }
    return this.http.post(`${this.URL}/usuario/autenticar`, body)
  }

  
  ntfRecuperar(usuario: string): Observable<any> {
    const body = {
      usuario
    }
    return this.http.post(`${this.URL}/notificacion/Recuperacion`, body)
  }
}

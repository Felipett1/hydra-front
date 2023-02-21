import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private readonly URL = environment.api
  public consulta: any

  constructor(private http: HttpClient) {
  }

  consultarContrato(cliente: number): Observable<any> {
    const body = {
      cliente
    }
    return this.http.post(`${this.URL}/contrato/cliente`, body)
  }

  consultarCliente(cliente: number): Observable<any> {
    const body = {
      cliente
    }
    return this.http.get(`${this.URL}/cliente/${cliente}`)
  }

  consultarBeneficiario(contrato: number): Observable<any> {
    const body = {
      contrato
    }
    return this.http.post(`${this.URL}/beneficiario`, body)
  }

  consultarEstadoContrato(cliente: number): Observable<any> {
    const body = {
      cliente
    }
    return this.http.post(`${this.URL}/contrato/clienteEstado`, body)
  }

  consultarHistoricoServicios(id: number): Observable<any> {
    const body = {
      id
    }
    return this.http.post(`${this.URL}/servicio/contrato`, body)
  }

  crear(usuario: string): Observable<any> {
    const body = {
      usuario
    }
    return this.http.post(`${this.URL}/notificacion/Recuperacion`, body)
  }

  modificar(usuario: string): Observable<any> {
    const body = {
      usuario
    }
    return this.http.post(`${this.URL}/notificacion/Recuperacion`, body)
  }

  cerrar(usuario: string): Observable<any> {
    const body = {
      usuario
    }
    return this.http.post(`${this.URL}/notificacion/Recuperacion`, body)
  }

  agregarBeneficiario(item: any) {
    if (this.consulta) {
      if (this.consulta.beneficiarios) {
        this.consulta.beneficiarios.push(item)
      } else {
        this.consulta.beneficiarios = [item]
      }
    }
  }

  modificarBeneficiario(item: any, index: any) {
    //console.log(this.consulta)
    //this.consulta.beneficiarios[index] = item;
  }
}
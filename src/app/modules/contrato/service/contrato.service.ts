import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private readonly URL = environment.api
  public consulta: any
  private dataSubject = new Subject<any>();

  constructor(private http: HttpClient) {
  }

  consultarContrato(cliente: number): Observable<any> {
    const body = {
      cliente
    }
    return this.http.post(`${this.URL}/subcontrato/cliente`, body)
  }

  consultarCliente(cliente: number): Observable<any> {
    return this.http.get(`${this.URL}/cliente/${cliente}`)
  }

  consultarBeneficiario(subcontrato: number): Observable<any> {
    const body = {
      subcontrato
    }
    return this.http.post(`${this.URL}/beneficiario`, body)
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

  consultarCiudades(): Observable<any> {
    return this.http.get(`https://www.datos.gov.co/resource/xdk5-pm3f.json`)
  }

  crearSubcontrato(body: any): Observable<any> {
    return this.http.post(`${this.URL}/subcontrato`, body)
  }

  modificarSubcontrato(body: any): Observable<any> {
    return this.http.put(`${this.URL}/subcontrato`, body)
  }

  
  cerrarSubcontrato(body: any): Observable<any> {
    return this.http.put(`${this.URL}/cierreSubcontrato`, body)
  }

  //Utilidades
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

  sendData(data: any): void {
    this.dataSubject.next(data);
  }

  getData(): Subject<any> {
    return this.dataSubject;
  }
}
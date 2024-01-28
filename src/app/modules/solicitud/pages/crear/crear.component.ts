import { Router } from '@angular/router';
import { SolicitudService } from './../../service/solicitud.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {
  solicitud = this._formBuilder.group({
    juridica: false,
    financiera: false,
    educacion: false,
    documental: false,
    especializada: false,
    especializada_beneficiario: false,
    funerario: false,
    consulta: false,
    otros: false,
    detalle: ['', Validators.required]
  });

  consulta!: any

  constructor(private _formBuilder: FormBuilder, private solicitudService: SolicitudService,
    private datePipe: DatePipe, private router: Router) { }

  async ngOnInit() {
    this.consulta = this.solicitudService.consulta
  }

  limpiar() {
    this.solicitud.reset()
  }

  async solicitarServicio() {
    if (this.solicitud.invalid) {
      this.solicitud.markAllAsTouched();
    } else if (!this.validarSeleccion()) {
      this.alertaAdvertencia('Debe seleccionar por lo menos un servicio')
    } else {
      var respuesta = await this.solicitudService.notificarSolicitud(this.mapeoSolicitud(this.solicitud.value)).toPromise();
      if (respuesta && respuesta?.codigo == 0) {
        this.alertaExitoso('Solicitud creada exitosamente!');
      } else {
        this.alertaError(respuesta.detalle)
      }
    }
  }

  validarSeleccion() {
    let opciones = this.solicitud.value
    if (opciones.documental || opciones.educacion || opciones.especializada || opciones.especializada_beneficiario
      || opciones.financiera || opciones.funerario || opciones.juridica || opciones.consulta || opciones.otros) {
      return true
    } else {
      return false
    }
  }

  mapeoSolicitud(solicitud: any) {
    var data = {
      subcontrato: this.consulta.subcontrato.id,
      fecha: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      documento: this.consulta.cliente.documento,
      nombre_completo: this.consulta.cliente.nombre_completo,
      celular: this.consulta.subcontrato.celular,
      correo: this.consulta.subcontrato.correo,
      servicio: this.opcionesSeleccionadas(),
      detalle: solicitud.detalle,
    }
    return data
  }

  opcionesSeleccionadas() {
    let opciones = this.solicitud.value
    let seleccion = []
    if (opciones.documental) { seleccion.push('Gestion documental') }
    if (opciones.educacion) { seleccion.push('Asesoria Educación y recreación') }
    if (opciones.especializada) { seleccion.push('Medicina especializada') }
    if (opciones.especializada_beneficiario) { seleccion.push('Medicina especializada beneficiarios') }
    if (opciones.financiera) { seleccion.push('Asesoria Financiera') }
    if (opciones.funerario) { seleccion.push('Servicio Funerario') }
    if (opciones.juridica) { seleccion.push('Asesoria Juridica') }
    if (opciones.consulta) { seleccion.push('Otros') }
    if (opciones.otros) { seleccion.push('Otros') }
    return seleccion.map(opcion => opcion).join(', ')
  }

  alertaAdvertencia(mensaje: string): void {
    Swal.fire({
      title: 'Alerta',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }

  alertaExitoso(mensaje: string): void {
    Swal.fire({
      title: 'Transacción exitosa',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      preConfirm: () => {
        return this.router.navigate(['inicio', 'subcontrato']);
      }
    });
  }
  alertaError(mensaje: string): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }
}


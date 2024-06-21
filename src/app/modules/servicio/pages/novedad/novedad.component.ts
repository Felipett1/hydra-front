import { ServicioService } from './../../service/servicio.service';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-novedad',
  templateUrl: './novedad.component.html',
  styleUrls: ['./novedad.component.css']
})
export class NovedadComponent {
  formulario: FormGroup = new FormGroup({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private servicioService: ServicioService) {

  }

  ngOnInit(): void {
    this.formulario = new FormGroup(
      {
        detalle: new FormControl('', [Validators.required]),
      }
    )
  }

  async confirmar() {
    let formulario = this.formulario.value
    formulario.servicio = this.data.secuencia
    formulario.novedad = 'Actualización'
    var respuesta = await this.servicioService.crearNovedadServicio(formulario).toPromise();
    if (respuesta && respuesta.codigo == 0) {
      this.alertaExitoso('Novedad registrada correctamente exitosamente!');
    } else {
      this.alertaError(respuesta.detalle)
    }
  }

  alertaExitoso(mensaje: string): void {
    Swal.fire({
      title: 'Transacción exitosa',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar'
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

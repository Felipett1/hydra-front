import { ContratoService } from './../../service/contrato.service';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cerrar',
  templateUrl: './cerrar.component.html',
  styleUrls: ['./cerrar.component.css']
})
export class CerrarComponent {
  formulario: FormGroup = new FormGroup({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private contratoService: ContratoService,) {

  }

  ngOnInit(): void {
    this.formulario = new FormGroup(
      {
        causal: new FormControl('', [Validators.required]),
      }
    )
  }

  async confirmar() {
    let formulario = this.formulario.value
    formulario.subcontrato = this.data.subcontrato
    formulario.fecha_fin = new Date()
    var respuesta = await this.contratoService.cerrarSubcontrato(formulario).toPromise();;
    if (respuesta && respuesta.codigo == 0) {
      this.alertaExitoso('¡Subcontrato cerrado exitosamente!');
    } else {
      this.alertaError(respuesta.detalle)
    }
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

import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent {
  formulario: FormGroup = new FormGroup({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {

  }

  ngOnInit(): void {
    this.formulario = new FormGroup(
      {
        tipo: new FormControl('', [Validators.required]),
        contacto: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
        detalle: new FormControl('', [Validators.required]),
      }
    )
  }

  confirmar(): void {
    const servicio = this.formulario.value
    /*beneficiario.secuencia = (this.data.beneficiario ? this.data.beneficiario.secuencia : null)
    beneficiario.index = this.data.index
    this.contratoService.sendData(beneficiario);*/
    this.alertaExitoso('¡Servicio creado exitosamente!');
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
}

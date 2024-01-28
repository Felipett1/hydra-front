import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfiguracionService } from '@modules/configuracion/service/configuracion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./cambio-clave.component.css']
})
export class CambioClaveComponent {

  formulario: FormGroup = new FormGroup({});
  usuarios: any = []

  constructor(private configuracionService: ConfiguracionService) {

  }

  async ngOnInit() {
    this.formulario = new FormGroup(
      {
        usuario: new FormControl('', [Validators.required]),
        claveActual: new FormControl('', [Validators.required]),
        claveNueva: new FormControl('', [Validators.required]),
        confirmarNueva: new FormControl('', [Validators.required]),
      }
    )
    var respuesta = await this.configuracionService.consultarUsuarios().toPromise();
    this.usuarios = respuesta.resultados
  }

  async cambiarClave() {
    var valores = this.formulario.value
    var body = {
      id: valores.usuario,
      clave: valores.claveNueva
    }
    var respuesta = await this.configuracionService.modificarUsuario(body).toPromise();
    if (respuesta) {
      this.alertaExitoso('Contraseña cambiada exitosamente')
    } else {
      this.alertaError('No es posible procesar la transacción')
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

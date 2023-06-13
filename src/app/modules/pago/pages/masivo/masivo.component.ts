import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-masivo',
  templateUrl: './masivo.component.html',
  styleUrls: ['./masivo.component.css']
})
export class MasivoComponent {

  soporte = new FormControl('', Validators.required);
  archivo: string = ''

  cargarArchivo(event: any) {
    const file = event.target.files[0];
    if (file) {
      const nombreArchivo = file.name.split('.').slice(0, -1).join('.');
      if (file.type !== 'text/csv') {
        this.alertaAdvertencia('Solo se permiten archivos CSV.')
        this.soporte.setValue(null)
      } else if (file.size > 5000000) {
        this.alertaAdvertencia('El tamaño maximo del archivo es 5MB.')
        this.soporte.setValue(null)
      } else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            var base64textString = e.target.result;
            this.archivo = base64textString
          } catch (error) {
            this.soporte.setValue(null)
            this.alertaError('Error cargando el archivo.')
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  cargarPagos() {
    console.log(this.archivo)
  }

  alertaAdvertencia(mensaje: string): void {
    Swal.fire({
      title: 'Alerta',
      text: mensaje,
      icon: 'warning',
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

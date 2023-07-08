import { PagoService } from '@modules/pago/service/pago.service';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-masivo',
  templateUrl: './masivo.component.html',
  styleUrls: ['./masivo.component.css']
})
export class MasivoComponent {

  soporte = new FormControl('', Validators.required);
  archivo: string = ''
  archivoSalida: string = ''

  constructor(private pagoService: PagoService) {

  }

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
            var base64textString = e.target.result.split(",")[1];
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

  async cargarPagos() {
    let body = {
      archivoEntrada: this.archivo
    }
    var respuesta = await this.pagoService.cargarPagoMasivo(body).toPromise()
    if (respuesta) {
      if (respuesta.resultado) {
        this.archivoSalida = respuesta.resultado
        this.alertaExitoso('Archivo procesado')
      } else {
        this.alertaError(respuesta.detalle)
      }
    } else {
      this.alertaError('Error procesando el archivo')
    }
  }

  descargarArchivoSalida() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/[/\s:]/g, '').replace(',', '');;
    const workbook = XLSX.read(this.archivoSalida, { type: 'base64' });
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ResultadoCargueMasivo${formattedDate}.xlsx`;
    link.click();
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

  alertaExitoso(mensaje: string): void {
    Swal.fire({
      title: 'Transacción exitosa',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Descargar resultados',
      preConfirm: () => {
        this.descargarArchivoSalida()
      }
    });
  }
}

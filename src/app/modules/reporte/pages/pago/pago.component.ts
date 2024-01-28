import { ReporteService } from './../../service/reporte.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent {
  formulario: FormGroup = new FormGroup({});


  constructor(private reporteService: ReporteService) {
  }


  ngOnInit(): void {
    this.formulario = new FormGroup(
      {
        fechaInicio: new FormControl('', [Validators.required]),
        fechaFin: new FormControl('', [Validators.required])
      }
    )
  }

  async generarReporte() {
    let fechaFin = this.formulario.value.fechaFin
    //Se ajusta la hora al finalizar el día para que la consulta tome los pagos del ultimo día
    fechaFin.setHours(23);
    fechaFin.setMinutes(59);
    fechaFin.setSeconds(59);
    let body = {
      fechaInicio: this.formulario.value.fechaInicio,
      fechaFin
    }
    var respuesta = await this.reporteService.obtenerPagoTiempo(body).toPromise();
    if (respuesta.resultados) {
      let data = respuesta.resultados
      // Crear una nueva instancia de la hoja de cálculo
      const workbook = XLSX.utils.book_new();
      // Crear una nueva hoja en el libro
      const worksheet = XLSX.utils.json_to_sheet(data);
      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados');
      // Generar el archivo Excel en formato de datos binarios
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // Crear un Blob a partir de los datos binarios
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // Crear una URL para el Blob
      const url = URL.createObjectURL(blob);
      // Crear un enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      let fechaI = this.formulario.value.fechaInicio
      let fechaF = this.formulario.value.fechaFin
      link.download = `Pagos(${this.formatoFecha(fechaI)} - ${this.formatoFecha(fechaF)}).xlsx`;
      link.click();
      // Liberar la URL creada para el Blob
      URL.revokeObjectURL(url);
    } else {
      this.alertaAdvertencia(respuesta.detalle)
    }
  }

  alertaAdvertencia(mensaje: string): void {
    Swal.fire({
      title: 'Alerta',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }

  formatoFecha(fecha: any) {
    // Obtener los componentes de la fecha (año, mes y día)
    var año = fecha.getFullYear();
    var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Agregar cero inicial si el mes es menor a 10
    var día = ('0' + fecha.getDate()).slice(-2); // Agregar cero inicial si el día es menor a 10
    // Formatear la fecha en el formato "yyyy-MM-dd"
    var fechaFormateada = año + '-' + mes + '-' + día;

    return fechaFormateada; // Ejemplo de salida: "2023-05-19"
  }
}
